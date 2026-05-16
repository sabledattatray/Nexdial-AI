import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);
  private razorpay: Razorpay;

  constructor(private readonly prisma: PrismaService) {
    const key_id = process.env['RAZORPAY_KEY_ID'] || 'rzp_test_mockKeyId123456';
    const key_secret = process.env['RAZORPAY_KEY_SECRET'] || 'rzp_test_mockKeySecret123456';

    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }

  async createOrder(tenantId: string, plan: string) {
    this.logger.log(`Creating Razorpay order for tenant ${tenantId} (Plan: ${plan})`);

    // Determine pricing in paise (1 INR = 100 paise)
    let amount = 999900; // Default Enterprise plan ₹9,999 INR
    if (plan.toUpperCase() === 'PROFESSIONAL') amount = 499900; // ₹4,999 INR
    if (plan.toUpperCase() === 'STARTER') amount = 199900; // ₹1,999 INR

    try {
      const order = await this.razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `rcpt_${tenantId}_${Date.now()}`,
        notes: {
          tenantId,
          plan,
        },
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env['RAZORPAY_KEY_ID'] || 'rzp_test_mockKeyId123456',
        plan,
      };
    } catch (e) {
      this.logger.error(`Failed to create Razorpay order: ${e.message}`);
      throw new InternalServerErrorException('Payment gateway order initialization failed');
    }
  }

  async verifyPayment(tenantId: string, paymentId: string, orderId: string, signature: string) {
    this.logger.log(`Verifying Razorpay payment for order ${orderId} (Tenant: ${tenantId})`);

    const secret = process.env['RAZORPAY_KEY_SECRET'] || 'rzp_test_mockKeySecret123456';

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      this.logger.error(`Invalid payment signature for order ${orderId}`);
      throw new BadRequestException('Payment verification signature mismatch');
    }

    // Payment verified successfully! Update tenant subscription in DB
    const orderNotes = await this.getOrderNotes(orderId);
    const plan = orderNotes?.plan || 'ENTERPRISE';

    const updatedTenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionId: `sub_rzp_${paymentId}`,
        plan,
      },
    });

    this.logger.log(`Tenant ${tenantId} successfully upgraded to ${plan} plan via Razorpay`);
    return { success: true, tenant: updatedTenant };
  }

  async handleWebhook(body: any, signature: string) {
    this.logger.log(`Processing Razorpay Webhook Event: ${body.event}`);

    const webhookSecret = process.env['RAZORPAY_WEBHOOK_SECRET'] || 'rzp_webhook_secret_123';

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature && process.env['NODE_ENV'] === 'production') {
      this.logger.error('Webhook signature verification failed');
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = body.event;
    const payload = body.payload;

    if (event === 'order.paid' || event === 'payment.captured') {
      const entity = payload.payment?.entity || payload.order?.entity;
      const tenantId = entity?.notes?.tenantId;
      const plan = entity?.notes?.plan || 'ENTERPRISE';

      if (tenantId) {
        await this.prisma.tenant.update({
          where: { id: tenantId },
          data: { subscriptionId: `sub_rzp_${entity.id}`, plan },
        });
        this.logger.log(`Webhook: Tenant ${tenantId} subscription updated successfully`);
      }
    } else if (event === 'subscription.cancelled') {
      const entity = payload.subscription?.entity;
      const tenantId = entity?.notes?.tenantId;

      if (tenantId) {
        await this.prisma.tenant.update({
          where: { id: tenantId },
          data: { plan: 'CANCELLED' },
        });
        this.logger.log(`Webhook: Tenant ${tenantId} subscription cancelled`);
      }
    }

    return { received: true };
  }

  private async getOrderNotes(orderId: string): Promise<{ plan?: string; tenantId?: string } | null> {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return order.notes as { plan?: string; tenantId?: string };
    } catch (e) {
      this.logger.warn(`Could not fetch order notes for ${orderId}: ${e.message}`);
      return null;
    }
  }
}
