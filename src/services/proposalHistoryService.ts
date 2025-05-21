import { ProposalHistoryResponse } from "@/data/dashboardData";
import { api } from "./authService";

interface ProposalHistoryFilters {
  nuPropostaSeguridade?: string;
  sgSituacaoProposta?: string;
  dataInicio?: string;
  dataFim?: string;
  offset?: number;
  limit?: number;
}

export async function fetchProposalHistory(filters: ProposalHistoryFilters): Promise<ProposalHistoryResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.nuPropostaSeguridade) {
      params.append('nuPropostaSeguridade', filters.nuPropostaSeguridade);
    }
    if (filters.sgSituacaoProposta) {
      params.append('sgSituacaoProposta', filters.sgSituacaoProposta);
    }
    if (filters.dataInicio) {
      params.append('dataInicio', filters.dataInicio);
    }
    if (filters.dataFim) {
      params.append('dataFim', filters.dataFim);
    }
    if (filters.offset) {
      params.append('offset', filters.offset.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await api.get('/monitoracao/v1/propostas/filtros', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar histórico de propostas:', error);
    // Retorna os dados mockados em caso de erro
    return import('@/data/dashboardData').then(module => module.proposalHistoryData);
  }
}