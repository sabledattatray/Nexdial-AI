import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CrmService } from './crm.service';
import { LeadStatus } from '@prisma/client';

@Controller('api/crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get(':tenantId/campaigns')
  async getCampaigns(@Param('tenantId') tenantId: string) {
    return this.crmService.getCampaigns(tenantId);
  }

  @Post(':tenantId/campaigns')
  async createCampaign(
    @Param('tenantId') tenantId: string,
    @Body() body: { name: string; dialerType: string },
  ) {
    return this.crmService.createCampaign(tenantId, body);
  }

  @Get(':tenantId/leads')
  async getLeads(
    @Param('tenantId') tenantId: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.crmService.getLeads(tenantId, campaignId);
  }

  @Post(':tenantId/leads/import')
  async importLeads(
    @Param('tenantId') tenantId: string,
    @Body() body: { leads: { name: string; phone: string; email?: string; company?: string; campaignId?: string }[] },
  ) {
    return this.crmService.createLeads(tenantId, body.leads);
  }

  @Put(':tenantId/leads/:leadId/status')
  async updateLeadStatus(
    @Param('tenantId') tenantId: string,
    @Param('leadId') leadId: string,
    @Body() body: { status: LeadStatus; disposition?: string },
  ) {
    return this.crmService.updateLeadStatus(tenantId, leadId, body.status, body.disposition);
  }
}
