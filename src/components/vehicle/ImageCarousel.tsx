import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { fetchImagesFromDriveFolder } from '@/services/googleDriveService';

interface ImageCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  driveId: string;
  vehicleInfo?: string;
  isFolder?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  isOpen,
  onClose,
  driveId,
  vehicleInfo,
  isFolder = false
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null); // null = modo grade
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && driveId) {
      fetchDriveImages(driveId);
    }
  }, [isOpen, driveId]);

  const fetchDriveImages = async (folderId: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Drive ID(s) recebido(s):', folderId);

      if (folderId.includes(',')) {
        const imageIds = folderId.split(',').map(id => id.trim()).filter(id => id);
        console.log('Múltiplos IDs detectados:', imageIds);

        if (imageIds.length === 0) {
          setError('Nenhuma imagem encontrada');
          setLoading(false);
          return;
        }

        const validImageUrls = imageIds.map(id =>
          `https://drive.google.com/uc?export=view&id=${id}`
        );

        console.log('URLs geradas:', validImageUrls);
        setImages(validImageUrls);
        setCurrentIndex(null); // Começa no modo grade
      } else {
        console.log('ID único detectado (provavelmente pasta):', folderId);
        const possibleUrls = [
          `https://drive.google.com/uc?export=view&id=${folderId}`,
          `https://drive.google.com/thumbnail?id=${folderId}&sz=w1000`,
          `https://lh3.googleusercontent.com/d/${folderId}`,
        ];
        setImages(possibleUrls);
        setCurrentIndex(null);
        console.warn('Se for uma pasta, por favor use IDs individuais das imagens separados por vírgula');
      }
    } catch (err) {
      console.error('Erro ao carregar imagens:', err);
      setError('Erro ao carregar as imagens do Drive');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev! - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev! + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (currentIndex !== null) {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    }
    if (e.key === 'Escape') {
      if (currentIndex !== null) {
        setCurrentIndex(null); // Volta para a grade
      } else {
        onClose(); // Fecha o modal
      }
    }
  };

  const openFullImage = (index: number) => {
    setCurrentIndex(index);
  };

  const closeFullImage = () => {
    setCurrentIndex(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-7xl w-full h-[95vh] p-0 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="p-6 pb-4 bg-white dark:bg-gray-800 border-b">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>{vehicleInfo || 'Fotos do Veículo'}</span>
            {currentIndex !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={closeFullImage}
                className="text-sm"
              >
                ← Voltar para grade
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Carregando imagens...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 max-w-2xl mx-auto">
              <div className="text-red-400 text-center space-y-4">
                <p className="text-lg font-semibold mb-2">{error}</p>
                <div className="text-sm text-gray-600 dark:text-gray-300 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Como configurar:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Cada imagem no Google Drive deve estar com compartilhamento público</li>
                    <li>Clique com o botão direito na imagem → "Compartilhar" → "Qualquer pessoa com o link"</li>
                    <li>O ID da imagem deve ser individual, não da pasta</li>
                    <li>Para múltiplas imagens, separe os IDs por vírgula no banco de dados</li>
                    <li>Exemplo: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">1abc123xyz,2def456uvw,3ghi789rst</code></li>
                  </ol>
                </div>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma imagem disponível</p>
            </div>
          ) : currentIndex === null ? (
            // MODO GRADE - Visualização de todas as miniaturas
            <div className="h-full overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square"
                    onClick={() => openFullImage(idx)}
                  >
                    <img
                      src={img}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagem indisponível%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    {/* Overlay com ícone de zoom ao passar o mouse */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Número da foto */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // MODO VISUALIZAÇÃO AMPLIADA
            <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
              {/* Imagem principal */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={images[currentIndex]}
                  alt={`Foto ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', images[currentIndex]);
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Botões de navegação */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Contador de imagens */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </div>

        {/* Dicas de navegação */}
        {!loading && !error && images.length > 0 && currentIndex === null && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center text-xs text-gray-600 dark:text-gray-400 border-t">
            Clique em uma foto para visualizar em tela cheia
          </div>
        )}
        {!loading && !error && images.length > 1 && currentIndex !== null && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center text-xs text-gray-600 dark:text-gray-400 border-t">
            Use as setas ← → do teclado ou clique nos botões para navegar • Pressione ESC para voltar à grade
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarousel;