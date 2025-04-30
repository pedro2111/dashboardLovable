
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
import { proposalHistoryData, ProposalHistoryRecord } from "@/data/dashboardData";
import { ColumnDef } from "@tanstack/react-table";

export default function ProposalHistoryPage() {
  const [filteredData, setFilteredData] = useState<ProposalHistoryRecord[]>(proposalHistoryData);
  const [proposalNumber, setProposalNumber] = useState<string>("");
  const [situacao, setSituacao] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Table columns definition
  const columns: ColumnDef<ProposalHistoryRecord>[] = [
    {
      accessorKey: "DATA_EVOLUCAO",
      header: "Data Evolução",
      cell: ({ row }) => {
        const date = new Date(row.getValue("DATA_EVOLUCAO"));
        return format(date, "dd/MM/yyyy HH:mm");
      },
    },
    {
      accessorKey: "CONTRATO",
      header: "Contrato",
    },
    {
      accessorKey: "NU_PROPOSTA_SEGURIDADE",
      header: "Nº Proposta",
    },
    {
      accessorKey: "DE_SITUACAO_PROPOSTA",
      header: "Situação",
      cell: ({ row }) => {
        const status = row.getValue("SG_SITUACAO_PROPOSTA") as string;
        return (
          <div className="flex items-center">
            <div
              className={cn(
                "mr-2 h-2 w-2 rounded-full",
                status === "ATIVA" && "bg-green-500",
                status === "EM_ANALISE" && "bg-blue-500",
                status === "PENDENTE" && "bg-yellow-500",
                status === "REJEITADA" && "bg-red-500",
                status === "APROVADA" && "bg-emerald-500",
                status === "CANCELADA" && "bg-gray-500"
              )}
            />
            <span>{row.getValue("DE_SITUACAO_PROPOSTA")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "DE_ACAO_FLUXO_SERVICO",
      header: "Ação",
    },
    {
      accessorKey: "DE_FLUXO_SERVICO_SEGURIDADE",
      header: "Tipo de Fluxo",
    },
    {
      accessorKey: "DE_MOTIVO_SISTEMA",
      header: "Motivo",
      cell: ({ row }) => row.getValue("DE_MOTIVO_SISTEMA") || "—",
    },
    {
      accessorKey: "IC_MONITORACAO",
      header: "Monitoração",
    },
    {
      accessorKey: "IC_NEGOCIAL",
      header: "Negocial",
    },
  ];

  // Apply filters when any of the filter values change
  useEffect(() => {
    let results = proposalHistoryData;

    // Filter by proposal number
    if (proposalNumber) {
      results = results.filter((record) =>
        record.NU_PROPOSTA_SEGURIDADE.toString().includes(proposalNumber)
      );
    }

    // Filter by situacao
    if (situacao) {
      results = results.filter((record) =>
        record.SG_SITUACAO_PROPOSTA === situacao
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      results = results.filter((record) => {
        const recordDate = new Date(record.DATA_EVOLUCAO);
        return recordDate >= startDate && recordDate <= endDate;
      });
    } else if (startDate) {
      results = results.filter((record) => {
        const recordDate = new Date(record.DATA_EVOLUCAO);
        return recordDate >= startDate;
      });
    } else if (endDate) {
      results = results.filter((record) => {
        const recordDate = new Date(record.DATA_EVOLUCAO);
        return recordDate <= endDate;
      });
    }

    setFilteredData(results);
  }, [proposalNumber, situacao, startDate, endDate]);

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
              <label className="text-sm font-medium">Número Proposta Seguridade</label>
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
                <option value="ATIVA">Ativa</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADA">Aprovada</option>
                <option value="REJEITADA">Rejeitada</option>
                <option value="CANCELADA">Cancelada</option>
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
            data={filteredData}
            title="Resultados"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
