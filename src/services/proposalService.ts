import { ProposalStatusData } from "../data/dashboardData";
import { api } from "./authService";

export async function fetchProposalStatusDistribution(): Promise<ProposalStatusData[]> {
  try {
    
    const response = await api.get('/distribuicao-situacao');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar distribuição de status:', error);
    throw error;
  }
}