import { api } from "./authService";

// Definição dos tipos baseados no JSON de mock
export interface UltimaSituacaoProposta {
  nuPropostaSeguridade: number;
  dataEvolucao: string;
  nuPropostaGPFDV: string | null;
  nuSituacaoProposta: number;
  sgSituacaoProposta: string;
  contrato: string | null;
  txtMotivo: string | null;
  nuMotivoSistema: number | null;
  deMotivoSistema: string | null;
  nuMonitoracaoSistema: number | null;
  NU_LINHA: number;
}

export interface UltimaSituacaoPropostaResponse {
  propostas: UltimaSituacaoProposta[];
  paginacao: {
    offset: number;
    limit: number;
    count: number;
  };
  filtros: {
    nuPropostaSeguridade: number | string;
    sgSituacaoProposta: string;
    dataInicio: string;
    dataFim: string;
  };
  timestamp: string;
}

interface UltimaSituacaoPropostaFilters {
  nuPropostaSeguridade?: string;
  sgSituacaoProposta?: string;
  dataInicio?: string;
  dataFim?: string;
  offset?: number;
  limit?: number;
}

export async function fetchUltimaSituacaoProposta(filters: UltimaSituacaoPropostaFilters): Promise<UltimaSituacaoPropostaResponse> {
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

    const response = await api.get('/monitoracao/v1/propostas/ultimaSituacao', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar última situação das propostas:', error);
    // Retorna os dados mockados em caso de erro
    return import('@/data/dashboardData').then(module => module.ultimaSituacaoPropostaData);
  }
}