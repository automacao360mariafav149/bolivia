-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Enable RLS on all existing tables
ALTER TABLE public.dados_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testdrive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversas_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupo_concessionaria ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for dados_cliente (Customer data - Admin only due to sensitive CPF data)
CREATE POLICY "Admins can view all customer data" ON public.dados_cliente
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert customer data" ON public.dados_cliente
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update customer data" ON public.dados_cliente
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete customer data" ON public.dados_cliente
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for estoque (Vehicle inventory - Read all, Admin write)
CREATE POLICY "Authenticated users can view inventory" ON public.estoque
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage inventory" ON public.estoque
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for funcionarios (Employee data - Admin only)
CREATE POLICY "Admins can view employees" ON public.funcionarios
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage employees" ON public.funcionarios
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for documents (Knowledge base - Read all, Admin write)
CREATE POLICY "Authenticated users can view documents" ON public.documents
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage documents" ON public.documents
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for testdrive (Test drives - User sees own, Admin sees all) - Fixed column name
CREATE POLICY "Users can view their own test drives" ON public.testdrive
FOR SELECT USING (auth.uid()::text = "sessionId");

CREATE POLICY "Admins can view all test drives" ON public.testdrive
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage test drives" ON public.testdrive
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chat tables (Session-based access)
CREATE POLICY "Users can view their own chats" ON public.chats
FOR SELECT USING (auth.uid()::text = conversation_id);

CREATE POLICY "Admins can view all chats" ON public.chats
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage chats" ON public.chats
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
FOR SELECT USING (auth.uid()::text = conversation_id);

CREATE POLICY "Admins can view all chat messages" ON public.chat_messages
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage chat messages" ON public.chat_messages
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own n8n chats" ON public.n8n_chat_histories
FOR SELECT USING (auth.uid()::text = session_id);

CREATE POLICY "Admins can view all n8n chats" ON public.n8n_chat_histories
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage n8n chats" ON public.n8n_chat_histories
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for group conversations (Admin only due to business communications)
CREATE POLICY "Admins can view group conversations" ON public.conversas_grupo
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage group conversations" ON public.conversas_grupo
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view grupo_concessionaria" ON public.grupo_concessionaria
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage grupo_concessionaria" ON public.grupo_concessionaria
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to assign default user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger to auto-assign user role on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();