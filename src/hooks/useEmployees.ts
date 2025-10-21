import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: number;
  nome: string;
  telefone: string;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error('Error in fetchEmployees:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de funcionários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    refetchEmployees: fetchEmployees,
  };
}