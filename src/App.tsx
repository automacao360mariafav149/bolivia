
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import MainLayout from "./components/layout/MainLayout";
import ChatsDashboard from "./pages/ChatsDashboard";
import ClientsDashboard from "./pages/ClientsDashboard";
import VehicleStockDashboard from "./pages/VehicleStockDashboard";
import MetricsDashboard from "./pages/MetricsDashboard";
import Schedule from "./pages/Schedule";
import KnowledgeManager from "./pages/KnowledgeManager";
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
                <Route index element={<MetricsDashboard />} />
                <Route path="chats" element={<ChatsDashboard />} />
                <Route path="clients" element={<ClientsDashboard />} />
                <Route path="vehicle-stock" element={<VehicleStockDashboard />} />
                <Route path="metrics" element={<MetricsDashboard />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="knowledge" element={<KnowledgeManager />} />
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
