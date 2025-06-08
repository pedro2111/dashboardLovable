
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
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
    },
    {
      accessorKey: "deSituacaoProposta",
      header: "Situação",
      cell: ({ row }) => {
        const status = row.original.sgSituacaoProposta as string;
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
            <span>{row.original.deSituacaoProposta}</span>
          </div>
        );
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
  }, [proposalNumber, situacao, startDate, endDate, pageSize]);

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
            data={filteredData.propostas}
            pageSize={filteredData.paginacao.limit}
            currentPage={currentPage}
            totalItems={filteredData.paginacao.count}
            onPageChange={handlePageChange}
            title="Resultados"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
