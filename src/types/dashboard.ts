/*export type AlertaGerData = {
  NU_PROPOSTA: number;
  NU_DV_PROPOSTA: number;
  HORAS_EM_GER: number;
  STATUS_ALERTA: string;
  ULTIMA_ATUALIZACAO: Date;
  NU_CANAL_SEGURIDADE: number;
  NU_EMPRESA_SEGURIDADE: number;
};
*/

export interface FunnelData {
  ORDEM: number;
  ETAPA: string;
  DESCRICAO: string;
  QTD_PROPOSTAS: number;
  TAXA_CONVERSAO: number;
}