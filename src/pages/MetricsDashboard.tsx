
import React, { useEffect } from 'react';
import { LineChart, Users, Smartphone, Car, TrendingUp, Plus } from 'lucide-react';
import { useClientStats } from '@/hooks/useClientStats';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import { useVehicleMetrics } from '@/hooks/useVehicleMetrics';

// Import components
import DashboardHeader from '@/components/metrics/DashboardHeader';
import StatCard from '@/components/metrics/StatCard';
import ClientGrowthChart from '@/components/metrics/ClientGrowthChart';
import VehicleTypesChart from '@/components/metrics/VehicleTypesChart';
import ServicesBarChart from '@/components/metrics/ServicesBarChart';
import RecentClientsTable from '@/components/metrics/RecentClientsTable';

const MetricsDashboard = () => {
  const { stats, loading, refetchStats } = useClientStats();
  const { metrics: vehicleMetrics, loading: vehicleLoading, refetchMetrics } = useVehicleMetrics();
  
  // Conectar realtime updates com veículo
  useDashboardRealtime(refetchMetrics);
  
  // Remover chamadas desnecessárias - os hooks já fazem fetch inicial
  
  const monthlyCustomersData = stats.monthlyGrowth?.length > 0 
    ? stats.monthlyGrowth 
    : [
        { month: 'Jan', clients: 0 },
        { month: 'Fev', clients: 0 },
        { month: 'Mar', clients: 0 },
        { month: 'Abr', clients: 0 },
        { month: 'Mai', clients: 0 },
        { month: 'Jun', clients: 0 },
        { month: 'Jul', clients: 0 },
        { month: 'Ago', clients: 0 },
        { month: 'Set', clients: 0 },
        { month: 'Out', clients: 0 },
        { month: 'Nov', clients: 0 },
        { month: 'Dez', clients: 0 }
      ];
  
  const vehicleTypesData = [
    { name: 'Sedan', value: 35, color: '#8B5CF6' },
    { name: 'SUV', value: 25, color: '#3B82F6' },
    { name: 'Hatchback', value: 20, color: '#10B981' },
    { name: 'Pickup', value: 15, color: '#F59E0B' },
    { name: 'Outros', value: 5, color: '#EF4444' }
  ];

  const vehicleServicesData = [
    { name: 'Vendas', value: 45 },
    { name: 'Manutenção', value: 35 },
    { name: 'Consultoria', value: 20 },
    { name: 'Financiamento', value: 30 },
    { name: 'Seguros', value: 25 },
  ];
  
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
            title={`Vendidos em ${new Date().toLocaleDateString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleDateString('pt-BR', { month: 'long' }).slice(1)}`}
            value={vehicleMetrics.soldThisMonth}
            icon={<TrendingUp />}
            trend={`Vendas do mês vigente`}
            loading={vehicleLoading}
            iconBgClass="bg-green-100 dark:bg-green-900/30"
            iconTextClass="text-green-600 dark:text-green-400"
          />
          
          <StatCard 
            title={`Entrada para venda em ${new Date().toLocaleDateString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleDateString('pt-BR', { month: 'long' }).slice(1)}`}
            value={vehicleMetrics.newEntriesThisMonth}
            icon={<Plus />}
            trend={`Novos veículos cadastrados`}
            loading={vehicleLoading}
            iconBgClass="bg-purple-100 dark:bg-purple-900/30"
            iconTextClass="text-purple-600 dark:text-purple-400"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total de Clientes"
            value={stats.totalClients}
            icon={<Users />}
            trend={`Aumento de ${Math.round((stats.newClientsThisMonth / (stats.totalClients - stats.newClientsThisMonth || 1)) * 100)}% este mês`}
            loading={loading}
            iconBgClass="bg-orange-100 dark:bg-orange-900/30"
            iconTextClass="text-orange-600 dark:text-orange-400"
          />
          
          <StatCard 
            title="Novos Clientes (Mês)"
            value={stats.newClientsThisMonth}
            icon={<Smartphone />}
            trend={`+${stats.newClientsThisMonth} comparado ao mês anterior`}
            loading={loading}
            iconBgClass="bg-pink-100 dark:bg-pink-900/30"
            iconTextClass="text-pink-600 dark:text-pink-400"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ClientGrowthChart data={monthlyCustomersData} loading={loading} />
          <VehicleTypesChart data={vehicleTypesData} loading={loading} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServicesBarChart data={vehicleServicesData} />
          <RecentClientsTable clients={recentClientsData} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default MetricsDashboard;
