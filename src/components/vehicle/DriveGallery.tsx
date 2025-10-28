import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (currentIndex !== null) {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    }
    if (e.key === 'Escape') {
      if (currentIndex !== null) {
        setCurrentIndex(null);
      } else {
        onClose();
      }
    }
  };

  const handlePrevious = () => {
    // Será implementado com os IDs das imagens
  };

  const handleNext = () => {
    // Será implementado com os IDs das imagens
  };

  const openFullImage = (index: number) => {
    setCurrentIndex(index);
  };

  const closeFullImage = () => {
    setCurrentIndex(null);
  };

  // URLs que serão construídas com os IDs dos arquivos da pasta
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && driveId) {
      // Por enquanto, vamos usar o iframe mas com melhor integração
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }
  }, [isOpen, driveId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[98vw] w-full h-[98vh] p-0 overflow-hidden bg-black"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/90 to-transparent">
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            <span>{vehicleInfo || 'Galeria do Veículo'}</span>
            {currentIndex !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={closeFullImage}
                className="text-white hover:bg-white/20"
              >
                ← Voltar para grade
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-full flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
              <p className="text-white text-sm">Carregando galeria...</p>
            </div>
          ) : currentIndex === null ? (
            // MODO GRADE - Iframe do Google Drive
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
              {/* Instrução flutuante */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full text-sm backdrop-blur-md border border-white/20 shadow-lg">
                <p className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Clique nas fotos/vídeos para visualizar em tela cheia
                </p>
              </div>
            </div>
          ) : (
            // MODO VISUALIZAÇÃO AMPLIADA (será implementado quando tivermos os URLs)
            <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-white text-center">
                <p>Visualização ampliada será implementada</p>
                <p className="text-sm text-gray-400 mt-2">Ao implementar, aqui aparecerá a imagem em tela cheia</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriveGallery;