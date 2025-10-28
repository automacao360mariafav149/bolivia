
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VehicleStock {
  id: number;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  preco: string;
  km: string;  // Campo em minúsculo conforme o banco
  descricao: string;
  drive_id: string;
  postagem: string;
  tipo_midia: string;
  status: string;
  data_cadastro: string;
  data_venda: string;
}

export function useVehicleStock() {
  const [vehicles, setVehicles] = useState<VehicleStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      console.log('Fetching vehicle stock data...');
      
      const { data, error, count } = await supabase
        .from('estoque')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
      }

      console.log('Vehicle stock data:', data);
      setVehicles((data || []).map(item => ({
        ...item,
        descricao: (item as any).descricao || '',
        postagem: (item as any).postagem || '',
        tipo_midia: (item as any).tipo_midia || '',
        status: (item as any).status || '',
        data_cadastro: (item as any).data_cadastro || '',
        data_venda: (item as any).data_venda || ''
      })));
      setTotalVehicles(count || 0);
      
    } catch (error) {
      console.error('Error in fetchVehicles:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do estoque de veículos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    loading,
    totalVehicles,
    refetchVehicles: fetchVehicles,
  };
}
