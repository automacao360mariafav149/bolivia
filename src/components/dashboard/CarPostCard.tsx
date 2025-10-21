import { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, ImagePlus, Megaphone } from 'lucide-react';
import { CarPostDialog } from './CarPostDialog';

export function CarPostCard() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Postagem de carros</h3>
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

      <CarPostDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}