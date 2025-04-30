
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { timeSeriesData, dailyTimeData } from "@/data/dashboardData";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TimeAnalysisPage = () => {
  return (
    <DashboardLayout pageTitle="Análise Temporal">
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <h2 className="text-lg font-medium">Análise de Dados Temporais</h2>
        <p className="text-gray-500 text-sm mt-1">
          Visualize tendências e padrões ao longo do tempo
        </p>
      </div>

      <Tabs defaultValue="mensal" className="animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="mensal">Mensal</TabsTrigger>
          <TabsTrigger value="semanal">Semanal</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mensal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard 
              title="Evolução de Operações" 
              description="Volume mensal de operações"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="#0050AB"
                    fill="#0050AB"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard 
              title="Desempenho Mensal" 
              description="Comparação de desempenho mensal"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#FD8204" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
        
        <TabsContent value="semanal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartCard 
              title="Padrão Semanal" 
              description="Volume de operações por dia da semana"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTimeData}>
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

            <ChartCard 
              title="Volume Diário" 
              description="Desempenho por dia da semana"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyTimeData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#FD8204" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
        
        <TabsContent value="comparativo">
          <ChartCard 
            title="Análise Comparativa" 
            description="Comparação de períodos"
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  name="Ano Atual"
                  stroke="#0050AB"
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  name="Ano Anterior"
                  stroke="#FD8204"
                  strokeWidth={2} 
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  // Exemplo de dados simulados do ano anterior
                  data={timeSeriesData.map(item => ({
                    date: item.date,
                    valor: item.valor * 0.8 // Dados simulados de 80% do ano atual
                  }))}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium">Crescimento YoY</h4>
                <p className="text-2xl font-bold text-primary mt-2">+22.4%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium">Média Mensal</h4>
                <p className="text-2xl font-bold text-primary mt-2">3,231</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium">Pico de Operações</h4>
                <p className="text-2xl font-bold text-primary mt-2">Dezembro</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TimeAnalysisPage;
