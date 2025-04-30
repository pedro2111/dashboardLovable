import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { 
  alertData, 
  tableData, 
  timeSeriesData,
  proposalStatusData
} from "@/data/dashboardData";
import { fetchKPIData } from "@/services/kpiService";
import { 
  BarChart, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Bar, 
  CartesianGrid, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ChartBar, AlertCircle, Calendar, GridIcon, ChartPie } from "lucide-react";

const columns: ColumnDef<typeof tableData[0]>[] = [
  {
    accessorKey: "agencia",
    header: "Agência",
  },
  {
    accessorKey: "operacao",
    header: "Operação",
  },
  {
    accessorKey: "valor",
    header: "Valor",
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valor"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      
      return formatted;
    },
  },
  {
    accessorKey: "data",
    header: "Data",
    cell: ({ row }) => {
      const date = new Date(row.getValue("data"));
      return date.toLocaleDateString("pt-BR");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      return (
        <Badge
          className={
            status === "Aprovado"
              ? "bg-green-100 text-green-800"
              : status === "Pendente"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }
        >
          {status}
        </Badge>
      );
    },
  },
];

const PIE_COLORS = ['#0050AB', '#2E7DD1', '#003B7A', '#FD8204', '#FF9A35', '#D96D00', '#0050AB', '#FD8204'];

const renderPieChartLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Index = () => {
  const [statusData, setStatusData] = useState<any[]>([]);
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statusResult, overviewResult] = await Promise.all([
          proposalStatusData(),
          fetchKPIData()
        ]);
        setStatusData(statusResult);
        setOverviewData(overviewResult);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout pageTitle="Visão Geral">
      {!isLoading && overviewData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <StatCard 
            title={overviewData[0].title} 
            value={overviewData[0].value} 
            description={overviewData[0].description} 
            trend={overviewData[0].trend} 
            icon={ChartBar}
            variant="default"
          />
          <StatCard 
            title={overviewData[1].title} 
            value={overviewData[1].value} 
            trend={overviewData[1].trend} 
            icon={Calendar}
            variant="primary"
          />
          <StatCard
            variant="condicional" 
            title={overviewData[2].title} 
            value={overviewData[2].value} 
            trend={overviewData[2].trend}
            icon={AlertCircle} 
          />
          <StatCard
            title={overviewData[3].title} 
            value={overviewData[3].value} 
            trend={overviewData[3].trend} 
            icon={GridIcon}
            variant="secondary"

          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <ChartCard title="Distribuição de Propostas por Situação">
          <div className="p-4 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 rounded-lg border border-white/20 dark:border-gray-700/30 shadow-lg">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderPieChartLabel}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="QTD_PROPOSTAS"
                  paddingAngle={2}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PIE_COLORS[index % PIE_COLORS.length]} 
                      strokeWidth={1}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const data = props.payload;
                    return [`${data.QTD_PROPOSTAS} (${data.PERCENTUAL}%)`, data.SG_SITUACAO_PROPOSTA];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  formatter={(value, entry, index) => {
                    const data = statusData[index];
                    return data.SG_SITUACAO_PROPOSTA;
                  }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ 
                    fontSize: '12px', 
                    paddingTop: '10px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '10px' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Operações Mensais" 
            description="Volume de operações nos últimos 12 meses"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#0050AB"
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Alertas Recentes</h2>
          {alertData.slice(0, 2).map((alert) => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              description={alert.description}
              severity={alert.severity}
              timestamp={alert.timestamp}
              onAction={() => console.log(`Resolvendo alerta ${alert.id}`)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <DataTable 
          columns={columns} 
          data={tableData}
          title="Operações Recentes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Distribuição por Tipo de Operação">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#FD8204" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
};

export default Index;
