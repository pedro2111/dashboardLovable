
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AlertsPage from "./pages/AlertsPage";
import TimeAnalysisPage from "./pages/TimeAnalysisPage";
import DistributionPage from "./pages/DistributionPage";
import ProposalHistoryPage from "./pages/ProposalHistoryPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/alertas" element={<AlertsPage />} />
            <Route path="/analise-temporal" element={<TimeAnalysisPage />} />
            <Route path="/distribuicao" element={<DistributionPage />} />
            <Route path="/historico-proposta" element={<ProposalHistoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
