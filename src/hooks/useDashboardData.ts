import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalClients: number;
  newClientsThisMonth: number;
  totalVehicles: number;
  totalDocuments: number;
  activeConversations: number;
  totalContacts: number;
  todayAppointments: number;
  totalEmployees: number;
  groupMessages: number;
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    newClientsThisMonth: 0,
    totalVehicles: 0,
    totalDocuments: 0,
    activeConversations: 0,
    totalContacts: 0,
    todayAppointments: 0,
    totalEmployees: 0,
    groupMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch total clients
      const { count: totalClients } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact', head: true });

      // Fetch new clients this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: newClientsThisMonth } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Fetch total vehicles
      const { count: totalVehicles } = await supabase
        .from('estoque')
        .select('*', { count: 'exact', head: true });

      // Fetch total documents
      const { count: totalDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      // Fetch active conversations (unique session_ids)
      const { data: conversationsData } = await supabase
        .from('n8n_chat_histories')
        .select('session_id')
        .order('data', { ascending: false });

      const uniqueSessionIds = conversationsData ? 
        [...new Set(conversationsData.map(item => item.session_id))] : [];
      const activeConversations = uniqueSessionIds.length;

      // Total contacts is same as total clients for now
      const totalContacts = totalClients || 0;

      // Fetch today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { count: todayAppointments } = await supabase
        .from('testdrive')
        .select('*', { count: 'exact', head: true })
        .gte('data_agendada', today.toISOString().split('T')[0])
        .lt('data_agendada', tomorrow.toISOString().split('T')[0]);

      // Fetch total employees
      const { count: totalEmployees } = await supabase
        .from('funcionarios')
        .select('*', { count: 'exact', head: true });

      // Fetch group messages count
      const { count: groupMessages } = await supabase
        .from('conversas_grupo')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalClients: totalClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        totalVehicles: totalVehicles || 0,
        totalDocuments: totalDocuments || 0,
        activeConversations,
        totalContacts,
        todayAppointments: todayAppointments || 0,
        totalEmployees: totalEmployees || 0,
        groupMessages: groupMessages || 0,
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    loading,
    refetchStats: fetchDashboardStats,
  };
}