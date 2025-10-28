import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, Loader2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DriveGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  driveId: string;
  vehicleInfo?: string;
}

const DriveGallery: React.FC<DriveGalleryProps> = ({
  isOpen,
  onClose,
  driveId,
  vehicleInfo
}) => {
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && driveId) {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  }, [isOpen, driveId]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
      } else {
        onClose();
      }
    }
  };

  // Lista de filenames das imagens para exibição em grade grande
  const imageFiles = [
    '1_110730.jpg', '2_110730.jpg', '3_110730.jpg', '4_110730.jpg',
    '5_110730.jpg', '7_110730.jpg', '10_110730.jpg', '11_110730.jpg',
    '13_110730.jpg', '14_110730.jpg', '15_110730.jpg'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[98vw] w-full h-[98vh] p-0 overflow-hidden bg-black"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/90 to-transparent">
          <DialogDescription className="sr-only">
            Galeria de imagens do veículo exibida via Google Drive
          </DialogDescription>
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            <span>{vehicleInfo || 'Galeria do Veículo'}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <ZoomIn className="h-5 w-5 mr-1" /> : <Maximize2 className="h-5 w-5 mr-1" />}
                {isFullscreen ? 'Tela Normal' : 'Tela Cheia'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-full flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
              <p className="text-white text-sm">Carregando galeria...</p>
            </div>
          ) : (
            <div className="relative w-full h-full bg-gray-900">
              <iframe
                src={`https://drive.google.com/embeddedfolderview?id=${driveId}#grid`}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                title="Galeria de Mídia"
                style={{
                  colorScheme: 'dark'
                }}
              />
              
              {/* Instruções */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full text-sm backdrop-blur-md border border-white/20 shadow-lg">
                <p className="flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" />
                  Clique nas fotos para visualizar em tela cheia • Pressione ESC para fechar
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriveGallery;