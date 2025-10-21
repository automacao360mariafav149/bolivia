
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricsCard from '@/components/dashboard/MetricsCard';
import ChatsCard from '@/components/dashboard/ChatsCard';
import KnowledgeCard from '@/components/dashboard/KnowledgeCard';
import ClientsCard from '@/components/dashboard/ClientsCard';
import VehicleStockCard from '@/components/dashboard/VehicleStockCard';
import WhatsAppGroupCard from '@/components/dashboard/WhatsAppGroupCard';
import EvolutionCard from '@/components/dashboard/EvolutionCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import NewCarsCard from '@/components/dashboard/NewCarsCard';
import { CarPostCard } from '@/components/dashboard/CarPostCard';
import InstagramMetricsCard from '@/components/dashboard/InstagramMetricsCard';
import WhatsAppClientGroupsCard from '@/components/dashboard/WhatsAppClientGroupsCard';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useDashboardRealtime();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 h-20 w-20 border-4 border-t-transparent border-purple-400 rounded-full animate-spin animate-reverse opacity-30"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Painel Administrativo
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            Alvorada Veículos - Gestão Inteligente
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        {/* Uniform Grid Layout - All cards same size */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <MetricsCard />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <ChatsCard />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <KnowledgeCard />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <ClientsCard />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <VehicleStockCard />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <WhatsAppGroupCard />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <EvolutionCard />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <ScheduleCard />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <NewCarsCard />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '1.0s' }}>
            <CarPostCard />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '1.1s' }}>
            <InstagramMetricsCard />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '1.2s' }}>
            <WhatsAppClientGroupsCard />
          </div>
        </div>
        
        {/* Quick Stats Footer */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">11</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Módulos Ativos</div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Disponibilidade</div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Real-time</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Atualizações</div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Cloud</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Armazenamento</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
