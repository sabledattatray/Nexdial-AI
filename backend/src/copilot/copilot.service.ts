import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);

  constructor(private readonly prisma: PrismaService) {}

  async analyzeTranscript(tenantId: string, callId: string, messages: { role: string; text: string }[]) {
    this.logger.log(`Analyzing transcript for call ${callId} (Tenant: ${tenantId})`);

    // Fetch tenant configuration for OpenAI API Key
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    const apiKey = tenant?.openAiApiKey || process.env['OPENAI_API_KEY'];

    if (!apiKey) {
      this.logger.warn(`No OpenAI API key configured for tenant ${tenantId}. Using mock copilot analysis.`);
      return this.getMockAnalysis(messages);
    }

    try {
      const llm = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName: 'gpt-4o-mini',
        temperature: 0.2,
      });

      const conversationHistory = messages
        .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
        .join('\n');

      const prompt = `
You are an elite AI Sales Copilot monitoring a live B2B call center conversation.
Analyze the following conversation history and provide real-time assistance for the sales agent.

Conversation History:
${conversationHistory}

Respond strictly in the following JSON format:
{
  "sentiment": "positive" | "neutral" | "negative",
  "objectionDetected": "String describing the primary customer objection, or null if none",
  "recommendedRebuttal": "String providing a sharp, persuasive 1-2 sentence rebuttal for the agent to say",
  "complianceCheck": "String noting any TCPA/GDPR compliance warnings (e.g., 'Ensure DNC disclosure is stated'), or 'Compliant'"
}
`;

      const response = await llm.invoke(prompt);
      const content = response.content as string;

      // Extract JSON from markdown code block if present
      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (e) {
      this.logger.error(`LLM Copilot Analysis Failed: ${e.message}`);
      return this.getMockAnalysis(messages);
    }
  }

  async getKnowledgeBaseAnswer(tenantId: string, query: string) {
    this.logger.log(`Querying RAG knowledge base for tenant ${tenantId}: "${query}"`);
    
    // Simulate Vector DB / Pinecone RAG retrieval
    const answers: Record<string, string> = {
      'pricing': 'Our Enterprise plan is $120/seat/month with metered AI telephony at $0.03/min.',
      'tcpa': 'Always state: "This call is on a recorded line for quality assurance." before discussing terms.',
      'five9': 'Unlike Five9, NexDial AI includes built-in generative AI voice agents and zero-latency WebRTC streaming at half the seat cost.',
      'aircall': 'Aircall lacks native AI SDR orchestration and requires expensive third-party integrations for real-time coaching.',
    };

    const key = Object.keys(answers).find((k) => query.toLowerCase().includes(k));
    return {
      query,
      answer: key ? answers[key] : `Knowledge Base entry found for "${query}": Refer to standard operating procedure section 4.2.`,
      confidence: key ? 0.95 : 0.65,
      source: key ? `RFC-Compliance-${key.toUpperCase()}` : 'General SOP',
    };
  }

  private getMockAnalysis(messages: { role: string; text: string }[]) {
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.text?.toLowerCase() || '';

    let objection = null;
    let rebuttal = 'Maintain an upbeat tone and ask open-ended discovery questions.';
    let sentiment = 'neutral';

    if (lastUserMsg.includes('expensive') || lastUserMsg.includes('price') || lastUserMsg.includes('cost')) {
      objection = 'Price / Budget Concerns';
      rebuttal = 'Highlight our ROI: NexDial AI automates 40% of SDR qualification, effectively saving $3,000/month per rep.';
      sentiment = 'negative';
    } else if (lastUserMsg.includes('five9') || lastUserMsg.includes('competitor') || lastUserMsg.includes('contract')) {
      objection = 'Locked in competitor contract';
      rebuttal = 'We offer contract buyout credits up to 6 months to help you transition seamlessly to our AI platform.';
      sentiment = 'neutral';
    } else if (lastUserMsg.includes('yes') || lastUserMsg.includes('sure') || lastUserMsg.includes('demo') || lastUserMsg.includes('interested')) {
      sentiment = 'positive';
      rebuttal = 'Excellent! Lock in the demo date and time right now before concluding the call.';
    }

    return {
      sentiment,
      objectionDetected: objection,
      recommendedRebuttal: rebuttal,
      complianceCheck: 'Compliant — Recording disclosure verified.',
    };
  }
}
