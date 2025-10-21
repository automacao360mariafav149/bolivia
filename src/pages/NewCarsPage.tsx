import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Plus, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import NewCarFormDialog from '@/components/dashboard/NewCarFormDialog';

const NewCarsPage = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
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
            <Car className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">Novos Carros</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              Alvorada Veículos
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Cadastrar Novos Veículos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione novos veículos ao seu estoque com informações completas e imagens
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="h-[400px] cursor-pointer group glass-card border-0 bg-gradient-to-br from-white/80 via-emerald-50/80 to-teal-50/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-600/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu rounded-3xl" 
            onClick={() => setDialogOpen(true)}
          >
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
                  Adicionar Veículo
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

          <Card className="h-[400px] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Veículos Recentes</CardTitle>
              <CardDescription>Últimos veículos cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum veículo cadastrado ainda</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-[400px] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Estatísticas</CardTitle>
              <CardDescription>Resumo dos cadastros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total de veículos:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Este mês:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Com imagens:</span>
                <Badge variant="secondary">0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <NewCarFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default NewCarsPage;
