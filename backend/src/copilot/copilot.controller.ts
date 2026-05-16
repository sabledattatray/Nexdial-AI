import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { CopilotService } from './copilot.service';

@Controller('api/copilot')
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Post(':tenantId/analyze')
  async analyzeTranscript(
    @Param('tenantId') tenantId: string,
    @Body() body: { callId: string; messages: { role: string; text: string }[] },
  ) {
    return this.copilotService.analyzeTranscript(tenantId, body.callId, body.messages);
  }

  @Get(':tenantId/rag')
  async getRagAnswer(
    @Param('tenantId') tenantId: string,
    @Query('query') query: string,
  ) {
    return this.copilotService.getKnowledgeBaseAnswer(tenantId, query);
  }
}
