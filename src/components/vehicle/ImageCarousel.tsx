import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, ExternalLink } from 'lucide-react';
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
  isFolder?: boolean; // Novo: indica se o ID é de uma pasta
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  isOpen,
  onClose,
  driveId,
  vehicleInfo,
  isFolder = false // Por padrão, assume que são IDs individuais
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para extrair IDs de imagens da pasta do Google Drive
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

      // Verificar se contém vírgulas (múltiplos IDs de arquivos)
      if (folderId.includes(',')) {
        // Processar como IDs individuais de arquivos separados por vírgula
        const imageIds = folderId.split(',').map(id => id.trim()).filter(id => id);

        console.log('Múltiplos IDs detectados:', imageIds);

        if (imageIds.length === 0) {
          setError('Nenhuma imagem encontrada');
          setLoading(false);
          return;
        }

        // Converter IDs do Drive em URLs de visualização direta
        const validImageUrls = imageIds.map(id =>
          `https://drive.google.com/uc?export=view&id=${id}`
        );

        console.log('URLs geradas:', validImageUrls);

        setImages(validImageUrls);
        setCurrentIndex(0);
      } else {
        // É um ID único, provavelmente uma pasta
        // Vamos criar URLs usando diferentes métodos do Google Drive
        console.log('ID único detectado (provavelmente pasta):', folderId);

        // Tentar diferentes formatos de URL
        const possibleUrls = [
          `https://drive.google.com/uc?export=view&id=${folderId}`,
          `https://drive.google.com/thumbnail?id=${folderId}&sz=w1000`,
          `https://lh3.googleusercontent.com/d/${folderId}`,
        ];

        // Testar se é um arquivo individual que funciona
        setImages(possibleUrls);
        setCurrentIndex(0);

        // Se for pasta, mostrar mensagem especial
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
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="p-6 pb-4 bg-white dark:bg-gray-800">
          <DialogTitle className="text-xl font-bold">
            {vehicleInfo || 'Fotos do Veículo'}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 flex items-center justify-center bg-gray-900 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
              <p className="text-white text-sm">Carregando imagens...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-4 p-6 max-w-2xl mx-auto">
              <div className="text-red-400 text-center space-y-4">
                <p className="text-lg font-semibold mb-2">{error}</p>
                <div className="text-sm text-gray-300 text-left bg-gray-800 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Como configurar:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Cada imagem no Google Drive deve estar com compartilhamento público</li>
                    <li>Clique com o botão direito na imagem → "Compartilhar" → "Qualquer pessoa com o link"</li>
                    <li>O ID da imagem deve ser individual, não da pasta</li>
                    <li>Para múltiplas imagens, separe os IDs por vírgula no banco de dados</li>
                    <li>Exemplo: <code className="bg-gray-700 px-2 py-1 rounded">1abc123xyz,2def456uvw,3ghi789rst</code></li>
                  </ol>
                </div>
                <p className="text-xs text-gray-500">
                  Verifique o console do navegador (F12) para mais detalhes sobre os IDs e URLs
                </p>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-white text-center p-6">
              <p className="text-lg">Nenhuma imagem disponível</p>
            </div>
          ) : (
            <>
              {/* Imagem/Vídeo principal */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {images[currentIndex].includes('video') || images[currentIndex].match(/\.(mp4|webm|mov|avi)$/i) ? (
                  // Se for vídeo
                  <video
                    controls
                    autoPlay
                    className="max-w-full max-h-full"
                    onError={() => {
                      console.error('Erro ao carregar vídeo:', images[currentIndex]);
                    }}
                  >
                    <source src={images[currentIndex]} type="video/mp4" />
                    Seu navegador não suporta reprodução de vídeo.
                  </video>
                ) : (
                  // Se for imagem
                  <img
                    src={images[currentIndex]}
                    alt={`Foto ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', images[currentIndex]);
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                    }}
                    onLoad={() => {
                      console.log('Imagem carregada com sucesso:', images[currentIndex]);
                    }}
                  />
                )}
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
            </>
          )}
        </div>

        {/* Dicas de navegação */}
        {!loading && !error && images.length > 1 && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 text-center text-xs text-gray-600 dark:text-gray-400">
            Use as setas ← → do teclado ou clique nos botões para navegar
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarousel;
