import { ProposalStatusData } from "../data/dashboardData";
import { api } from "./authService";

export interface ProposalResponse {
  timestamp: string;
  paginacao: {
    offset: number;
    limit: number;
    count: number;
  };
  situacaoRelatorio: ProposalStatusData[];
}

export interface ProposalStatusFilters {
  dataInicio?: string;
  dataFim?: string;
  offset?: number;
  limit?: number;
}

export async function fetchProposalStatusDistribution(filters?: ProposalStatusFilters): Promise<ProposalStatusData[]> {
  try {
    const params = {
      dataInicio: filters?.dataInicio,
      dataFim: filters?.dataFim,
      offset: filters?.offset,
      limit: filters?.limit
    };

    const response = await api.get<ProposalResponse>('/monitoracao/v1/relatorios/situacoes', { params });
    const situacaoRelatorio = response.data.situacaoRelatorio;

    // Calcula o total de todas as quantidades
    const totalQuantidade = situacaoRelatorio.reduce((total, item) => total + item.quantidade, 0);

    // Calcula o percentual para cada item
    const relatorioComPercentual = situacaoRelatorio.map(item => ({
      ...item,
      percentual: (item.quantidade / totalQuantidade) * 100
    }));

    return relatorioComPercentual;
  } catch (error) {
    console.error('Erro ao buscar distribuição de status:', error);
    throw error;
  }
}