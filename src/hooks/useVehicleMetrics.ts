import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useVehicleMetrics() {
  const [metrics, setMetrics] = useState({
    availableVehicles: 0,
    soldThisMonth: 0,
    newEntriesThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();
  const isLoadingRef = useRef(false);
  const lastFetchRef = useRef(0);
  const FETCH_COOLDOWN = 2000; // 2 segundos entre chamadas

  const fetchMetrics = useCallback(async (force = false) => {
    // Evitar chamadas múltiplas simultâneas
    if (isLoadingRef.current && !force) {
      console.log('Fetch already in progress, skipping...');
      return;
    }

    // Controle de cooldown entre chamadas
    const now = Date.now();
    if (!force && now - lastFetchRef.current < FETCH_COOLDOWN) {
      console.log('Fetch cooldown active, skipping...');
      return;
    }

    try {
      isLoadingRef.current = true;
      // Só mostrar loading na primeira chamada
      if (initialLoad) {
        setLoading(true);
      }
      lastFetchRef.current = now;
      
      console.log('Fetching vehicle metrics...');

      // Buscar todos os veículos com status e datas
      const { data: allVehicles, error: allError } = await supabase
        .from('estoque')
        .select('id, status, data_cadastro, data_venda');

      if (allError) {
        console.error('Error fetching vehicles:', allError);
        throw allError;
      }

      console.log('All vehicles data:', allVehicles);

      // Datas do mês atual
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      let availableCount = 0;
      let soldCount = 0;
      let newEntriesCount = 0;

      if (allVehicles) {
        allVehicles.forEach((vehicle: any) => {
          const status = vehicle.status?.toLowerCase();
          
          // Veículos disponíveis: todos que NÃO estão vendidos
          if (status !== 'vendido') {
            availableCount++;
          }

          // Vendidos no mês: status = vendido E data_venda no mês atual
          if (status === 'vendido' && vehicle.data_venda) {
            const dataVenda = new Date(vehicle.data_venda);
            if (dataVenda >= firstDayOfMonth && dataVenda <= lastDayOfMonth) {
              soldCount++;
            }
          }

          // Entrada para venda no mês: cadastrados no mês atual (data_cadastro)
          if (vehicle.data_cadastro) {
            const dataCadastro = new Date(vehicle.data_cadastro);
            if (dataCadastro >= firstDayOfMonth && dataCadastro <= lastDayOfMonth) {
              newEntriesCount++;
            }
          }
        });
      }

      const newMetrics = {
        availableVehicles: availableCount,
        soldThisMonth: soldCount,
        newEntriesThisMonth: newEntriesCount,
      };

      console.log('Vehicle metrics calculated:', newMetrics);
      setMetrics(newMetrics);
      
    } catch (error) {
      console.error('Error in fetchMetrics:', error);
      if (initialLoad) {
        toast({
          title: "Erro",
          description: "Erro ao carregar métricas dos veículos.",
          variant: "destructive",
        });
      }
    } finally {
      isLoadingRef.current = false;
      if (initialLoad) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  }, [initialLoad, toast]);

  const refetchMetrics = useCallback(() => {
    fetchMetrics(false); // não forçar, respeitar cooldown
  }, [fetchMetrics]);

  useEffect(() => {
    fetchMetrics(true); // primeira chamada sempre executa
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    refetchMetrics,
  };
}