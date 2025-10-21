import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DebugInfo = () => {
  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('dados_cliente').select('count').limit(1);
      if (error) {
        console.error('Connection test failed:', error.message);
        alert('Connection failed');
      } else {
        alert('Connection successful');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/10 p-4 rounded-lg backdrop-blur-sm">
      <div className="text-white text-xs space-y-2">
        <div>Debug Mode</div>
        <button 
          onClick={checkConnection}
          className="bg-petshop-gold text-petshop-blue px-2 py-1 rounded text-xs"
        >
          Test Connection
        </button>
      </div>
    </div>
  );
};