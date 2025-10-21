import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Plus, ImagePlus } from 'lucide-react';
import NewCarFormDialog from './NewCarFormDialog';
const NewCarsCard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleClick = () => {
    setDialogOpen(true);
  };
  return <>
      <Card className="h-[400px] cursor-pointer group glass-card border-0 bg-gradient-to-br from-white/80 via-emerald-50/80 to-teal-50/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-600/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu rounded-3xl" onClick={handleClick}>
        <CardHeader className="pb-3 relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:rotate-3">
                <Car className="h-5 w-5 text-white" />
              </div>
              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 text-xs">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div>
                Ativo
              </Badge>
            </div>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Novos Carros
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
              Cadastrar e publicar veículos
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-2 pb-4 flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Car className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Plus className="h-2 w-2 text-white" />
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">+</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Adicionar veículo</div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <ImagePlus className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-600 dark:text-gray-400">Com imagens</span>
              </div>
              
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2">
          <div className="w-full text-center">
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors duration-300">
              Cadastrar novo veículo
            </Badge>
          </div>
        </CardFooter>
      </Card>

      <NewCarFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>;
};
export default NewCarsCard;