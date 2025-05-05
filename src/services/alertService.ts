import { AlertaGerData } from "@/data/dashboardData";
import { api } from "./authService";

export async function fetchAlertasGerData(): Promise<AlertaGerData[]> {
  try {
    const response = await api.get('/propostas-ger-2h');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados de alertas GER:', error);
    throw error;
  }
}