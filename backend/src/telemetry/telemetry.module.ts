import { Module } from '@nestjs/common';
import { TelemetryGateway } from './telemetry.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TelemetryGateway],
  exports: [TelemetryGateway],
})
export class TelemetryModule {}
