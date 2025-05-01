import { AlertaGerData } from "@/data/dashboardData";

export async function fetchAlertasGerData(): Promise<AlertaGerData[]> {
  try {
    const response = await fetch('http://localhost:3001/api/propostas-ger-2h');
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados de alertas GER:', error);
    throw error;
  }
}