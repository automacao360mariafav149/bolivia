
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

interface WhatsAppGroupHeaderProps {
  messagesCount: number;
}

const WhatsAppGroupHeader = ({ messagesCount }: WhatsAppGroupHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      {/* Header */}
      <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Users className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">Alvorada Veículos</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Page Title Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Grupo WhatsApp
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize mensagens em tempo real e gerencie funcionários
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2 text-lg">
            {messagesCount} mensagens
          </Badge>
        </div>
      </div>
    </>
  );
};

export default WhatsAppGroupHeader;
