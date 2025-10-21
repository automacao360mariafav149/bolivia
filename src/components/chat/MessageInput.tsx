import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Conversation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { getAllEndpoints } from '@/constants/apiEndpoints';
import { secureWebhookRequest } from '@/utils/webhookSecurity';

interface MessageInputProps {
  selectedChat: string | null;
  selectedConversation?: Conversation;
}

const MessageInput = ({ selectedChat, selectedConversation }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação detalhada dos dados
    if (!newMessage.trim()) {
      toast({
        title: 'Mensagem vazia',
        description: 'Digite uma mensagem antes de enviar.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedChat) {
      toast({
        title: 'Chat não selecionado',
        description: 'Selecione um chat para enviar mensagens.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedConversation?.phone) {
      toast({
        title: 'Telefone não encontrado',
        description: 'Número de telefone não disponível para este chat.',
        variant: 'destructive',
      });
      return;
    }
    
    const endpoints = getAllEndpoints();
    const url = endpoints.enviaMensagem;
    const payload = {
      message: newMessage.trim(),
      phoneNumber: selectedConversation.phone,
    };

    console.log('🚀 Enviando mensagem:', {
      url,
      payload,
      selectedChat,
      selectedConversation: selectedConversation.phone
    });
    
    try {
      setIsSending(true);
      
      // Usar secure webhook request com timeout
      const response = await secureWebhookRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }, 15000); // 15 segundos de timeout
      
      console.log('✅ Resposta do webhook:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(`Webhook retornou erro: ${response.status} - ${errorText}`);
      }
      
      setNewMessage('');
      
      toast({
        title: 'Mensagem enviada',
        description: 'Sua mensagem foi enviada com sucesso.',
      });
      
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      
      let errorMessage = 'Não foi possível enviar sua mensagem.';
      let errorDescription = 'Tente novamente em alguns instantes.';
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid webhook URL')) {
          errorMessage = 'URL do webhook inválida';
          errorDescription = 'Verifique a configuração dos endpoints.';
        } else if (error.message.includes('Webhook request failed')) {
          errorMessage = 'Falha na conexão';
          errorDescription = 'Servidor indisponível ou problema de rede.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Erro de conectividade';
          errorDescription = 'Verifique sua conexão com a internet e se o webhook está acessível.';
        }
      }
      
      toast({
        title: errorMessage,
        description: errorDescription,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Digite uma mensagem"
          className="flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-green-500 hover:bg-green-600 text-white"
          disabled={isSending}
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
