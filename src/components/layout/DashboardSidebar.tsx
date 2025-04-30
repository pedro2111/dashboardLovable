
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  ChartBar, 
  LayoutDashboard, 
  AlertCircle, 
  Calendar, 
  GridIcon,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  children, 
  collapsed 
}: { 
  to: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  collapsed: boolean;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 text-sm transition-all rounded-md hover:bg-primary/10",
          isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-600 dark:text-gray-300"
        )
      }
    >
      <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
      {!collapsed && <span>{children}</span>}
    </NavLink>
  );
};

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "border-r border-gray-200 dark:border-gray-700 h-screen bg-white dark:bg-gray-900 transition-all sticky top-0 left-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary mr-2" />
            <span className="text-lg font-bold dark:text-white">CAIXA</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChartBar className="h-5 w-5" />
          ) : (
            <ChartBar className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="py-6 px-2 space-y-1">
        <SidebarLink to="/" icon={LayoutDashboard} collapsed={collapsed}>
          Visão Geral
        </SidebarLink>
        <SidebarLink to="/alertas" icon={AlertCircle} collapsed={collapsed}>
          Alertas
        </SidebarLink>
        <SidebarLink to="/analise-temporal" icon={Calendar} collapsed={collapsed}>
          Análise Temporal
        </SidebarLink>
        <SidebarLink to="/distribuicao" icon={GridIcon} collapsed={collapsed}>
          Distribuição Proposta
        </SidebarLink>
        <SidebarLink to="/historico-proposta" icon={History} collapsed={collapsed}>
          Histórico Proposta
        </SidebarLink>
      </div>
    </div>
  );
}
