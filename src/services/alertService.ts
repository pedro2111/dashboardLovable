//import { AlertaGerData } from "@/data/dashboardData";
import { api } from "./authService";

export type AlertaGerResponse = {
  timestamp: string;
  propostas: AlertaGerData[];
  paginacao: {
    offset: number;
    limit: number;
    count: number;
  };
};

export type AlertaGerData = {
  nuPropostaSeguridade: number;
  horasEmGer: number;
  statusAlerta: string;
  ultimaAtualizacao: string;
  nuCanalSeguridade: number;
  nuEmpresaSeguridade: number;
  nuSituacaoProposta: number;
  sgSituacaoProposta: string;
  deSituacaoProposta: string;
};

export async function fetchAlertasGerData(): Promise<AlertaGerResponse> {
  try {
    const response = await api.get('/propostas-ger-2h');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados de alertas GER:', error);
    throw error;
  }
}