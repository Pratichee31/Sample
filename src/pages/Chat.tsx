import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { toast } from "sonner";

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

  const generateResponse = async (userMessage: string, generateImage: boolean = false): Promise<string> => {
    // Simulate API call - Replace with actual Gemini API integration
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (generateImage) {
      return "I'd generate an image here, but you'll need to integrate with Gemini's image generation API. For now, here's a description of what I would create: " + userMessage;
    }
    
    // Simulate different types of responses
    const responses = [
      `That's an interesting question about "${userMessage}". Let me provide you with a detailed response...`,
      `Based on your message "${userMessage}", here are some thoughts...`,
      `I understand you're asking about "${userMessage}". Here's what I can tell you...`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " This is a simulated response. To get real AI responses, you'll need to integrate with the Gemini API and connect to Supabase for data persistence.";
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
      const aiResponse = await generateResponse(content, generateImage);
      
      setIsTyping(false);
      
      // Add AI message
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        ...(generateImage && { imageUrl: "https://via.placeholder.com/400x300?text=Generated+Image" })
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