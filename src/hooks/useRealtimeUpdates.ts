
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealtimeUpdatesProps {
  updateConversationLastMessage: (sessionId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
}

export function useRealtimeUpdates({ 
  updateConversationLastMessage,
  fetchConversations 
}: UseRealtimeUpdatesProps) {
  
  useEffect(() => {
    console.log('Setting up realtime updates for chat history');
    
    // Create a subscription for chat history updates
    const chatSubscription = supabase
      .channel('n8n_chat_histories_updates')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'n8n_chat_histories' 
        }, 
        (payload) => {
          console.log('New chat history entry detected:', payload);
          
          const sessionId = payload.new.session_id;
          console.log(`Processing message for session: ${sessionId}`);
          
          // Update the last message in the conversation list
          updateConversationLastMessage(sessionId)
            .then(() => console.log(`Updated last message for conversation: ${sessionId}`))
            .catch(error => console.error(`Error updating conversation: ${error}`));
        }
      )
      .subscribe();

    // Also listen for updates to existing messages
    const updateSubscription = supabase
      .channel('n8n_chat_histories_updates_modify')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'n8n_chat_histories' 
        }, 
        (payload) => {
          console.log('Chat history entry updated:', payload);
          
          const sessionId = payload.new.session_id;
          console.log(`Processing updated message for session: ${sessionId}`);
          
          updateConversationLastMessage(sessionId)
            .then(() => console.log(`Updated conversation after modification: ${sessionId}`))
            .catch(error => console.error(`Error updating conversation: ${error}`));
        }
      )
      .subscribe();
      
    console.log('Realtime subscriptions established');
      
    return () => {
      console.log('Cleaning up realtime subscriptions');
      chatSubscription.unsubscribe();
      updateSubscription.unsubscribe();
    };
  }, [updateConversationLastMessage, fetchConversations]);
}
