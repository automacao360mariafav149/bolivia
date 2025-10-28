
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useClientStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    growthPercentage: 0,
    monthlyGrowth: [],
    recentClients: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch total clients
      const { count: totalClients } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' });

      // Fetch active clients
      const { count: activeClients } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .eq('status', 'Active');

      // Fetch new clients this month (from 1st of current month to today)
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const { count: newClientsThisMonth } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .gte('created_at', firstDayOfMonth.toISOString())
        .lte('created_at', today.toISOString());

      // Fetch last month's clients to calculate growth
      const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      const { count: lastMonthClients } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .gte('created_at', firstDayOfLastMonth.toISOString())
        .lte('created_at', lastDayOfLastMonth.toISOString());

      // Calculate growth percentage
      const growthPercentage = lastMonthClients && lastMonthClients > 0
        ? Math.round(((newClientsThisMonth || 0) - lastMonthClients) / lastMonthClients * 100)
        : 0;

      // Fetch monthly growth data
      const currentYear = new Date().getFullYear();
      const monthlyGrowthData = [];
      
      for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(currentYear, month, 1);
        const endOfMonth = new Date(currentYear, month + 1, 0);
        
        const { count } = await supabase
          .from('dados_cliente')
          .select('*', { count: 'exact' })
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        monthlyGrowthData.push({
          month: monthNames[month],
          clients: count || 0
        });
      }

      // Fetch recent clients (last 15)
      const { data: recentClientsData } = await supabase
        .from('dados_cliente')
        .select('id, nome, telefone, created_at')
        .order('created_at', { ascending: false })
        .limit(15);

      const recentClients = recentClientsData?.map((client: any) => ({
        id: client.id,
        name: client.nome,
        phone: client.telefone,
        pets: 0,
        lastVisit: new Date(client.created_at).toLocaleDateString('pt-BR')
      })) || [];

      // Update stats
      setStats({
        totalClients: totalClients || 0,
        activeClients: activeClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        growthPercentage,
        monthlyGrowth: monthlyGrowthData,
        recentClients
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Ocorreu um erro ao atualizar as estatísticas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch stats on mount
  useEffect(() => {
    refetchStats();
  }, [refetchStats]);

  return { stats, loading, refetchStats };
}
