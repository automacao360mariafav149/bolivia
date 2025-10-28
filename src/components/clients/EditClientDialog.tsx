import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Contact } from '@/types/client';

interface EditClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContact: Contact | null;
  editContactData: Partial<Contact>;
  setEditContactData: (contact: Partial<Contact>) => void;
  handleEditContact: () => void;
}

const EditClientDialog = ({
  isOpen,
  onOpenChange,
  selectedContact,
  editContactData,
  setEditContactData,
  handleEditContact,
}: EditClientDialogProps) => {
  if (!selectedContact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações de {selectedContact.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Campos de Identificação */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">Identificação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Nome</Label>
                <Input
                  id="edit-name"
                  value={editContactData.name || ''}
                  onChange={(e) => setEditContactData({...editContactData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editContactData.phone || ''}
                  onChange={(e) => setEditContactData({...editContactData, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editContactData.email || ''}
                  onChange={(e) => setEditContactData({...editContactData, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cpf" className="text-right">CPF</Label>
                <Input
                  id="edit-cpf"
                  value={editContactData.cpf || ''}
                  onChange={(e) => setEditContactData({...editContactData, cpf: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cpfCnpj" className="text-right">CPF/CNPJ</Label>
                <Input
                  id="edit-cpfCnpj"
                  value={editContactData.cpfCnpj || ''}
                  onChange={(e) => setEditContactData({...editContactData, cpfCnpj: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nascimento" className="text-right">Nascimento</Label>
                <Input
                  id="edit-nascimento"
                  type="date"
                  value={editContactData.nascimento || ''}
                  onChange={(e) => setEditContactData({...editContactData, nascimento: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>

          {/* Dados do Veículo/Produto */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">Veículo/Produto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-modelo" className="text-right">Modelo</Label>
                <Input
                  id="edit-modelo"
                  value={editContactData.modelo || ''}
                  onChange={(e) => setEditContactData({...editContactData, modelo: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cor" className="text-right">Cor</Label>
                <Input
                  id="edit-cor"
                  value={editContactData.cor || ''}
                  onChange={(e) => setEditContactData({...editContactData, cor: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-preco" className="text-right">Preço</Label>
                <Input
                  id="edit-preco"
                  type="number"
                  step="0.01"
                  value={editContactData.preco || ''}
                  onChange={(e) => setEditContactData({...editContactData, preco: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>

          {/* Dados de Agendamento/Funcionário */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">Agendamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-data_agendamento" className="text-right">Data Agendamento</Label>
                <Input
                  id="edit-data_agendamento"
                  type="datetime-local"
                  value={editContactData.data_agendamento || ''}
                  onChange={(e) => setEditContactData({...editContactData, data_agendamento: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-funcionario" className="text-right">Funcionário</Label>
                <Input
                  id="edit-funcionario"
                  value={editContactData.funcionario || ''}
                  onChange={(e) => setEditContactData({...editContactData, funcionario: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-confirmação" className="text-right">Confirmação</Label>
                <Input
                  id="edit-confirmação"
                  value={editContactData.confirmação || ''}
                  onChange={(e) => setEditContactData({...editContactData, confirmação: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">Status</Label>
                <Input
                  id="edit-status"
                  value={editContactData.status || 'Active'}
                  onChange={(e) => setEditContactData({...editContactData, status: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleEditContact}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;