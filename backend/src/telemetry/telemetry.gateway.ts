import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TelemetryGateway.name);

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe-tenant')
  handleSubscribeTenant(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tenantId: string; userId?: string },
  ) {
    client.join(data.tenantId);
    this.logger.log(`Client ${client.id} joined tenant room: ${data.tenantId}`);
    return { status: 'subscribed', tenantId: data.tenantId };
  }

  @SubscribeMessage('agent-status-change')
  async handleAgentStatusChange(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tenantId: string; userId: string; status: any },
  ) {
    // Broadcast to all supervisors/agents in the tenant
    this.server.to(data.tenantId).emit('agent-status-updated', {
      userId: data.userId,
      status: data.status,
      timestamp: new Date().toISOString(),
    });

    try {
      await this.prisma.user.update({
        where: { id: data.userId },
        data: { status: data.status },
      });
    } catch (e) {
      this.logger.error(`Failed to update user status in DB: ${e.message}`);
    }

    return { status: 'updated' };
  }

  @SubscribeMessage('call-started')
  async handleCallStarted(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tenantId: string; callId: string; leadId: string; agentName: string; phone: string },
  ) {
    this.server.to(data.tenantId).emit('live-call-started', { ...data, startTime: new Date().toISOString() });
    return { status: 'broadcasted' };
  }

  @SubscribeMessage('transcript-message')
  async handleTranscriptMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tenantId: string; callId: string; role: string; text: string; timestamp: string },
  ) {
    this.server.to(data.tenantId).emit('live-transcript-update', data);

    try {
      await this.prisma.transcript.create({
        data: {
          callId: data.callId,
          role: data.role,
          text: data.text,
          timestamp: data.timestamp,
        },
      });
    } catch (e) {
      this.logger.error(`Failed to save transcript to DB: ${e.message}`);
    }

    return { status: 'saved' };
  }

  @SubscribeMessage('supervisor-command')
  async handleSupervisorCommand(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tenantId: string; callId: string; command: 'whisper' | 'barge' | 'disconnect'; supervisorId: string },
  ) {
    this.logger.log(`Supervisor ${data.supervisorId} executing ${data.command} on call ${data.callId}`);
    
    // Broadcast command to the specific agent handling the call
    this.server.to(data.tenantId).emit('execute-supervisor-command', data);

    if (data.command === 'disconnect') {
      try {
        await this.prisma.callLog.update({
          where: { id: data.callId },
          data: { status: 'ENDED', endedAt: new Date() },
        });
      } catch (e) {
        this.logger.error(`Failed to update call log status: ${e.message}`);
      }
    }

    return { status: 'command-sent', command: data.command };
  }
}
