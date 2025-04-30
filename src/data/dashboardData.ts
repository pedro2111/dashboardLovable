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
  DATA_EVOLUCAO: string;
  CONTRATO: string;
  NU_PROPOSTA_SEGURIDADE: number;
  SG_SITUACAO_PROPOSTA: string;
  DE_SITUACAO_PROPOSTA: string;
  DE_ACAO_FLUXO_SERVICO: string;
  DE_FLUXO_SERVICO_SEGURIDADE: string;
  DE_MOTIVO_SISTEMA: string | null;
  IC_MONITORACAO: "S" | "N";
  IC_NEGOCIAL: "S" | "N";
};

export type ProposalStatusData = {
  NU_SITUACAO_PROPOSTA: number;
  SG_SITUACAO_PROPOSTA: string;
  DE_SITUACAO_PROPOSTA: string;
  QTD_PROPOSTAS: number;
  PERCENTUAL: number;
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

export { fetchProposalStatusDistribution as proposalStatusData } from '../services/proposalService';

export const proposalHistoryData: ProposalHistoryRecord[] = [
  {
    "DATA_EVOLUCAO": "2024-05-01T10:15:00.000Z",
    "CONTRATO": "12345678",
    "NU_PROPOSTA_SEGURIDADE": 987654,
    "SG_SITUACAO_PROPOSTA": "ATIVA",
    "DE_SITUACAO_PROPOSTA": "Proposta Ativa",
    "DE_ACAO_FLUXO_SERVICO": "Envio para análise",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Aposentadoria",
    "DE_MOTIVO_SISTEMA": "Processo automático",
    "IC_MONITORACAO": "S",
    "IC_NEGOCIAL": "N"
  },
  {
    "DATA_EVOLUCAO": "2024-05-02T14:30:00.000Z",
    "CONTRATO": "87654321",
    "NU_PROPOSTA_SEGURIDADE": 123456,
    "SG_SITUACAO_PROPOSTA": "EM_ANALISE",
    "DE_SITUACAO_PROPOSTA": "Em Análise",
    "DE_ACAO_FLUXO_SERVICO": "Verificação documental",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Pensão",
    "DE_MOTIVO_SISTEMA": null,
    "IC_MONITORACAO": "N",
    "IC_NEGOCIAL": "S"
  },
  {
    "DATA_EVOLUCAO": "2024-04-28T09:20:00.000Z",
    "CONTRATO": "45678912",
    "NU_PROPOSTA_SEGURIDADE": 567890,
    "SG_SITUACAO_PROPOSTA": "APROVADA",
    "DE_SITUACAO_PROPOSTA": "Aprovada",
    "DE_ACAO_FLUXO_SERVICO": "Aprovação final",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Seguro de Vida",
    "DE_MOTIVO_SISTEMA": "Documentação completa",
    "IC_MONITORACAO": "N",
    "IC_NEGOCIAL": "S"
  },
  {
    "DATA_EVOLUCAO": "2024-04-25T16:45:00.000Z",
    "CONTRATO": "78912345",
    "NU_PROPOSTA_SEGURIDADE": 345678,
    "SG_SITUACAO_PROPOSTA": "REJEITADA",
    "DE_SITUACAO_PROPOSTA": "Rejeitada",
    "DE_ACAO_FLUXO_SERVICO": "Análise de crédito",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Previdência",
    "DE_MOTIVO_SISTEMA": "Perfil de risco inadequado",
    "IC_MONITORACAO": "S",
    "IC_NEGOCIAL": "N"
  },
  {
    "DATA_EVOLUCAO": "2024-05-03T11:10:00.000Z",
    "CONTRATO": "23456789",
    "NU_PROPOSTA_SEGURIDADE": 789012,
    "SG_SITUACAO_PROPOSTA": "PENDENTE",
    "DE_SITUACAO_PROPOSTA": "Pendente",
    "DE_ACAO_FLUXO_SERVICO": "Aguardando documentação",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Auxílio",
    "DE_MOTIVO_SISTEMA": "Documentos adicionais solicitados",
    "IC_MONITORACAO": "S",
    "IC_NEGOCIAL": "S"
  },
  {
    "DATA_EVOLUCAO": "2024-04-20T13:25:00.000Z",
    "CONTRATO": "34567891",
    "NU_PROPOSTA_SEGURIDADE": 901234,
    "SG_SITUACAO_PROPOSTA": "CANCELADA",
    "DE_SITUACAO_PROPOSTA": "Cancelada",
    "DE_ACAO_FLUXO_SERVICO": "Cancelamento a pedido",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Seguro Residencial",
    "DE_MOTIVO_SISTEMA": "Solicitação do cliente",
    "IC_MONITORACAO": "N",
    "IC_NEGOCIAL": "N"
  },
  {
    "DATA_EVOLUCAO": "2024-05-04T08:50:00.000Z",
    "CONTRATO": "56789123",
    "NU_PROPOSTA_SEGURIDADE": 234567,
    "SG_SITUACAO_PROPOSTA": "EM_ANALISE",
    "DE_SITUACAO_PROPOSTA": "Em Análise",
    "DE_ACAO_FLUXO_SERVICO": "Análise jurídica",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Seguro Automóvel",
    "DE_MOTIVO_SISTEMA": null,
    "IC_MONITORACAO": "S",
    "IC_NEGOCIAL": "S"
  },
  {
    "DATA_EVOLUCAO": "2024-04-15T15:35:00.000Z",
    "CONTRATO": "89123456",
    "NU_PROPOSTA_SEGURIDADE": 456789,
    "SG_SITUACAO_PROPOSTA": "ATIVA",
    "DE_SITUACAO_PROPOSTA": "Proposta Ativa",
    "DE_ACAO_FLUXO_SERVICO": "Ativação do serviço",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Seguro Saúde",
    "DE_MOTIVO_SISTEMA": "Aprovação automática",
    "IC_MONITORACAO": "N",
    "IC_NEGOCIAL": "S"
  },
  {
    "DATA_EVOLUCAO": "2024-05-02T09:05:00.000Z",
    "CONTRATO": "91234567",
    "NU_PROPOSTA_SEGURIDADE": 678901,
    "SG_SITUACAO_PROPOSTA": "PENDENTE",
    "DE_SITUACAO_PROPOSTA": "Pendente",
    "DE_ACAO_FLUXO_SERVICO": "Verificação de identidade",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Plano de Saúde",
    "DE_MOTIVO_SISTEMA": "Validação de dados pessoais",
    "IC_MONITORACAO": "S",
    "IC_NEGOCIAL": "N"
  },
  {
    "DATA_EVOLUCAO": "2024-04-10T12:40:00.000Z",
    "CONTRATO": "67891234",
    "NU_PROPOSTA_SEGURIDADE": 123789,
    "SG_SITUACAO_PROPOSTA": "APROVADA",
    "DE_SITUACAO_PROPOSTA": "Aprovada",
    "DE_ACAO_FLUXO_SERVICO": "Confirmação de pagamento",
    "DE_FLUXO_SERVICO_SEGURIDADE": "Fluxo de Seguro Empresarial",
    "DE_MOTIVO_SISTEMA": "Pagamento verificado",
    "IC_MONITORACAO": "N",
    "IC_NEGOCIAL": "S"
  }
];
