
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClientStats } from './useClientStats';
import { useConversations } from './useConversations';
import { useDashboardData } from './useDashboardData';

export function useDashboardRealtime(vehicleRefetch?: () => void) {
  const { fetchConversations } = useConversations();
  const { refetchStats } = useClientStats();
  const { refetchStats: refetchDashboardStats } = useDashboardData();

  useEffect(() => {
    console.log('Setting up dashboard-wide realtime updates');
    
    // Subscribe to changes in the clients table
    const clientsSubscription = supabase
      .channel('dashboard_clients_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'dados_cliente' 
        }, 
        async (payload) => {
          console.log('Client data changed:', payload);
          await refetchStats();
          await refetchDashboardStats();
        }
      )
      .subscribe();

    // Subscribe to changes in appointments/schedule
    const scheduleSubscription = supabase
      .channel('dashboard_schedule_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments' 
        }, 
        async () => {
          console.log('Schedule data changed');
          await refetchStats();
          await refetchDashboardStats();
        }
      )
      .subscribe();
      
      // Subscribe to changes in vehicle stock
    const vehicleSubscription = supabase
      .channel('dashboard_vehicle_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'estoque' 
        }, 
        async () => {
          console.log('Vehicle stock data changed');
          if (vehicleRefetch) {
            vehicleRefetch();
          }
          await refetchDashboardStats();
        }
      )
      .subscribe();

    // Subscribe to changes in documents
    const documentsSubscription = supabase
      .channel('dashboard_documents_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'documents' 
        }, 
        async () => {
          console.log('Documents data changed');
          await refetchDashboardStats();
        }
      )
      .subscribe();

    // Subscribe to changes in chat histories
    const chatSubscription = supabase
      .channel('dashboard_chat_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'n8n_chat_histories' 
        }, 
        async () => {
          console.log('Chat data changed');
          await refetchDashboardStats();
        }
      )
      .subscribe();

    // Subscribe to changes in test drives
    const testdriveSubscription = supabase
      .channel('dashboard_testdrive_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'testdrive' 
        }, 
        async () => {
          console.log('Test drive data changed');
          await refetchDashboardStats();
        }
      )
      .subscribe();

    // Subscribe to changes in employees
    const employeesSubscription = supabase
      .channel('dashboard_employees_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'funcionarios' 
        }, 
        async () => {
          console.log('Employees data changed');
          await refetchDashboardStats();
        }
      )
      .subscribe();

    // Subscribe to changes in group conversations
    const groupSubscription = supabase
      .channel('dashboard_group_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversas_grupo' 
        }, 
        async () => {
          console.log('Group conversations data changed');
          await refetchDashboardStats();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard realtime subscriptions');
      clientsSubscription.unsubscribe();
      scheduleSubscription.unsubscribe();
      vehicleSubscription.unsubscribe();
      documentsSubscription.unsubscribe();
      chatSubscription.unsubscribe();
      testdriveSubscription.unsubscribe();
      employeesSubscription.unsubscribe();
      groupSubscription.unsubscribe();
    };
  }, [refetchStats, fetchConversations, refetchDashboardStats, vehicleRefetch]);
}

