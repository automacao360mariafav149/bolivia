import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ImagePlus, Megaphone, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CarPostDialog } from '@/components/dashboard/CarPostDialog';

const CarPostPage = () => {
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
              onClick={() => navigate('/metrics')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Camera className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">Post de Carro</h1>
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
            Publicar Veículos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Selecione veículos do seu estoque e crie posts para redes sociais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="h-[400px] glass-card border-0 bg-gradient-to-br from-white/80 via-blue-50/80 to-cyan-50/80 dark:from-gray-900/80 dark:via-blue-950/80 dark:to-cyan-950/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu rounded-3xl group cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <Badge variant="secondary" className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  Estoque
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Criar Post</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Publicar veículos do estoque</p>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-3">
                  <Megaphone className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                  <ImagePlus className="h-12 w-12 text-cyan-500 dark:text-cyan-400" />
                </div>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Clique para criar uma postagem
                </p>
              </div>
            </CardContent>

            <CardFooter className="mt-auto">
              <Badge variant="outline" className="mx-auto px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-medium group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300">
                Selecionar • Configurar • Publicar
              </Badge>
            </CardFooter>
          </Card>

          <Card className="h-[400px] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Posts Recentes</CardTitle>
              <CardDescription>Últimas publicações criadas</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum post criado ainda</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-[400px] border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Veículos Disponíveis</CardTitle>
              <CardDescription>Do seu estoque</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total no estoque:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Disponíveis:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Com fotos:</span>
                <Badge variant="secondary">0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Templates de Post
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h4 className="font-medium">Foto Simples</h4>
                <p className="text-sm text-gray-500">Apenas imagem do veículo</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <Megaphone className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h4 className="font-medium">Promocional</h4>
                <p className="text-sm text-gray-500">Com desconto e oferta</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <Car className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h4 className="font-medium">Detalhado</h4>
                <p className="text-sm text-gray-500">Com especificações</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <ImagePlus className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <h4 className="font-medium">Galeria</h4>
                <p className="text-sm text-gray-500">Múltiplas fotos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <CarPostDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default CarPostPage;
