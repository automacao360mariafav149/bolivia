
import React from 'react';
import { MessageCircle, Search, User, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface WhatsAppMessage {
  id: number;
  data: string;
  hora: string;
  participante: string;
  mensagem: string;
}

interface MessagesPanelProps {
  messages: WhatsAppMessage[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const MessagesPanel = ({ messages, loading, searchTerm, onSearchChange }: MessagesPanelProps) => {
  const filteredMessages = messages.filter(message =>
    message.mensagem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.participante?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString;
  };

  const isAgent = (participant: string) => {
    return participant?.toLowerCase() === 'agente';
  };

  return (
    <Card className="h-full dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <MessageCircle className="h-5 w-5" />
          Mensagens do Grupo
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Conversas em tempo real do grupo WhatsApp
        </CardDescription>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar mensagens ou participantes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-6 w-6 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Nenhuma mensagem encontrada.' : 'Nenhuma mensagem disponível.'}
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`rounded-lg border p-4 shadow-sm ${
                    isAgent(message.participante) 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className={`h-4 w-4 ${
                        isAgent(message.participante) ? 'text-blue-600' : 'text-blue-500'
                      }`} />
                      <span className={`font-medium ${
                        isAgent(message.participante) 
                          ? 'text-blue-800 dark:text-blue-300' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {message.participante || 'Participante desconhecido'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(message.data)}</span>
                      <span>{formatTime(message.hora)}</span>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className={`text-sm leading-relaxed ${
                    isAgent(message.participante) 
                      ? 'text-blue-800 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {message.mensagem || 'Mensagem vazia'}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MessagesPanel;
