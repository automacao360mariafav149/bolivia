
import React from 'react';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/dashboard/StatsCards';

const Dashboard = () => {
  useDashboardRealtime();
  
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
        
        {/* Welcome Message */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bem-vindo à Alvorada Veículos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Use o menu lateral para navegar entre as diferentes seções do sistema
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Métricas</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Analytics & Insights</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100">Chats</h3>
              <p className="text-sm text-green-700 dark:text-green-300">WhatsApp em tempo real</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Clientes</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">CRM e gerenciamento</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Estoque</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">Gerenciamento de veículos</p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Conhecimento</h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">Base de documentos</p>
            </div>
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <h3 className="font-semibold text-pink-900 dark:text-pink-100">Agenda</h3>
              <p className="text-sm text-pink-700 dark:text-pink-300">Gerenciamento de funcionários</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
