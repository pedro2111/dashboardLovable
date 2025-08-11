
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, ExternalLink } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DataTable } from "@/components/dashboard/DataTable";
import { cn } from "@/lib/utils";
import { ProposalHistoryRecord, ProposalHistoryResponse } from "@/data/dashboardData";
import { fetchProposalHistory } from "@/services/proposalHistoryService";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";

// Componente para o indicador de status da proposta
interface StatusIndicatorProps {
  status: string;
  label?: string;
}

const StatusIndicator = ({ status, label }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center">
      <div
        className={cn(
          "mr-2 h-2 w-2 rounded-full",
          status === "GER" && "bg-green-500",
          status === "ENV" && "bg-green-500",
          status === "PEN" && "bg-yellow-500",
          status === "VNC" && "bg-yellow-500",
          status === "REJ" && "bg-red-500",
          status === "EMT" && "bg-green-500",
          status === "CAN" && "bg-red-500"
        )}
      />
      {label && <span>{label}</span>}
    </div>
  );
};

// Componente para o stepper do ciclo de vida da proposta
interface ProposalStepperProps {
  proposalHistory: ProposalHistoryRecord[];
}

const ProposalStepper = ({ proposalHistory }: ProposalStepperProps) => {
  // Filtra apenas registros negociais e ordena por data de evolução (crescente)
  const sortedHistory = [...proposalHistory]
    .filter(item => item.icNegocial === "S")
    .sort((a, b) => {
      // Convertemos as strings de data para objetos Date para comparação
      const dateA = new Date(a.dataEvolucao.split(' ')[0].split('/').reverse().join('-') + 'T' + a.dataEvolucao.split(' ')[1]);
      const dateB = new Date(b.dataEvolucao.split(' ')[0].split('/').reverse().join('-') + 'T' + b.dataEvolucao.split(' ')[1]);
      return dateA.getTime() - dateB.getTime();
    });

  // Se não houver registros, retorna null
  if (sortedHistory.length === 0) {
    return null;
  }

  // Extrai as situações únicas em ordem cronológica
  // Usamos um método que preserva a ordem de aparição na sequência temporal
  const uniqueSteps = [];
  const seenSituacoes = new Set();
  
  for (const item of sortedHistory) {
    if (!seenSituacoes.has(item.sgSituacaoProposta)) {
      seenSituacoes.add(item.sgSituacaoProposta);
      uniqueSteps.push(item);
    }
  }

  // Calcula o percentual de progresso com base na posição atual
  const currentStep = sortedHistory[sortedHistory.length - 1].sgSituacaoProposta;
  const currentStepIndex = uniqueSteps.findIndex(item => item.sgSituacaoProposta === currentStep);
  const percentComplete = uniqueSteps.length > 1 
    ? (currentStepIndex / (uniqueSteps.length - 1)) * 100 
    : 0;

  // Função para obter a cor com base no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "GER":
      case "ENV":
      case "EMT":
        return "#10b981"; // verde
      case "PEN":
      case "VNC":
        return "#f59e0b"; // amarelo
      case "REJ":
      case "CAN":
        return "#ef4444"; // vermelho
      default:
        return "#6b7280"; // cinza
    }
  };

  return (
    <div className="mt-8 mb-10 px-4 border-t border-b border-gray-200 dark:border-gray-700 py-6">
      <h3 className="text-base font-medium mb-6 text-center"></h3>
      <div className="mb-4">
        <ProgressBar
          percent={percentComplete}
          filledBackground="linear-gradient(to right, #10b981, #3b82f6)"
          height={4}
        >
          {uniqueSteps.map((step, index) => (
            <Step key={index}>
              {({ accomplished }) => (
                <div
                  className={`flex flex-col items-center ${accomplished ? "text-primary" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 transition-all ${accomplished ? "scale-110" : ""}`}
                    style={{
                      backgroundColor: accomplished ? getStatusColor(step.sgSituacaoProposta) : "#e5e7eb",
                      boxShadow: accomplished ? "0 0 0 4px rgba(59, 130, 246, 0.2)" : "none"
                    }}
                  >
                    <span className="text-white text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div className="text-xs font-medium">{step.sgSituacaoProposta}</div>
                
                </div>
              )}
            </Step>
          ))}
        </ProgressBar>
      </div>
    </div>
  );
};

