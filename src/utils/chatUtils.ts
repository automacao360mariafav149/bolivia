import { ChatMessage, N8nChatHistory, Conversation } from '@/types/chat';

export const extractHourFromTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.error('Error parsing timestamp:', error);
    return '';
  }
};

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Ontem';
  } else if (diffInDays < 7) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};

export const parseMessage = (chatHistory: N8nChatHistory): ChatMessage[] => {
  const parsedMessages: ChatMessage[] = [];

  try {
    const timestamp = chatHistory.hora || chatHistory.data || new Date().toISOString();

    if (typeof chatHistory.message === 'string') {
      try {
        const jsonMessage = JSON.parse(chatHistory.message);
        if (jsonMessage.type && jsonMessage.content) {
          parsedMessages.push({
            id: chatHistory.id,
            role: jsonMessage.type === 'human' ? 'user' : 'assistant',
            content: jsonMessage.content,
            type: jsonMessage.type,
            timestamp: timestamp,
            message: {
              type: jsonMessage.type,
              content: jsonMessage.content
            },
            data: timestamp,
            session_id: chatHistory.session_id,
            instancia: 'web'
          });
          return parsedMessages;
        }
      } catch (e) {
        parsedMessages.push({
          id: chatHistory.id,
          role: 'unknown',
          content: chatHistory.message,
          timestamp: timestamp,
          data: timestamp,
          session_id: chatHistory.session_id
        });
        return parsedMessages;
      }
    }

    if (chatHistory.message && typeof chatHistory.message === 'object') {
      if (chatHistory.message.type && chatHistory.message.content) {
        parsedMessages.push({
          id: chatHistory.id,
          role: chatHistory.message.type === 'human' ? 'user' : 'assistant',
          type: chatHistory.message.type,
          content: chatHistory.message.content,
          timestamp: timestamp,
          message: {
            type: chatHistory.message.type,
            content: chatHistory.message.content
          },
          data: timestamp,
          session_id: chatHistory.session_id,
          instancia: 'web'
        });
      }
      else if (chatHistory.message.messages && Array.isArray(chatHistory.message.messages)) {
        chatHistory.message.messages.forEach((msg: any, index: number) => {
          if (msg.role && msg.content) {
            parsedMessages.push({
              id: chatHistory.id + index,
              role: msg.role,
              content: msg.content,
              timestamp: timestamp,
              data: timestamp,
              session_id: chatHistory.session_id
            });
          }
        });
      }
      else if (chatHistory.message.role && chatHistory.message.content) {
        parsedMessages.push({
          id: chatHistory.id,
          role: chatHistory.message.role,
          content: chatHistory.message.content,
          timestamp: timestamp,
          data: timestamp,
          session_id: chatHistory.session_id
        });
      }
    }
  } catch (error) {
    console.error('Error parsing message:', error, chatHistory);
  }

  return parsedMessages;
};
