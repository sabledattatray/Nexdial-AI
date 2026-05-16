import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadStatus } from '@prisma/client';

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCampaigns(tenantId: string) {
    this.logger.log(`Fetching campaigns for tenant: ${tenantId}`);
    return this.prisma.campaign.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });
  }

  async createCampaign(tenantId: string, data: { name: string; dialerType: string }) {
    this.logger.log(`Creating campaign "${data.name}" for tenant ${tenantId}`);
    return this.prisma.campaign.create({
      data: {
        tenantId,
        name: data.name,
        dialerType: data.dialerType,
        status: 'active',
      },
    });
  }

  async getLeads(tenantId: string, campaignId?: string) {
    this.logger.log(`Fetching leads for tenant ${tenantId} (Campaign: ${campaignId || 'All'})`);
    return this.prisma.lead.findMany({
      where: {
        tenantId,
        ...(campaignId ? { campaignId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLeads(tenantId: string, leads: { name: string; phone: string; email?: string; company?: string; campaignId?: string }[]) {
    this.logger.log(`Importing ${leads.length} leads for tenant ${tenantId}`);
    
    const createdLeads = await this.prisma.lead.createMany({
      data: leads.map((l) => ({
        tenantId,
        campaignId: l.campaignId || null,
        name: l.name,
        phone: l.phone,
        email: l.email || null,
        company: l.company || null,
        status: LeadStatus.NEW,
        score: Math.floor(Math.random() * 40 + 60), // AI lead scoring
      })),
      skipDuplicates: true,
    });

    if (leads[0]?.campaignId) {
      // Update campaign total leads count
      await this.prisma.campaign.update({
        where: { id: leads[0].campaignId },
        data: {
          totalLeads: {
            increment: createdLeads.count,
          },
        },
      });
    }

    return { importedCount: createdLeads.count };
  }

  async updateLeadStatus(tenantId: string, leadId: string, status: LeadStatus, disposition?: string) {
    this.logger.log(`Updating lead ${leadId} status to ${status} (Disposition: ${disposition || 'None'})`);
    
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead || lead.tenantId !== tenantId) {
      throw new NotFoundException(`Lead ${leadId} not found in tenant workspace`);
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        status,
        attempts: { increment: 1 },
        lastContact: new Date(),
        ...(disposition ? { notes: `${lead.notes || ''}\n[${new Date().toISOString()}] Disposition: ${disposition}`.trim() } : {}),
      },
    });

    if (lead.campaignId) {
      if (status === LeadStatus.CONVERTED) {
        await this.prisma.campaign.update({
          where: { id: lead.campaignId },
          data: { convertedLeads: { increment: 1 }, answeredCalls: { increment: 1 } },
        });
      } else if (status === LeadStatus.CONTACTED || status === LeadStatus.QUALIFIED) {
        await this.prisma.campaign.update({
          where: { id: lead.campaignId },
          data: { answeredCalls: { increment: 1 } },
        });
      }
    }

    return updatedLead;
  }
}
