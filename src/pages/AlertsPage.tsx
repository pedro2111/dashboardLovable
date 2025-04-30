
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { alertData } from "@/data/dashboardData";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type SeverityFilter = "all" | "low" | "medium" | "high" | "critical";

const AlertsPage = () => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  
  const filteredAlerts = alertData.filter(alert => 
    severityFilter === "all" ? true : alert.severity === severityFilter
  );

  return (
    <DashboardLayout pageTitle="Alertas">
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Todos os Alertas</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filtrar por:</span>
            <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as SeverityFilter)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 animate-fade-in">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              description={alert.description}
              severity={alert.severity}
              timestamp={alert.timestamp}
              onAction={() => console.log(`Resolvendo alerta ${alert.id}`)}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg border">
            <h3 className="text-lg font-medium">Nenhum alerta encontrado</h3>
            <p className="text-gray-500 mt-2">
              Não há alertas com os filtros selecionados
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AlertsPage;
