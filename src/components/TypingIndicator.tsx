import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 p-4 max-w-full message-appear">
      <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
          AI
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2 max-w-[85%]">
        <div className="bg-message-assistant text-message-assistant-foreground rounded-2xl px-4 py-3">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};