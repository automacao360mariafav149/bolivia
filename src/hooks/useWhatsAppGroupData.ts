
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppMessage {
  id: number;
  data: string;
  hora: string;
  participante: string;
  mensagem: string;
}

interface Employee {
  id: number;
  nome: string;
  telefone: string;
}

export function useWhatsAppGroupData() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      console.log('Fetching WhatsApp group messages...');
      
      const { data, error } = await supabase
        .from('conversas_grupo')
        .select('*')
        .order('id', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('WhatsApp messages data:', data);
      setMessages(data || []);
      
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens do grupo.",
        variant: "destructive",
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      console.log('Fetching employees...');
      
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }

      console.log('Employees data:', data);
      setEmployees(data || []);
      
    } catch (error) {
      console.error('Error in fetchEmployees:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funcionários.",
        variant: "destructive",
      });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchMessages(), fetchEmployees()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription for messages
    const messagesChannel = supabase
      .channel('whatsapp-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversas_grupo',
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          fetchMessages();
        }
      )
      .subscribe();

    // Set up real-time subscription for employees
    const employeesChannel = supabase
      .channel('employees')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'funcionarios',
        },
        (payload) => {
          console.log('Real-time employee update:', payload);
          fetchEmployees();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(employeesChannel);
    };
  }, []);

  return {
    messages,
    employees,
    loading,
    refetchData: fetchData,
  };
}
