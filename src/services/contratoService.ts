import { api } from './authService';

// Tipo para os dados de contrato
export interface Contrato {
  coContrato: string;
  nuContrato: string;
  nuCpfCnpj: number;
  dtContratacao: string;
  vrContrato: number;
  noSituacao: string;
  isLegado: boolean;
  dtFimContrato: string;
  novacao: boolean;
  dhSituacao: string;
}

// Tipo para a resposta da API
export interface ContratoResponse {
  page: number;
  size: number;
  total: number;
  erroSIFEC: boolean;
  data: Contrato[];
}

// Parâmetros para a busca de contratos
export interface ContratoParams {
  nuContrato: string;
  size?: number;
  page?: number;
}

/**
 * Busca informações de um contrato específico
 * @param params Parâmetros para a busca (nuContrato, size, page)
 * @returns Promise com os dados do contrato
 */
export async function fetchContrato(params: ContratoParams): Promise<ContratoResponse> {
  try {
    const { nuContrato, size = 5, page = 1 } = params;
    
    const response = await api.get('/credito/contrato', {
      params: {
        nuContrato,
        size,
        page
      }
    });
    
    return response.data;
  } catch (error) {
    
    console.error('Erro ao buscar dados do contrato:', error);
    
    return import('@/data/dashboardData').then(module => module.contratoData);
    
  }
}