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
        value: data.totalPropostas,
        trend: { value: 12, positive: true },
        description: "Últimos 30 dias",
      },
      {
        id: 2,
        title: "Propostas Ativas",
        value: data.propostasAtivas,
        trend: { value: 8.4, positive: true },
      },
      {
        id: 3,
        title: "Propostas GER 2h",
        value: data.propostasGER2h,
        trend: { value: 2.1, positive: false },
      },
      {
        id: 4,
        title: "Taxa de Conversão",
        value: `${data.taxaConversao}%`,
        trend: { value: 4.3, positive: true },
      },
    ];
  } catch (error) {
    console.error('Erro ao buscar dados de KPI:', error);
    throw error;
  }
}