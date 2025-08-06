import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string, generateImage?: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading = false, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isImageMode, setIsImageMode] = useState(false);

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim(), isImageMode);
      setMessage("");
      setIsImageMode(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border p-4">
      <div className="max-w-4xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-3">
          <Button
            variant={!isImageMode ? "default" : "secondary"}
            size="sm"
            onClick={() => setIsImageMode(false)}
            className="text-xs"
          >
            Text
          </Button>
          <Button
            variant={isImageMode ? "default" : "secondary"}
            size="sm"
            onClick={() => setIsImageMode(true)}
            className="text-xs"
          >
            <Image className="w-3 h-3 mr-1" />
            Image
          </Button>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isImageMode ? "Describe an image to generate..." : "Type a message..."}
              disabled={disabled || isLoading}
              className={cn(
                "min-h-[48px] max-h-32 resize-none bg-input border-input-border",
                "focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus",
                "rounded-2xl py-3 px-4 pr-12"
              )}
              rows={1}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading || disabled}
            size="sm"
            className={cn(
              "h-12 w-12 rounded-2xl flex-shrink-0",
              "transition-all duration-200",
              !message.trim() || isLoading || disabled 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:scale-105"
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {isImageMode && (
          <p className="text-xs text-muted-foreground mt-2 px-2">
            Image generation mode - Describe what you'd like to create
          </p>
        )}
      </div>
    </div>
  );
};