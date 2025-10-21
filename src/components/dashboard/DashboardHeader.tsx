
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

const DashboardHeader = () => {
  return (
    <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Car className="h-8 w-8 text-petshop-gold" />
          <h1 className="text-2xl font-bold">Alvorada Veículos</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
            Bem-vindo à Alvorada Veículos
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
