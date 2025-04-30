
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader pageTitle={pageTitle} />
        <main className="p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
