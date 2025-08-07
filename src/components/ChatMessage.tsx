import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
}

interface ChatMessageProps {
  message: Message;
  isAnimating?: boolean;
}

export const ChatMessage = ({ message, isAnimating = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 p-4 max-w-full",
      isAnimating && "message-appear"
    )}>
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            AI
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col gap-2 max-w-[85%]",
        isUser && "ml-auto"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 break-words",
          isUser 
            ? "bg-message-user text-message-user-foreground ml-auto" 
            : "bg-message-assistant text-message-assistant-foreground"
        )}>
          {message.imageUrl && (
            <div className="mb-2">
              <img 
                src={message.imageUrl} 
                alt="Generated content"
                className="rounded-xl max-w-full h-auto border border-border"
                onLoad={() => console.log('Image loaded successfully:', message.imageUrl)}
                onError={(e) => {
                  console.error('Image failed to load:', message.imageUrl, e);
                  e.currentTarget.style.display = 'none';
                }}
                style={{ maxHeight: '400px' }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Image URL: {message.imageUrl}
              </p>
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <time className="text-xs text-muted-foreground px-2">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </time>
      </div>
      
      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};