
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, Wifi, Activity } from 'lucide-react';

const EvolutionCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/evolution');
  };
  
  return (
    <Card className="h-[400px] cursor-pointer group glass-card border-0 bg-gradient-to-br from-white/80 via-blue-50/80 to-cyan-50/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-600/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu rounded-3xl" onClick={handleClick}>
      <CardHeader className="pb-3 relative overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:-rotate-3">
              <Link className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
              Conectado
            </Badge>
          </div>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Evolution
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
            Conectar e sincronizar
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-4 flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Link className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Wifi className="h-2 w-2 text-white" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">API</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Plataforma Evolution</div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-600 dark:text-gray-400">Status: OK</span>
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-medium">v1.2.3</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full text-center">
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors duration-300">
            Conectar Evolution
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EvolutionCard;
