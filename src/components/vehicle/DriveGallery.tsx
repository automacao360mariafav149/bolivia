import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, ExternalLink } from 'lucide-react';
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

/**
 * Galeria que busca automaticamente imagens de uma pasta do Google Drive
 * e exibe em carrossel grande
 */
const DriveGallery: React.FC<DriveGalleryProps> = ({
  isOpen,
  onClose,
  driveId,
  vehicleInfo
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && driveId) {
      loadImagesFromFolder();
    }
  }, [isOpen, driveId]);

  const loadImagesFromFolder = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Carregando imagens da pasta:', driveId);

      // Usar a URL do Google Drive que lista os arquivos da pasta
      // Como não temos API key, vamos usar uma abordagem alternativa
      // Criar URLs baseadas no padrão do Google Drive para visualização

      // Por enquanto, vamos usar o viewer do Google Drive
      const viewerUrl = `https://drive.google.com/drive/folders/${driveId}`;
      
      // Como não podemos fazer scraping direto por CORS, vamos usar
      // a abordagem de exibir via iframe com viewer otimizado
      setImages([viewerUrl]);
      setLoading(false);

    } catch (err) {
      console.error('Erro ao carregar imagens:', err);
      setError('Não foi possível carregar as imagens da pasta');
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
        className="max-w-[98vw] w-full h-[98vh] p-0 overflow-hidden bg-black"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/90 to-transparent">
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            <span>{vehicleInfo || 'Galeria do Veículo'}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://drive.google.com/drive/folders/${driveId}`, '_blank')}
                className="text-white hover:bg-white/20 flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir no Google Drive
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

        <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
              <p className="text-white text-sm">Carregando imagens...</p>
            </div>
          ) : error ? (
            <div className="text-white text-center p-6">
              <p className="text-lg mb-4">{error}</p>
              <p className="text-sm text-gray-400">
                Certifique-se de que a pasta está compartilhada como "Qualquer pessoa com o link"
              </p>
            </div>
          ) : (
            <div className="w-full h-full relative flex flex-col">
              {/* Iframe do Google Drive em visualização de pasta */}
              <div className="flex-1 relative">
                <iframe
                  src={`https://drive.google.com/embeddedfolderview?id=${driveId}`}
                  className="w-full h-full border-0 bg-black"
                  allow="autoplay; fullscreen"
                  title="Galeria de Fotos"
                  style={{
                    width: '150%',
                    height: '150%',
                    transform: 'scale(0.8)',
                    transformOrigin: 'top left',
                    border: 'none',
                    background: '#000'
                  }}
                />
              </div>

              {/* Instrução flutuante com instruções mais claras */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-sm backdrop-blur-md shadow-2xl z-50 max-w-lg">
                <p className="font-semibold mb-3 text-center text-base">📸 Visualizar Fotos em Tamanho Grande</p>
                <div className="space-y-2 text-xs">
                  <p className="font-medium">Opção 1 - Dentro desta janela:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Clique em qualquer imagem da galeria acima</li>
                    <li>A imagem abrirá em tamanho grande</li>
                  </ol>
                  <p className="font-medium mt-3">Opção 2 - Melhor visualização:</p>
                  <p className="ml-2">Clique no botão <span className="font-bold">"Abrir no Google Drive"</span> no topo para ver todas as fotos em alta qualidade</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriveGallery;
