
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ChatsDashboard from "./pages/ChatsDashboard";
import ClientsDashboard from "./pages/ClientsDashboard";
import VehicleStockDashboard from "./pages/VehicleStockDashboard";
import WhatsAppGroupDashboard from "./pages/WhatsAppGroupDashboard";
import MetricsDashboard from "./pages/MetricsDashboard";
import Schedule from "./pages/Schedule";
import Evolution from "./pages/Evolution";
import AgentConfig from "./pages/AgentConfig";
import KnowledgeManager from "./pages/KnowledgeManager";
import ConfigurationManager from "./pages/ConfigurationManager";
import InstagramMetricsDashboard from "./pages/InstagramMetricsDashboard";
import WhatsAppClientGroupsDashboard from "./pages/WhatsAppClientGroupsDashboard";
import NewCarsPage from "./pages/NewCarsPage";
import CarPostPage from "./pages/CarPostPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="chats" element={<ChatsDashboard />} />
                <Route path="clients" element={<ClientsDashboard />} />
                <Route path="vehicle-stock" element={<VehicleStockDashboard />} />
                <Route path="whatsapp-group" element={<WhatsAppGroupDashboard />} />
                <Route path="metrics" element={<MetricsDashboard />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="evolution" element={<Evolution />} />
                <Route path="agent-config" element={<AgentConfig />} />
                <Route path="knowledge" element={<KnowledgeManager />} />
                <Route path="configuration" element={<ConfigurationManager />} />
                <Route path="instagram-metrics" element={<InstagramMetricsDashboard />} />
                <Route path="whatsapp-client-groups" element={<WhatsAppClientGroupsDashboard />} />
                <Route path="new-cars" element={<NewCarsPage />} />
                <Route path="car-post" element={<CarPostPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
