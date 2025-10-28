import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useVehicleStock } from '@/hooks/useVehicleStock';
import { useEmployees } from '@/hooks/useEmployees';
import { Search, Car, Calendar, Palette, DollarSign } from 'lucide-react';

interface CarPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VehicleStock {
  id: number;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  preco: string;
  Km: string;
  drive_id: string;
  postagem: string;
  tipo_midia: string;
  status: string;
  data_cadastro: string;
  data_venda: string;
}

export function CarPostDialog({ open, onOpenChange }: CarPostDialogProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleStock | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [postType, setPostType] = useState('');
  const [seller, setSeller] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { vehicles, loading: vehiclesLoading } = useVehicleStock();
  const { employees, loading: employeesLoading } = useEmployees();

  const filteredVehicles = vehicles.filter(vehicle =>
    `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} ${vehicle.cor}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const files = Array.from(formData.getAll('arquivos') as File[]).filter(file => file.size > 0);

    // Validação
    if (!selectedVehicle) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um veículo.",
        variant: "destructive",
      });
      return;
    }

    if (!postType) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o tipo de postagem.",
        variant: "destructive",
      });
      return;
    }

    if (!seller) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um vendedor.",
        variant: "destructive",
      });
      return;
    }

    // Validar tipos de arquivo (se houver arquivos)
    if (files.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type.toLowerCase()));
      if (invalidFiles.length > 0) {
        toast({
          title: "Erro",
          description: `Tipos de arquivo não permitidos: ${invalidFiles.map(f => f.name).join(', ')}`,
          variant: "destructive",
        });
        return;
      }

    }

    try {
      setIsSubmitting(true);

      const webhookFormData = new FormData();

      // Criar array de informações dos arquivos
      const arquivosInfo = [];
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const categoria = file.type.startsWith('video/') ? 'video' : 'imagem';
          const tipoArquivo = file.type.split('/')[1].toUpperCase();
          
          arquivosInfo.push({
            index: i,
            nome: file.name,
            tipo: tipoArquivo,
            categoria: categoria,
            tamanho: file.size
          });
        }
      }

      // Adicionar dados do veículo e configurações
      webhookFormData.append('veiculoId', selectedVehicle.id.toString());
      webhookFormData.append('marca', selectedVehicle.marca);
      webhookFormData.append('modelo', selectedVehicle.modelo);
      webhookFormData.append('ano', selectedVehicle.ano);
      webhookFormData.append('cor', selectedVehicle.cor);
      webhookFormData.append('preco', selectedVehicle.preco);
      webhookFormData.append('km', selectedVehicle.Km);
      webhookFormData.append('postagem', selectedVehicle.postagem || '');
      webhookFormData.append('tipo_midia', selectedVehicle.tipo_midia || '');
      webhookFormData.append('tipoPostagem', postType);
      webhookFormData.append('vendedor', seller);
      webhookFormData.append('arquivosInfo', JSON.stringify(arquivosInfo));
      webhookFormData.append('modo', 'postagem_estoque');

      // Adicionar arquivos ao FormData
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          webhookFormData.append(`arquivo_${i}`, files[i]);
        }
      }

      const response = await fetch('https://n8n_mcp.automacaodigital360.com/webhook/postagem', {
        method: 'POST',
        body: webhookFormData,
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Postagem criada com sucesso.",
        });
        
        // Reset form
        setSelectedVehicle(null);
        setSearchTerm('');
        setPostType('');
        setSeller('');
        const form = event.currentTarget;
        form.reset();
        onOpenChange(false);
      } else {
        throw new Error('Erro na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro ao enviar postagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar postagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Opcional: adicionar validação ou feedback aqui
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Postagem de Carros
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Busca de veículo */}
          <div className="space-y-3">
            <Label htmlFor="busca" className="text-base font-semibold">Selecionar Veículo do Estoque</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="busca"
                placeholder="Buscar por marca, modelo, ano ou cor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchTerm && (
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {vehiclesLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Carregando...</div>
                ) : filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setSearchTerm('');
                      }}
                      className="w-full p-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                    >
                      <div className="font-medium">{vehicle.marca} {vehicle.modelo}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.ano} • {vehicle.cor} • R$ {vehicle.preco}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">Nenhum veículo encontrado</div>
                )}
              </div>
            )}

            {selectedVehicle && (
              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg">{selectedVehicle.marca} {selectedVehicle.modelo}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Marca:</span> {selectedVehicle.marca}</div>
                        <div><span className="font-medium">Modelo:</span> {selectedVehicle.modelo}</div>
                        <div><span className="font-medium">Ano:</span> {selectedVehicle.ano}</div>
                        <div><span className="font-medium">Cor:</span> {selectedVehicle.cor}</div>
                        <div><span className="font-medium">Preço:</span> R$ {selectedVehicle.preco}</div>
                        <div><span className="font-medium">KM:</span> {selectedVehicle.Km}</div>
                        {selectedVehicle.postagem && (
                          <div className="col-span-2"><span className="font-medium">Postagem:</span> {selectedVehicle.postagem}</div>
                        )}
                        {selectedVehicle.tipo_midia && (
                          <div className="col-span-2"><span className="font-medium">Tipo Mídia:</span> {selectedVehicle.tipo_midia}</div>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary">ID: {selectedVehicle.id}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tipo de postagem */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tipo de Postagem</Label>
            <RadioGroup value={postType} onValueChange={setPostType}>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Stories" id="stories" disabled />
                <Label htmlFor="stories">Em Desenvolvimento - Stories</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Reels" id="reels" disabled />
                <Label htmlFor="reels">Em Desenvolvimento - Reels</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Feed" id="feed" disabled />
                <Label htmlFor="feed">Em Desenvolvimento - Feed</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Carrossel" id="carrossel" disabled />
                <Label htmlFor="carrossel">Em Desenvolvimento - Carrossel</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Upload de arquivos - Opcional */}
          <div className="space-y-2">
            <Label htmlFor="arquivos" className="text-base font-semibold">Imagens/Vídeos (opcional)</Label>
            <Input 
              id="arquivos" 
              name="arquivos" 
              type="file" 
              multiple 
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            <p className="text-xs text-muted-foreground">
              Aceita imagens e vídeos. Sem limite de tamanho. Campo opcional.
            </p>
          </div>

          {/* Vendedor */}
          <div className="space-y-2">
            <Label htmlFor="vendedor" className="text-base font-semibold">Vendedor</Label>
            <Select value={seller} onValueChange={setSeller} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um vendedor" />
              </SelectTrigger>
              <SelectContent>
                {employeesLoading ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : (
                  employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.nome}>
                      {employee.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedVehicle || !postType || !seller || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Enviando...' : 'Criar Postagem'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}