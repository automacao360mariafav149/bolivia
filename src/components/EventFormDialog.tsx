import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, Car } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';
import { EventFormData, CalendarEvent } from '@/types/calendar';
import { supabase } from '@/integrations/supabase/client';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: EventFormData) => void;
  isSubmitting: boolean;
  event?: CalendarEvent;
  title: string;
  description: string;
  submitLabel: string;
}

export function EventFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  event,
  title,
  description,
  submitLabel
}: EventFormDialogProps) {
  const initialFormState: EventFormData = {
    summary: '',
    description: '',
    email: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    clientId: null,
    clientName: null,
    vehicleId: null,
    vehicleInfo: null,
  };

  const [formData, setFormData] = useState<EventFormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<{ value: string; label: string }[]>([]);
  const [vehicles, setVehicles] = useState<{ value: string; label: string }[]>([]);
  const [clientsData, setClientsData] = useState<Map<string, { email: string }>>(new Map());
  const [vehiclesData, setVehiclesData] = useState<Map<string, { marca: string; modelo: string }>>(new Map());
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // Buscar clientes e veículos quando o dialog abrir
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const { data, error } = await supabase
          .from('dados_cliente')
          .select('id, nome, email, telefone')
          .order('nome');

        if (error) throw error;

        const clientOptions = (data || []).map(client => ({
          value: client.id.toString(),
          label: `${client.nome || 'Sem nome'}${client.telefone ? ` - ${client.telefone}` : ''}`
        }));

        const clientsMap = new Map();
        (data || []).forEach(client => {
          clientsMap.set(client.id.toString(), { email: client.email || '' });
        });

        setClients(clientOptions);
        setClientsData(clientsMap);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const { data, error } = await supabase
          .from('estoque')
          .select('id, marca, modelo, ano, cor')
          .order('marca');

        if (error) throw error;

        const vehicleOptions = (data || []).map(vehicle => ({
          value: vehicle.id.toString(),
          label: `${vehicle.marca} ${vehicle.modelo || ''} ${vehicle.ano || ''} ${vehicle.cor ? `- ${vehicle.cor}` : ''}`.trim()
        }));

        const vehiclesMap = new Map();
        (data || []).forEach(vehicle => {
          vehiclesMap.set(vehicle.id.toString(), { marca: vehicle.marca, modelo: vehicle.modelo || '' });
        });

        setVehicles(vehicleOptions);
        setVehiclesData(vehiclesMap);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      } finally {
        setLoadingVehicles(false);
      }
    };

    if (open) {
      fetchClients();
      fetchVehicles();
    }
  }, [open]);

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      setFormData({
        summary: event.summary || '',
        description: event.description || '',
        email: event.attendees?.find(a => a !== null && a.email)?.email || '',
        date: startDate,
        startTime: format(startDate, 'HH:mm'),
        endTime: format(endDate, 'HH:mm'),
        clientId: null,
        clientName: null,
        vehicleId: null,
        vehicleInfo: null,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [event, open]);

  // Preencher título automaticamente quando digitar o veículo manualmente
  useEffect(() => {
    if (!formData.vehicleId && formData.vehicleInfo && formData.vehicleInfo.trim()) {
      // Só atualiza o título se estiver vazio
      if (!formData.summary || formData.summary.trim() === '') {
        setFormData(prev => ({ ...prev, summary: formData.vehicleInfo || '' }));
      }
    }
  }, [formData.vehicleInfo, formData.vehicleId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'O título é obrigatório';
    }
    
    // Email é opcional se um cliente for selecionado ou se um nome for digitado
    if (!formData.clientId && !formData.clientName && !formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório quando nenhum cliente é informado';
    } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Digite um e-mail válido';
    }
    
    if (!formData.date) {
      newErrors.date = 'A data é obrigatória';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'A hora de início é obrigatória';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'A hora de término é obrigatória';
    } else if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'A hora de término deve ser posterior à hora de início';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (validateForm()) {
      console.log('Form is valid, calling onSubmit');
      onSubmit(formData);
    } else {
      console.log('Form validation failed:', errors);
    }
  };

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClientChange = (clientId: string | null) => {
    if (clientId) {
      const client = clients.find(c => c.value === clientId);
      handleChange('clientId', clientId);
      handleChange('clientName', client?.label || null);
      
      // Preencher email automaticamente se o cliente tiver email
      const clientData = clientsData.get(clientId);
      if (clientData?.email) {
        handleChange('email', clientData.email);
      }
    } else {
      handleChange('clientId', null);
      handleChange('clientName', '');
      // Não limpar email ao desselecionar - permitir digitação manual
    }
  };

  const handleVehicleChange = (vehicleId: string | null) => {
    if (vehicleId) {
      const vehicle = vehicles.find(v => v.value === vehicleId);
      handleChange('vehicleId', vehicleId);
      handleChange('vehicleInfo', vehicle?.label || null);
      
      // Preencher título automaticamente com o veículo
      const vehicleData = vehiclesData.get(vehicleId);
      if (vehicleData) {
        const vehicleTitle = `${vehicleData.marca} ${vehicleData.modelo || ''}`.trim();
        handleChange('summary', vehicleTitle);
      }
    } else {
      handleChange('vehicleId', null);
      handleChange('vehicleInfo', '');
      // Não limpar título ao desselecionar - permitir digitação manual
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="client" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente (opcional)
            </Label>
            <Combobox
              options={clients}
              value={formData.clientId || undefined}
              onChange={handleClientChange}
              placeholder={loadingClients ? "Carregando..." : "Selecione um cliente da lista"}
              searchPlaceholder="Buscar cliente..."
              emptyText="Nenhum cliente encontrado."
              allowClear={true}
            />
            {!formData.clientId && (
              <div className="space-y-2">
                <Label htmlFor="manualClientName" className="text-sm">
                  Ou digite o nome do cliente
                </Label>
                <Input
                  id="manualClientName"
                  value={formData.clientName || ''}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  placeholder="Digite o nome do cliente..."
                  className="w-full"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Selecione um cliente da lista ou digite manualmente.
            </p>
          </div>

          {/* Veículo */}
          <div className="space-y-2">
            <Label htmlFor="vehicle" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Veículo (opcional)
            </Label>
            <Combobox
              options={vehicles}
              value={formData.vehicleId || undefined}
              onChange={handleVehicleChange}
              placeholder={loadingVehicles ? "Carregando..." : "Selecione um veículo da lista"}
              searchPlaceholder="Buscar veículo..."
              emptyText="Nenhum veículo encontrado."
              allowClear={true}
            />
            {!formData.vehicleId && (
              <div className="space-y-2">
                <Label htmlFor="manualVehicleInfo" className="text-sm">
                  Ou digite os dados do veículo
                </Label>
                <Input
                  id="manualVehicleInfo"
                  value={formData.vehicleInfo || ''}
                  onChange={(e) => handleChange('vehicleInfo', e.target.value)}
                  placeholder="Ex: Toyota Corolla 2020"
                  className="w-full"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Selecione um veículo da lista ou digite manualmente.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Título <span className="text-destructive">*</span></Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder=""
              className={errors.summary ? "border-destructive" : ""}
            />
            {errors.summary && <p className="text-sm text-destructive">{errors.summary}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detalhes do atendimento..."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">
              E-mail do cliente {!formData.clientId && !formData.clientName && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="cliente@exemplo.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            {(formData.clientId || formData.clientName) && (
              <p className="text-xs text-muted-foreground">
                Opcional quando um cliente é informado
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Data <span className="text-destructive">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                    errors.date && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "dd/MM/yyyy") : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleChange('date', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora início <span className="text-destructive">*</span></Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className={errors.startTime ? "border-destructive" : ""}
                />
              </div>
              {errors.startTime && <p className="text-sm text-destructive">{errors.startTime}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora fim <span className="text-destructive">*</span></Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className={errors.endTime ? "border-destructive" : ""}
                />
              </div>
              {errors.endTime && <p className="text-sm text-destructive">{errors.endTime}</p>}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}