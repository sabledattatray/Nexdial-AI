import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { CopilotModule } from './copilot/copilot.module';
import { CrmModule } from './crm/crm.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [PrismaModule, TelemetryModule, CopilotModule, CrmModule, BillingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
