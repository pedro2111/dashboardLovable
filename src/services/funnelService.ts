import { FunnelData } from '@/types/dashboard';
import {api} from "./authService"

export const funnelData: FunnelData[] = [
  { ORDEM: 1, ETAPA: 'GER', DESCRICAO: 'PROPOSTA GERADA', QTD_PROPOSTAS: 245, TAXA_CONVERSAO: 100.00 },
  { ORDEM: 2, ETAPA: 'PAE', DESCRICAO: 'PROPOSTA AGUARDANDO EMISSAO', QTD_PROPOSTAS: 187, TAXA_CONVERSAO: 76.33 },
  { ORDEM: 3, ETAPA: 'EMT', DESCRICAO: 'DOCUMENTO EMITIDO', QTD_PROPOSTAS: 156, TAXA_CONVERSAO: 63.67 },
  { ORDEM: 4, ETAPA: 'ATV', DESCRICAO: 'TITULO ATIVADO', QTD_PROPOSTAS: 132, TAXA_CONVERSAO: 53.88 }
];

export async function fetchFunnelData(): Promise<FunnelData[]> {
  // Simula uma chamada à API
  try {
    const response = await api.get('/conversao-etapas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da funil:', error);
    throw error;
  }
};