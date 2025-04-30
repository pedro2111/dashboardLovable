
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { distributionData } from "@/data/dashboardData";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const COLORS = ['#0050AB', '#2E7DD1', '#003B7A', '#FD8204', '#FF9A35'];

const DistributionPage = () => {
  // Calcular o total para porcentagens
  const total = distributionData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <DashboardLayout pageTitle="Distribuição Proposta">
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <h2 className="text-lg font-medium">Distribuição de Operações</h2>
        <p className="text-gray-500 text-sm mt-1">
          Análise da distribuição por tipos de produtos e serviços
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        <ChartCard title="Distribuição por Produto">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detalhamento</h3>
          {distributionData.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">{item.value}%</span>
                    <p className="text-xs text-gray-500">
                      do total de operações
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
          <CardContent className="p-6">
            <h3 className="font-medium">Produto Mais Popular</h3>
            <p className="text-2xl font-bold mt-2">Crédito Imobiliário</p>
            <p className="text-sm mt-1 text-white/80">35% do total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border">
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-600">Taxa Média</h3>
            <p className="text-2xl font-bold mt-2">9.8%</p>
            <p className="text-sm mt-1 text-gray-500">Todos os produtos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border">
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-600">Valor Médio</h3>
            <p className="text-2xl font-bold mt-2">R$ 124.500</p>
            <p className="text-sm mt-1 text-gray-500">Por operação</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-secondary to-secondary-dark text-white">
          <CardContent className="p-6">
            <h3 className="font-medium">Prazo Médio</h3>
            <p className="text-2xl font-bold mt-2">15.4 anos</p>
            <p className="text-sm mt-1 text-white/80">Crédito Imobiliário</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DistributionPage;
