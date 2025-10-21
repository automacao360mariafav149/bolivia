import React, { useState } from 'react';
import { Car, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface AddVehicleDialogProps {
  onVehicleAdded: () => void;
}
const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  onVehicleAdded
}) => {
  const {
    toast
  } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    preco: '',
    Km: '',
    drive_id: '',
    id_unico: ''
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async () => {
    if (!formData.marca || !formData.modelo) {
      toast({
        title: "Campos obrigatórios",
        description: "Marca e modelo são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log('Tentando inserir veículo:', formData);

      // Insert directly into Supabase table
      const {
        data,
        error
      } = await supabase.from('estoque').insert([formData]).select();
      if (error) {
        console.error('Erro do Supabase:', error);
        throw new Error(`Erro ao adicionar veículo: ${error.message}`);
      }
      console.log('Veículo adicionado com sucesso:', data);
      toast({
        title: "Veículo adicionado",
        description: "O veículo foi adicionado com sucesso ao estoque!"
      });

      // Reset form
      setFormData({
        marca: '',
        modelo: '',
        ano: '',
        cor: '',
        preco: '',
        Km: '',
        drive_id: '',
        id_unico: ''
      });
      setIsOpen(false);
      onVehicleAdded();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Erro ao adicionar veículo",
        description: error instanceof Error ? error.message : "Não foi possível adicionar o veículo ao estoque.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Adicionar Novo Veículo
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do veículo para adicionar ao estoque.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marca">Marca *</Label>
              <Input id="marca" value={formData.marca} onChange={e => handleInputChange('marca', e.target.value)} placeholder="Ex: Toyota" />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo *</Label>
              <Input id="modelo" value={formData.modelo} onChange={e => handleInputChange('modelo', e.target.value)} placeholder="Ex: Corolla" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Input id="ano" value={formData.ano} onChange={e => handleInputChange('ano', e.target.value)} placeholder="Ex: 2020" />
            </div>
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input id="cor" value={formData.cor} onChange={e => handleInputChange('cor', e.target.value)} placeholder="Ex: Prata" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input id="preco" value={formData.preco} onChange={e => handleInputChange('preco', e.target.value)} placeholder="Ex: R$ 50.000" />
            </div>
            <div>
              <Label htmlFor="Km">Quilometragem</Label>
              <Input id="Km" value={formData.Km} onChange={e => handleInputChange('Km', e.target.value)} placeholder="Ex: 50000" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="drive_id">ID do Google Drive</Label>
            <Input id="drive_id" value={formData.drive_id} onChange={e => handleInputChange('drive_id', e.target.value)} placeholder="ID da pasta com fotos do veículo" />
          </div>
          
          <div>
            <Label htmlFor="id_unico">ID Único</Label>
            <Input id="id_unico" value={formData.id_unico} onChange={e => handleInputChange('id_unico', e.target.value)} placeholder="Identificador único do veículo" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adicionando...
              </> : <>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default AddVehicleDialog;