import { api } from "./api";

export interface TicketAnalysisResult {
  ticketId: string;
  ticketTitle: string;
  ticketType: string;
  state: string;
  summary: string;
  tasks: string[];
  screenshotAnalysis: string[];
  questions: string[];
  estimatedComplexity: string;
  rawAnalysis: string;
}

export const agentService = {
  analyzeTicket: (ticketId: string) =>
    api.post<TicketAnalysisResult>("/agents/analyze-ticket", { ticketId }),
};
