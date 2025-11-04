import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { Message, AgentRequest } from '@/types/chat';
import { useConversations } from './useConversations'; // Import useConversations

interface SupabasePayload {
  new: {
    id: string;
    session_id: string;
    message: {
      type: 'human' | 'ai';
      content: string;
    };
    created_at: string;
  };
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { triggerRefresh } = useConversations(); // Use triggerRefresh from useConversations

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: SupabasePayload) => {
          const newMessage = payload.new;
          if (newMessage.session_id === sessionId && newMessage.message) {
            const message: Message = {
              id: newMessage.id,
              type: newMessage.message.type,
              content: newMessage.message.content,
              created_at: newMessage.created_at,
            };
            
            if (message.type === 'ai') {
              setIsLoading(false);
            }
            
            setMessages((prev) => [...prev, message]);
            // If a new human message is inserted, trigger a refresh of conversations
            if (message.type === 'human') {
              triggerRefresh();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);

    const agentRequest: AgentRequest = {
      query: content,
      user_id: 'NA',
      request_id: uuidv4(),
      session_id: sessionId,
    };

    try {
      const response = await fetch('https://n8n-law-agent.dfngk5.easypanel.host/api/pydantic-Law-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(uuidv4());
    setIsLoading(false);
    triggerRefresh(); // Trigger refresh when a new chat is started
  };

  const handleSelectConversation = async (selectedSessionId: string) => {
    setMessages([]);
    setSessionId(selectedSessionId);
    setIsLoading(false);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', selectedSessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = data.map((row: SupabasePayload['new']) => ({
        id: row.id,
        type: row.message.type,
        content: row.message.content,
        created_at: row.created_at,
      }));

      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  return {
    messages,
    sessionId,
    isLoading,
    messagesEndRef,
    handleSendMessage,
    handleNewChat,
    handleSelectConversation,
  };
};
