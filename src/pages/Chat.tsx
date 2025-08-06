import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = async (userMessage: string, generateImage: boolean = false): Promise<{ response: string; imageUrl?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message: userMessage, generateImage }
      });

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get AI response');
    }
  };

  const handleSendMessage = async (content: string, generateImage: boolean = false) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Generate AI response
      const aiData = await generateResponse(content, generateImage);
      
      setIsTyping(false);
      
      // Add AI message
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: aiData.response,
        role: 'assistant',
        timestamp: new Date(),
        ...(aiData.imageUrl && { imageUrl: aiData.imageUrl })
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      setIsTyping(false);
      toast.error("Failed to get response. Please check your API configuration.");
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    toast.success("New chat started");
  };

  const handleSelectPrompt = (prompt: string, isImage: boolean = false) => {
    handleSendMessage(prompt, isImage);
  };

  return (
    <div className="flex flex-col h-screen bg-chat-background">
      <ChatHeader 
        onNewChat={handleNewChat}
        onOpenMenu={() => toast.info("Menu functionality - Connect to Supabase for full features")}
        onOpenSettings={() => toast.info("Settings functionality - Connect to Supabase for full features")}
      />
      
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div className="h-full overflow-y-auto chat-scroll">
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  isAnimating={true}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={isTyping}
      />
    </div>
  );
}