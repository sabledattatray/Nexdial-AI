import { Controller, Post, Body, Param, Headers, HttpCode } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('api/billing')
export class BillingController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post(':tenantId/order')
  async createOrder(
    @Param('tenantId') tenantId: string,
    @Body() body: { plan: string },
  ) {
    return this.razorpayService.createOrder(tenantId, body.plan);
  }

  @Post(':tenantId/verify')
  async verifyPayment(
    @Param('tenantId') tenantId: string,
    @Body() body: { paymentId: string; orderId: string; signature: string },
  ) {
    return this.razorpayService.verifyPayment(tenantId, body.paymentId, body.orderId, body.signature);
  }

  @Post('webhook/razorpay')
  @HttpCode(200)
  async handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() body: any,
  ) {
    return this.razorpayService.handleWebhook(body, signature);
  }
}
