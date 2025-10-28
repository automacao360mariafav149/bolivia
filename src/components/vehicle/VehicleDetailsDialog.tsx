import React, { useState } from 'react';
import { Edit, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  km: string;  // Campo em minúsculo conforme o banco
  preco: string;
  descricao: string;
  drive_id: string;
  id_unico: string;
  status?: string;
  data_cadastro?: string;
  data_venda?: string;
}

interface VehicleDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onVehicleUpdated: () => void;
  onVehicleDeleted: () => void;
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
  isOpen,
  onClose,
  vehicle,
  onVehicleUpdated,
  onVehicleDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const { toast } = useToast();

  React.useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
      setIsEditing(false);
    }
  }, [vehicle]);

  const handleSave = async () => {
    if (!vehicle) return;

    // Validar que marca não está vazia (campo obrigatório)
    if (!formData.marca || formData.marca.trim() === '') {
      toast({
        title: 'Campo obrigatório',
        description: 'A marca é obrigatória.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Verificar permissões do usuário atual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', userData?.user?.id);
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData?.user?.id);
      
      console.log('User role:', roleData);
      console.log('Role error:', roleError);
      
      // Preparar dados para atualização
      const updateData: any = {
        marca: formData.marca || vehicle.marca,
        modelo: formData.modelo ?? null,
        ano: formData.ano ?? null,
        cor: formData.cor ?? null,
        preco: formData.preco ?? null,
        descricao: formData.descricao ?? null,
        drive_id: formData.drive_id ?? null,
        id_unico: formData.id_unico ?? null,
      };
      
      // Adicionar km (minúsculo conforme o banco)
      if (formData.km !== undefined && formData.km !== vehicle.km) {
        updateData.km = formData.km;
      }
      
      console.log('Updating with data:', updateData);
      console.log('Vehicle ID:', vehicle.id);
      console.log('Current user permissions:', { user: userData?.user?.id, role: roleData });

      const { error, data } = await supabase
        .from('estoque')
        .update(updateData)
        .eq('id', vehicle.id)
        .select();

      if (error) {
        console.error('Update error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw error;
      }

      console.log('Update successful:', data);

      toast({
        title: 'Veículo atualizado',
        description: 'As informações do veículo foram atualizadas com sucesso.',
      });

      setIsEditing(false);
      onVehicleUpdated();
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o veículo.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicle) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', vehicle.id);

      if (error) throw error;

      toast({
        title: 'Veículo removido',
        description: 'O veículo foi removido do estoque com sucesso.',
      });

      setShowDeleteDialog(false);
      onClose();
      onVehicleDeleted();
    } catch (error) {
      console.error('Erro ao deletar veículo:', error);
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover o veículo.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (field: keyof Vehicle, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!vehicle) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {formData.marca} {formData.modelo} {formData.ano}
              </span>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Deletar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(vehicle);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </>
                )}
              </div>
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Edite as informações do veículo abaixo'
                : 'Visualize e gerencie as informações do veículo'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Input
                    id="marca"
                    value={formData.marca || ''}
                    onChange={(e) => handleChange('marca', e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input
                    id="modelo"
                    value={formData.modelo || ''}
                    onChange={(e) => handleChange('modelo', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ano">Ano</Label>
                  <Input
                    id="ano"
                    value={formData.ano || ''}
                    onChange={(e) => handleChange('ano', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    value={formData.cor || ''}
                    onChange={(e) => handleChange('cor', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="km">Quilometragem</Label>
                  <Input
                    id="km"
                    value={formData.km || ''}
                    onChange={(e) => handleChange('km', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Ex: 50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço</Label>
                  <Input
                    id="preco"
                    value={formData.preco || ''}
                    onChange={(e) => handleChange('preco', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Ex: 45000.00"
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao || ''}
                onChange={(e) => handleChange('descricao', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="Descrição detalhada do veículo..."
              />
            </div>

            {/* IDs e Referências */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">
                IDs e Referências
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="drive_id">Google Drive ID</Label>
                  <Input
                    id="drive_id"
                    value={formData.drive_id || ''}
                    onChange={(e) => handleChange('drive_id', e.target.value)}
                    disabled={!isEditing}
                    placeholder="ID da pasta ou IDs separados por vírgula"
                  />
                  <p className="text-xs text-muted-foreground">
                    Para múltiplas imagens, separe os IDs por vírgula
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_unico">ID Único</Label>
                  <Input
                    id="id_unico"
                    value={formData.id_unico || ''}
                    onChange={(e) => handleChange('id_unico', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Informações do Sistema
              </h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">ID:</span> {vehicle.id}
                </p>
                {vehicle.status && (
                  <p>
                    <span className="font-medium">Status:</span> {vehicle.status}
                  </p>
                )}
                {vehicle.data_cadastro && (
                  <p>
                    <span className="font-medium">Data Cadastro:</span>{' '}
                    {new Date(vehicle.data_cadastro).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {vehicle.data_venda && (
                  <p>
                    <span className="font-medium">Data Venda:</span>{' '}
                    {new Date(vehicle.data_venda).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O veículo{' '}
              <strong>
                {vehicle.marca} {vehicle.modelo} {vehicle.ano}
              </strong>{' '}
              será permanentemente removido do estoque.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Removendo...' : 'Sim, remover veículo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VehicleDetailsDialog;

