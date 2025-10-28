
import React from 'react';
import { LineChart, Users, Car, TrendingUp, Plus, Activity } from 'lucide-react';
import { useClientStats } from '@/hooks/useClientStats';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import { useVehicleMetrics } from '@/hooks/useVehicleMetrics';

// Import components
import DashboardHeader from '@/components/metrics/DashboardHeader';
import StatCard from '@/components/metrics/StatCard';
import RecentClientsTable from '@/components/metrics/RecentClientsTable';

const MetricsDashboard = () => {
  const { stats, loading, refetchStats } = useClientStats();
  const { metrics: vehicleMetrics, loading: vehicleLoading, refetchMetrics } = useVehicleMetrics();
  
  // Conectar realtime updates com veículo
  useDashboardRealtime(refetchMetrics);
  
  // Obter o mês atual formatado
  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long' });
  const currentMonthCapitalized = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
  
  const recentClientsData = stats.recentClients?.length > 0
    ? stats.recentClients
    : [
        { id: 1, name: 'Carregando...', phone: '...', vehicles: 0, lastVisit: '...' }
      ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <LineChart className="h-6 w-6 text-petshop-blue dark:text-blue-400" />
            Dashboard de Métricas - Alvorada Veículos
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Veículos Disponíveis"
            value={vehicleMetrics.availableVehicles}
            icon={<Car />}
            trend={`Disponíveis para venda`}
            loading={vehicleLoading}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
            iconTextClass="text-blue-600 dark:text-blue-400"
          />
          
          <StatCard 
            title={`Vendidos em ${currentMonthCapitalized}`}
            value={vehicleMetrics.soldThisMonth}
            icon={<TrendingUp />}
            trend={`Vendas do mês vigente`}
            loading={vehicleLoading}
            iconBgClass="bg-green-100 dark:bg-green-900/30"
            iconTextClass="text-green-600 dark:text-green-400"
          />
          
          <StatCard 
            title={`Entrada para venda em ${currentMonthCapitalized}`}
            value={vehicleMetrics.newEntriesThisMonth}
            icon={<Plus />}
            trend={`Novos veículos cadastrados`}
            loading={vehicleLoading}
            iconBgClass="bg-purple-100 dark:bg-purple-900/30"
            iconTextClass="text-purple-600 dark:text-purple-400"
          />
        </div>
        
        {/* Métricas de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total de Clientes"
            value={stats.totalClients}
            icon={<Users />}
            trend={`Todos os clientes cadastrados`}
            loading={loading}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
            iconTextClass="text-blue-600 dark:text-blue-400"
          />
          
          <StatCard 
            title="Clientes Ativos"
            value={stats.activeClients}
            icon={<Activity />}
            trend={`Com status ativo`}
            loading={loading}
            iconBgClass="bg-green-100 dark:bg-green-900/30"
            iconTextClass="text-green-600 dark:text-green-400"
          />
          
          <StatCard 
            title={`Novos em ${currentMonthCapitalized}`}
            value={stats.newClientsThisMonth}
            icon={<Plus />}
            trend={`Cadastrados no mês vigente`}
            loading={loading}
            iconBgClass="bg-purple-100 dark:bg-purple-900/30"
            iconTextClass="text-purple-600 dark:text-purple-400"
          />

          <StatCard 
            title="Crescimento Mensal"
            value={`${stats.growthPercentage > 0 ? '+' : ''}${stats.growthPercentage}%`}
            icon={<TrendingUp />}
            trend={`Comparado ao mês anterior`}
            loading={loading}
            iconBgClass="bg-orange-100 dark:bg-orange-900/30"
            iconTextClass="text-orange-600 dark:text-orange-400"
          />
        </div>
        
        {/* Tabela de Clientes Recentes */}
        <div className="mb-8">
          <RecentClientsTable clients={recentClientsData} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default MetricsDashboard;
