import { Button } from "@/components/ui/button";
import { MessageSquare, Image, Zap, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string, isImage?: boolean) => void;
}

export const WelcomeScreen = ({ onSelectPrompt }: WelcomeScreenProps) => {
  const suggestions = [
    {
      icon: MessageSquare,
      title: "Write a story",
      description: "Create a short creative story",
      prompt: "Write a short creative story about a time traveler who discovers they can only travel to moments of great kindness.",
      isImage: false,
    },
    {
      icon: Image,
      title: "Generate an image",
      description: "Create visual content",
      prompt: "A futuristic city at sunset with flying cars and neon lights",
      isImage: true,
    },
    {
      icon: Zap,
      title: "Explain a concept",
      description: "Get clear explanations",
      prompt: "Explain quantum computing in simple terms that a 10-year-old could understand.",
      isImage: false,
    },
    {
      icon: Sparkles,
      title: "Creative writing",
      description: "Brainstorm ideas",
      prompt: "Help me brainstorm creative ideas for a mobile app that helps people form new habits.",
      isImage: false,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome to ChatGPT Clone
            </h2>
            <p className="text-muted-foreground">
              Chat with AI, generate images, and explore creative possibilities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-4 text-left hover:bg-chat-surface-hover border border-border/50"
                onClick={() => onSelectPrompt(suggestion.prompt, suggestion.isImage)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm">
                      {suggestion.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="pt-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            Powered by Google Gemini AI
          </p>
          <p className="text-xs text-muted-foreground">
            Connect to Supabase for full functionality
          </p>
        </div>
      </div>
    </div>
  );
};