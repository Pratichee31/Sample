import { useRef, useEffect, useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";

interface ChatProps {
  userId: string;
}

export default function Chat({ userId }: ChatProps) {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();
  const { 
    messages, 
    conversations, 
    currentConversationId,
    isLoading, 
    addMessage, 
    startNewChat, 
    switchConversation,
    generateResponse 
  } = useChat(userId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string, generateImage: boolean = false) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Omit<Message, "timestamp"> = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
    };

    await addMessage(userMessage);
    setIsTyping(true);

    try {
      // Generate AI response
      const aiData = await generateResponse(content, generateImage);
      
      setIsTyping(false);
      
      // Add AI message
      const aiMessage: Omit<Message, "timestamp"> = {
        id: crypto.randomUUID(),
        content: aiData.response,
        role: 'assistant',
        ...(aiData.imageUrl && { imageUrl: aiData.imageUrl })
      };

      await addMessage(aiMessage);
      
    } catch (error) {
      setIsTyping(false);
      toast.error("Failed to get response. Please check your API configuration.");
      console.error("Error generating response:", error);
    }
  };

  const handleSelectPrompt = (prompt: string, isImage: boolean = false) => {
    handleSendMessage(prompt, isImage);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for conversations */}
      <div className="w-64 bg-muted/30 border-r flex flex-col">
        <div className="p-4 border-b">
          <button
            onClick={startNewChat}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => switchConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  currentConversationId === conversation.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="font-medium text-sm truncate">
                  {conversation.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(conversation.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={signOut}
            className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          onNewChat={startNewChat}
          onOpenMenu={() => {}}
          onOpenSettings={() => {}}
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
    </div>
  );
}