export default function ProposalHistoryPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filteredData, setFilteredData] = useState<ProposalHistoryResponse>({
    propostas: [],
    paginacao: { offset: 0, limit: 10, count: 10 },
    filtros: {
      nuPropostaSeguridade: null,
      sgSituacaoProposta: null,
      dataInicio: '',
      dataFim: ''
    },
    timestamp: new Date().toISOString()
  });
  const [proposalNumber, setProposalNumber] = useState<string>("");
  const [situacao, setSituacao] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [proposalHistory, setProposalHistory] = useState<ProposalHistoryRecord[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("negocial");
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [selectedItemJson, setSelectedItemJson] = useState<any>(null);

  // Table columns definition
  const columns: ColumnDef<ProposalHistoryRecord>[] = [
    {
      accessorKey: "dataEvolucao",
      header: "Data Evolução",
    },
    {
      accessorKey: "contrato",
      header: "Contrato",
    },
    {
      accessorKey: "nuPropostaSeguridade",
      header: "Nº Proposta",
      cell: ({ row }) => {
        const proposta = row.original.nuPropostaSeguridade;
        const count = getProposalCount(proposta);
        
        if (count > 1) {
          return (
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal text-primary flex items-center gap-1"
              onClick={() => openProposalHistory(proposta)}
            >
              {proposta}
              <ExternalLink className="h-3 w-3" />
            </Button>
          );
        }
        
        return proposta;
      },
    },
    {
      accessorKey: "deSituacaoProposta",
      header: "Situação",
      cell: ({ row }) => {
        const status = row.original.sgSituacaoProposta as string;
        return <StatusIndicator status={status} label={row.original.sgSituacaoProposta} />;
      },
    },
    {
      accessorKey: "deAcaoFluxoServico",
      header: "Ação",
    },
    {
      accessorKey: "deFluxoServicoSeguridade",
      header: "Tipo de Fluxo",
    },
    {
      accessorKey: "deMotivoSistema",
      header: "Motivo",
      cell: ({ row }) => row.getValue("deMotivoSistema") || "—",
    },
    {
      accessorKey: "icMonitoracao",
      header: "Monitoração",
    },
    {
      accessorKey: "icNegocial",
      header: "Negocial",
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchData = async (page: number = 0) => {
    try {
      const filters = {
        nuPropostaSeguridade: proposalNumber,
        sgSituacaoProposta: situacao || undefined,
        dataInicio: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        dataFim: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        offset: page,
        limit: pageSize
      };

      const response = await fetchProposalHistory(filters);
      setFilteredData(response);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };
  
  // Função para abrir o modal com o histórico de uma proposta específica
  const openProposalHistory = (nuPropostaSeguridade: number) => {
    const proposalRecords = filteredData.propostas.filter(
      (proposta) => proposta.nuPropostaSeguridade === nuPropostaSeguridade
    );
    setProposalHistory(proposalRecords);
    setSelectedProposal(nuPropostaSeguridade);
    setDialogOpen(true);
  };
  
  // Agrupar propostas por número e pegar apenas a mais recente de cada
  const groupedProposals = useMemo(() => {
    const proposalMap = new Map<number, ProposalHistoryRecord>();
    
    // Agrupar por número de proposta e manter apenas a mais recente
    filteredData.propostas.forEach((proposta) => {
      const existingProposal = proposalMap.get(proposta.nuPropostaSeguridade);
      
      if (!existingProposal || new Date(proposta.dataEvolucao) > new Date(existingProposal.dataEvolucao)) {
        proposalMap.set(proposta.nuPropostaSeguridade, proposta);
      }
    });
    
    return Array.from(proposalMap.values());
  }, [filteredData.propostas]);
  
  // Função para contar quantas ocorrências existem para cada proposta
  const getProposalCount = (nuPropostaSeguridade: number): number => {
    return filteredData.propostas.filter(p => p.nuPropostaSeguridade === nuPropostaSeguridade).length;
  };
  
  // JSON mockado para exibição
  const mockJson = {
    coLancamentoTransacao: "a93be91b-6848-43d6-8007-90a16debbe9b",
    coSeguroContrato: "a93be91b-6848-43d6-8007-90a16debbe9b",
    nuFluxo: 1,
    nuAcao: 1,
    sistemaOrigem: "SINCR",
    nuMatrizDisponibilizacao: 15,
    nuEmpresa: 1,
    canalVenda: 42,
    nuMotivo: 731,
    codigoContratoRenovacao: 1,
    nuPropostaSIGPF: null,
    nuPropostaSeguridade: null,
    numeroCorrespondente: 40141390,
    tipoCorrespondente: 1,
    codigoOperacaoCredito: 1,
    agencia: 2,
    codigoMatriculaEmpregado: "c897998",
    convenente: 10605,
    cpfCnpj: 72302942078,
    tipoPessoa: "F",
    nomeProponente: "CLIENTE SIDEC 6",
    nomeSocial: "CLIENTE SIDEC 6 social",
    numeroContrato: 8376,
    valorTotalContrato: 199292.26,
    valorLiquido: 142205.1,
    valorTotalIof: 6722.13,
    valorTotalJurosAcerto: 0,
    saldoDevedorContrato: "199292.26",
    valorImportanciaSegurada: "249657.29",
    valorPremio: "48372.26",
    dataContratacao: "2024-06-26",
    dataLiberacaoCredito: "2024-06-26",
    dataFimContrato: "2028-04-07",
    prazoTotalContrato: "1381",
    prazoCarencia: "0",
    prazoRemanescente: "1381",
    eventProcessedUtcTime: "2024-06-26T20:56:30.1030689Z",
    partitionId: "0",
    eventEnqueuedUtcTime: "2024-06-26T13:04:39.5640000Z"
  };
  
  // Função para abrir o modal de JSON
  const openJsonModal = (item: ProposalHistoryRecord) => {
    setSelectedItemJson(mockJson);
    setJsonDialogOpen(true);
  };
  
  // Função para voltar ao modal anterior
  const backToMainModal = () => {
    setJsonDialogOpen(false);
  };

  // Função para aplicar os filtros com debounce
  const applyFilters = () => {
    setCurrentPage(0);
    fetchData(0);
  };

  // Aplica debounce nos filtros
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      applyFilters();
    }, 150);
    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [situacao, startDate, endDate, pageSize]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleReset = () => {
    setProposalNumber("");
    setSituacao("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <DashboardLayout pageTitle="Histórico de Propostas">
      <div className="container px-4 py-6 mx-auto animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-primary/10 blur-3xl opacity-20 rounded-3xl -z-10"></div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Histórico de Propostas
          </h1>
          <p className="text-muted-foreground">
            Visualize e filtre o histórico completo de propostas
          </p>
        </div>

        <Card className="relative p-6 mb-6 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Número da Proposta filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Número da Proposta</label>
              <Input
                type="number"
                placeholder="Digite o número"
                value={proposalNumber}
                onChange={(e) => setProposalNumber(e.target.value)}
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/30"
              />
            </div>

            {/* Situação filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Situação</label>
              <select
                className="flex h-10 w-full rounded-md border backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={situacao}
                onChange={(e) => setSituacao(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="GER">GER</option>
                <option value="ENV">ENV</option>
                <option value="EMT">EMT</option>
                <option value="REJ">REJ</option>
                <option value="CAN">CAN</option>
                <option value="PEN">PEN</option>
                <option value="VNC">VNC</option>
              </select>
            </div>

            {/* Data Inicio filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/30",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/30" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data Fim filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/30",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/30" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Itens por página */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Itens por página</label>
              <select
                className="flex h-10 w-full rounded-md border backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/30"
            >
              Limpar Filtros
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary transition-all hover:shadow-md"
              onClick={() => fetchData(0)}
            >
              <Search className="h-4 w-4" />
              Pesquisar
            </Button>
          </div>
        </Card>

        {/* Results Table */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 blur-xl opacity-30 -z-10 rounded-xl"></div>
          <DataTable
            columns={columns}
            data={groupedProposals}
            pageSize={filteredData.paginacao.limit}
            currentPage={currentPage}
            totalItems={groupedProposals.length}
            onPageChange={handlePageChange}
            title={`Resultados (${groupedProposals.length} propostas únicas)`}
          />
        </div>
        
        {/* Modal de histórico de propostas */}
        {selectedProposal && (
          <Dialog open={dialogOpen && !jsonDialogOpen} onOpenChange={(open) => {
            if (!open && !jsonDialogOpen) {
              setDialogOpen(false);
            }
          }}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Histórico da Proposta {selectedProposal}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Tabs defaultValue="negocial" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="negocial">Histórico negocial</TabsTrigger>
                    <TabsTrigger value="monitoracao">Histórico Monitoração</TabsTrigger>
                  </TabsList>
                  
                  {/* Conteúdo da aba Histórico negocial */}
                  <TabsContent value="negocial" className="mt-6">
                    {/* Stepper para mostrar o ciclo de vida da proposta */}
                    {proposalHistory.filter(item => item.icNegocial === "S").length > 0 && (
                      <ProposalStepper proposalHistory={proposalHistory} />
                    )}
                    
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-2 px-4 text-left">Data Evolução</th>
                          <th className="py-2 px-4 text-left">Situação</th>
                          <th className="py-2 px-4 text-left">Ação</th>
                          <th className="py-2 px-4 text-left">Tipo de Fluxo</th>
                          <th className="py-2 px-4 text-left">Motivo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposalHistory
                          .filter(item => item.icNegocial === "S")
                          .sort((a, b) => new Date(b.dataEvolucao).getTime() - new Date(a.dataEvolucao).getTime())
                          .map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                              <td className="py-2 px-4">{item.dataEvolucao}</td>
                              <td className="py-2 px-4">
                                <StatusIndicator status={item.sgSituacaoProposta} label={item.deSituacaoProposta} />
                              </td>
                              <td className="py-2 px-4">{item.deAcaoFluxoServico}</td>
                              <td className="py-2 px-4">{item.deFluxoServicoSeguridade}</td>
                              <td className="py-2 px-4">{item.deMotivoSistema || "—"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {proposalHistory.filter(item => item.icNegocial === "S").length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">Nenhum registro negocial encontrado.</div>
                    )}
                  </TabsContent>
                  
                  {/* Conteúdo da aba Histórico Monitoração */}
                  <TabsContent value="monitoracao" className="mt-4">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="py-2 px-4 text-left">Data Evolução</th>
                          <th className="py-2 px-4 text-left">Situação</th>
                          <th className="py-2 px-4 text-left">Ação</th>
                          <th className="py-2 px-4 text-left">Tipo de Fluxo</th>
                          <th className="py-2 px-4 text-left">Motivo</th>
                          <th className="py-2 px-4 text-left">JSON</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposalHistory
                          .filter(item => item.icMonitoracao === "S")
                          .sort((a, b) => new Date(b.dataEvolucao).getTime() - new Date(a.dataEvolucao).getTime())
                          .map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                              <td className="py-2 px-4">{item.dataEvolucao}</td>
                              <td className="py-2 px-4">
                                <StatusIndicator status={item.sgSituacaoProposta} label={item.deSituacaoProposta} />
                              </td>
                              <td className="py-2 px-4">{item.deAcaoFluxoServico}</td>
                              <td className="py-2 px-4">{item.deFluxoServicoSeguridade}</td>
                              <td className="py-2 px-4">{item.deMotivoSistema || "—"}</td>
                              <td className="py-2 px-4">
                                <Button 
                                  variant="link" 
                                  className="p-0 h-auto font-normal text-primary flex items-center gap-1"
                                  onClick={() => openJsonModal(item)}
                                >
                                  Json
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {proposalHistory.filter(item => item.icMonitoracao === "S").length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">Nenhum registro de monitoração encontrado.</div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Modal de JSON */}
        {selectedItemJson && (
          <Dialog open={jsonDialogOpen} onOpenChange={setJsonDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detalhes JSON</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
                  {JSON.stringify(selectedItemJson, null, 2)}
                </pre>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={backToMainModal}
                    className="flex items-center gap-2"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
