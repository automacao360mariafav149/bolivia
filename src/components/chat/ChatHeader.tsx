
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, Car } from 'lucide-react';

const ChatHeader = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/metrics');
  };

  return (
    <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack} 
            className="text-white hover:bg-blue-700 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Car className="h-8 w-8 text-petshop-gold" />
          <h1 className="text-2xl font-bold">Chats</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
            Alvorada Veículos
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
