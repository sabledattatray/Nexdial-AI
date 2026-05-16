import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BillingController],
  providers: [RazorpayService],
  exports: [RazorpayService],
})
export class BillingModule {}
