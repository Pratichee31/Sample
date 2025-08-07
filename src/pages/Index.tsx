import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import Chat from "./Chat";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => {}} />;
  }

  return <Chat userId={user.id} />;
};

export default Index;
