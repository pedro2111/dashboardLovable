import { FunnelData } from '@/types/dashboard';

export const funnelData: FunnelData[] = [
  { ORDEM: 1, ETAPA: 'GER', DESCRICAO: 'PROPOSTA GERADA', QTD_PROPOSTAS: 245, TAXA_CONVERSAO: 100.00 },
  { ORDEM: 2, ETAPA: 'PAE', DESCRICAO: 'PROPOSTA AGUARDANDO EMISSAO', QTD_PROPOSTAS: 187, TAXA_CONVERSAO: 76.33 },
  { ORDEM: 3, ETAPA: 'EMT', DESCRICAO: 'DOCUMENTO EMITIDO', QTD_PROPOSTAS: 156, TAXA_CONVERSAO: 63.67 },
  { ORDEM: 4, ETAPA: 'ATV', DESCRICAO: 'TITULO ATIVADO', QTD_PROPOSTAS: 132, TAXA_CONVERSAO: 53.88 }
];

export const fetchFunnelData = async (): Promise<FunnelData[]> => {
  // Simula uma chamada à API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(funnelData);
    }, 1000);
  });
};