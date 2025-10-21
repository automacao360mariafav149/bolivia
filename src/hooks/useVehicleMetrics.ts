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

      const { data: allVehicles, error: allError } = await supabase
        .from('estoque')
        .select('id, status');

      if (allError) {
        console.error('Error fetching vehicles:', allError);
        throw allError;
      }

      console.log('All vehicles data:', allVehicles);

      // Calculate metrics from the fetched data
      let availableCount = 0;
      let soldCount = 0;

      if (allVehicles) {
        allVehicles.forEach(vehicle => {
          const status = (vehicle as any).status;
          if (status === 'vendido') {
            soldCount++;
          } else {
            availableCount++;
          }
        });
      }

      const newEntriesCount = availableCount;

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