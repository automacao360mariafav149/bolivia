import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import { Contact } from '@/types/client';

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newContact: Partial<Contact>;
  setNewContact: (contact: Partial<Contact>) => void;
  handleAddContact: () => void;
}

const AddClientDialog = ({
  isOpen,
  onOpenChange,
  newContact,
  setNewContact,
  handleAddContact,
}: AddClientDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações para adicionar um novo cliente ao seu CRM.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Campos de Identificação */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground border-b pb-2">Identificação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome*</Label>
                <Input
                  id="name"
                  value={newContact.name || ''}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Telefone*</Label>
                <Input
                  id="phone"
                  value={newContact.phone || ''}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email || ''}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpf" className="text-right">CPF</Label>
                <Input
                  id="cpf"
                  value={newContact.cpf || ''}
                  onChange={(e) => setNewContact({...newContact, cpf: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpfCnpj" className="text-right">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  value={newContact.cpfCnpj || ''}
                  onChange={(e) => setNewContact({...newContact, cpfCnpj: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nascimento" className="text-right">Nascimento</Label>
                <Input
                  id="nascimento"
                  type="date"
                  value={newContact.nascimento || ''}
                  onChange={(e) => setNewContact({...newContact, nascimento: e.target.value})}
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
                <Label htmlFor="modelo" className="text-right">Modelo</Label>
                <Input
                  id="modelo"
                  value={newContact.modelo || ''}
                  onChange={(e) => setNewContact({...newContact, modelo: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cor" className="text-right">Cor</Label>
                <Input
                  id="cor"
                  value={newContact.cor || ''}
                  onChange={(e) => setNewContact({...newContact, cor: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preco" className="text-right">Preço</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={newContact.preco || ''}
                  onChange={(e) => setNewContact({...newContact, preco: e.target.value})}
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
                <Label htmlFor="data_agendamento" className="text-right">Data Agendamento</Label>
                <Input
                  id="data_agendamento"
                  type="datetime-local"
                  value={newContact.data_agendamento || ''}
                  onChange={(e) => setNewContact({...newContact, data_agendamento: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="funcionario" className="text-right">Funcionário</Label>
                <Input
                  id="funcionario"
                  value={newContact.funcionario || ''}
                  onChange={(e) => setNewContact({...newContact, funcionario: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmação" className="text-right">Confirmação</Label>
                <Input
                  id="confirmação"
                  value={newContact.confirmação || ''}
                  onChange={(e) => setNewContact({...newContact, confirmação: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Input
                  id="status"
                  value={newContact.status || 'Active'}
                  onChange={(e) => setNewContact({...newContact, status: e.target.value})}
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
          <Button type="submit" onClick={handleAddContact}>Adicionar Cliente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;