import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Message } from "@/components/ChatMessage";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useChat(userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations when user is available
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations");
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      const formattedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
        timestamp: new Date(msg.created_at),
        ...(msg.image_url && { imageUrl: msg.image_url })
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const createNewConversation = async (title: string = "New Chat") => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert([{ user_id: userId, title }])
        .select()
        .single();

      if (error) throw error;

      setCurrentConversationId(data.id);
      await loadConversations();
      return data.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
      return null;
    }
  };

  const saveMessage = async (message: Omit<Message, "timestamp">, conversationId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert([{
          conversation_id: conversationId,
          user_id: userId,
          content: message.content,
          role: message.role,
          image_url: message.imageUrl || null
        }]);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Failed to save message");
    }
  };

  const addMessage = async (message: Omit<Message, "timestamp">) => {
    const newMessage: Message = {
      ...message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Create conversation if none exists
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = await createNewConversation();
      if (!conversationId) return;
    }

    // Save to database
    await saveMessage(message, conversationId);

    // Update conversation's updated_at
    if (conversationId) {
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
      
      await loadConversations();
    }
  };

  const startNewChat = async () => {
    setCurrentConversationId(null);
    setMessages([]);
    toast.success("New chat started");
  };

  const switchConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const generateResponse = async (userMessage: string, generateImage: boolean = false) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message: userMessage, generateImage }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    conversations,
    currentConversationId,
    isLoading,
    addMessage,
    startNewChat,
    switchConversation,
    generateResponse,
    loadConversations
  };
}