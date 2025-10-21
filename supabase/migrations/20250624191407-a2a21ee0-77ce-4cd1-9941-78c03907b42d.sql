
-- Add missing columns to dados_cliente table
ALTER TABLE public.dados_cliente 
ADD COLUMN IF NOT EXISTS nome_pet text,
ADD COLUMN IF NOT EXISTS porte_pet text,
ADD COLUMN IF NOT EXISTS raca_pet text,
ADD COLUMN IF NOT EXISTS cpf_cnpj text,
ADD COLUMN IF NOT EXISTS asaas_customer_id text,
ADD COLUMN IF NOT EXISTS payments jsonb;

-- Add hora column to n8n_chat_histories if it doesn't exist
ALTER TABLE public.n8n_chat_histories 
ADD COLUMN IF NOT EXISTS hora timestamp with time zone;
