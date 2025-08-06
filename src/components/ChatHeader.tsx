import { Button } from "@/components/ui/button";
import { Plus, Menu, Settings } from "lucide-react";

interface ChatHeaderProps {
  onNewChat: () => void;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
}

export const ChatHeader = ({ onNewChat, onOpenMenu, onOpenSettings }: ChatHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-chat-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenMenu}
            className="text-foreground hover:bg-chat-surface-hover"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-foreground">ChatGPT Clone</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="text-foreground hover:bg-chat-surface-hover"
          >
            <Plus className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="text-foreground hover:bg-chat-surface-hover"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};