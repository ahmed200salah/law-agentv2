import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Conversation } from '@/types/chat';

interface ConversationRow {
  session_id: string;
  message: {
    type: string;
    content: string;
  };
  created_at: string;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to trigger re-fetch

  useEffect(() => {
    loadConversations();
  }, [refreshTrigger]); // Depend on refreshTrigger

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('session_id, message, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const conversationMap = new Map<string, Conversation>();
      
      data?.forEach((row: ConversationRow) => {
        if (!conversationMap.has(row.session_id) && row.message?.type === 'human') {
          const rawTitle = row.message.content;
          const title = rawTitle.length > 50 ? rawTitle.slice(0, 50) + '...' : rawTitle;
          conversationMap.set(row.session_id, {
            session_id: row.session_id,
            title,
            created_at: row.created_at,
          });
        }
      });

      setConversations(Array.from(conversationMap.values()).reverse());
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const deleteConversation = async (sessionIdToDelete: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('session_id', sessionIdToDelete);

      if (error) throw error;

      // Optimistically update UI or trigger a reload
      setConversations(prev => prev.filter(conv => conv.session_id !== sessionIdToDelete));
      triggerRefresh(); // Ensure the list is fully reloaded
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return { conversations, loadConversations, deleteConversation, triggerRefresh };
};
