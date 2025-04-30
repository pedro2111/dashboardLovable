import { ProposalStatusData } from "../data/dashboardData";

export async function fetchProposalStatusDistribution(): Promise<ProposalStatusData[]> {
  try {
    const response = await fetch('http://localhost:3001/api/distribuicao-situacao');
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar distribuição de status:', error);
    throw error;
  }
}