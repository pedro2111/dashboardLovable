import { OverviewStats } from "../data/dashboardData";
import { api } from "./authService";

export async function fetchKPIData(): Promise<OverviewStats[]> {
  try {
    const response = await api.get('/kpis');
    const data = response.data;
    
    // Transformar os dados da API no formato OverviewStats
    return [
      {
        id: 1,
        title: "Total Propostas",
        value: data.totalPropostas
      },
      {
        id: 2,
        title: "Propostas Ativas",
        value: data.propostasAtivas
      },
      {
        id: 3,
        title: "Propostas GER 2h",
        value: data.propostasGER2h
      },
      {
        id: 4,
        title: "Taxa de Conversão",
        value: `${data.taxaConversao}%`
      },
    ];
  } catch (error) {
    console.error('Erro ao buscar dados de KPI:', error);
    throw error;
  }
}