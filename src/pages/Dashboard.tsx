
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/dashboard/StatsCards';
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
    <div className="flex-1 overflow-auto">
      <Header 
        title="Dashboard" 
        subtitle="Gerencie todos os seus veículos em um só lugar"
        showSearch={false}
        showActions={false}
      />
      
      <main className="p-6">
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Page Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            12 de 122 veículos
          </p>
        </div>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <MetricsCard />
          <ChatsCard />
          <KnowledgeCard />
          <ClientsCard />
          <VehicleStockCard />
          <WhatsAppGroupCard />
          <EvolutionCard />
          <ScheduleCard />
          <NewCarsCard />
          <CarPostCard />
          <InstagramMetricsCard />
          <WhatsAppClientGroupsCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
