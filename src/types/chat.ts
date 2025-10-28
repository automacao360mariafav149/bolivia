
export interface Client {
  id: number;
  telefone: string;
  nome: string;
  email: string;
  sessionid: string;
  cpf_cnpj?: string;
  status?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
  type?: string;
}

export interface N8nChatHistory {
  id: number;
  session_id: string;
  message: any; // This can be various formats, we'll parse it properly
  data: string; // Date in string format
  hora?: string; // This is the field containing the correct time
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  phone: string;
  email: string;
  address?: string;
  sessionId: string;
  status?: string;
  lead?: {
    name: string;
    phone: string;
    email?: string;
    source?: string;
    stage?: string;
    interest?: string;
  };
  lastActivity?: string;
  messageCount?: number;
}
