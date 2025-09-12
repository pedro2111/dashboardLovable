// Importando dados mockados do arquivo JSON
import historicoDados from '../../public/massa-historico.json';
import ultimaSituacaoDados from '../../public/ultimaSituacaoProposta.json';

export type OverviewStats = {
  id: number;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
};

export type TimeSeriesData = {
  date: string;
  valor: number;
};

export type DistributionData = {
  name: string;
  value: number;
};

export type AlertData = {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
};

export type TableData = {
  id: number;
  agencia: string;
  operacao: string;
  valor: number;
  data: string;
  status: string;
};

export type ProposalHistoryRecord = {
  dataEvolucao: string;
  contrato: string;
  nuPropostaSeguridade: number;
  sgSituacaoProposta: string;
  deSituacaoProposta: string;
  deAcaoFluxoServico: string;
  deFluxoServicoSeguridade: string;
  deMotivoSistema: string | null;
  icMonitoracao: string;
  icNegocial: string;
};

export type ProposalHistoryResponse = {
  propostas: ProposalHistoryRecord[];
  paginacao: {
    offset: number;
    limit: number;
    count: number;
  };
  filtros: {
    nuPropostaSeguridade: null | string;
    sgSituacaoProposta: null | string;
    dataInicio: null | string;
    dataFim: null | string;
  };
  timestamp: string;
};

export type ProposalStatusData = {
  sgSituacaoProposta: string;
  deSituacaoProposta: string;
  quantidade: number;
  percentual: number;
};

export { fetchKPIData as overviewStats } from '../services/kpiService';

export const timeSeriesData: TimeSeriesData[] = [
  { date: "Jan", valor: 4000 },
  { date: "Fev", valor: 3000 },
  { date: "Mar", valor: 2000 },
  { date: "Abr", valor: 2780 },
  { date: "Mai", valor: 1890 },
  { date: "Jun", valor: 2390 },
  { date: "Jul", valor: 3490 },
  { date: "Ago", valor: 4000 },
  { date: "Set", valor: 3200 },
  { date: "Out", valor: 2800 },
  { date: "Nov", valor: 3800 },
  { date: "Dez", valor: 4300 },
];

export const dailyTimeData: TimeSeriesData[] = [
  { date: "Seg", valor: 2400 },
  { date: "Ter", valor: 1398 },
  { date: "Qua", valor: 9800 },
  { date: "Qui", valor: 3908 },
  { date: "Sex", valor: 4800 },
  { date: "Sab", valor: 3800 },
  { date: "Dom", valor: 4300 },
];

export const distributionData: DistributionData[] = [
  { name: "Crédito Imobiliário", value: 35 },
  { name: "Empréstimo Pessoal", value: 25 },
  { name: "Poupança", value: 20 },
  { name: "Investimentos", value: 15 },
  { name: "Outros", value: 5 },
];

export const tableData: TableData[] = [
  {
    id: 1,
    agencia: "0001",
    operacao: "Crédito Imobiliário",
    valor: 450000,
    data: "2023-04-22",
    status: "Aprovado",
  },
  {
    id: 2,
    agencia: "0235",
    operacao: "Empréstimo Pessoal",
    valor: 15000,
    data: "2023-04-21",
    status: "Pendente",
  },
  {
    id: 3,
    agencia: "1040",
    operacao: "Financiamento Auto",
    valor: 65000,
    data: "2023-04-20",
    status: "Aprovado",
  },
  {
    id: 4,
    agencia: "0783",
    operacao: "Crédito Consignado",
    valor: 28000,
    data: "2023-04-19",
    status: "Reprovado",
  },
  {
    id: 5,
    agencia: "0001",
    operacao: "Crédito Empresarial",
    valor: 125000,
    data: "2023-04-18",
    status: "Aprovado",
  },
];

export const alertData: AlertData[] = [
  {
    id: 1,
    title: "Aumento significativo nas operações",
    description: "Detecção de aumento de 30% nas operações da agência 0001",
    severity: "medium",
    timestamp: "Hoje, 10:45",
  },
  {
    id: 2,
    title: "Falha de processamento",
    description: "Operações de crédito consignado estão sendo interrompidas",
    severity: "critical",
    timestamp: "Hoje, 09:12",
  },
  {
    id: 3,
    title: "Atingiu meta mensal",
    description: "A agência 0783 atingiu a meta mensal de processamento",
    severity: "low",
    timestamp: "Ontem, 16:30",
  },
  {
    id: 4,
    title: "Necessidade de manutenção",
    description: "Verificar sistema de aprovação de crédito imobiliário",
    severity: "high",
    timestamp: "23/04/2023, 14:10",
  },
];

/*export type AlertaGerData = {
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
*/

export { fetchProposalStatusDistribution as proposalStatusData } from '../services/proposalService';

export type ProposalStatusDataParams = {
  dataInicio?: string;
  dataFim?: string;
};

export const proposalHistoryData: ProposalHistoryResponse = historicoDados;
export const ultimaSituacaoPropostaData = ultimaSituacaoDados;
