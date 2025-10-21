
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppointmentType } from '@/services/calendarApi';

interface AppointmentsHeaderProps {
  appointmentType: AppointmentType;
  onAddEvent: () => void;
}

export function AppointmentsHeader({ appointmentType, onAddEvent }: AppointmentsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
          {appointmentType === 'Funcionario02' ? 'Agenda Funcionário 02' : 'Agenda Funcionário 01'}
        </h1>
        <p className="text-blue-700 dark:text-blue-300">
          Gerencie os agendamentos do {appointmentType === 'Funcionario02' ? 'Funcionário 02' : 'Funcionário 01'}
        </p>
      </div>
      <Button 
        onClick={onAddEvent} 
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        <Plus className="h-4 w-4" />
        Novo Agendamento
      </Button>
    </div>
  );
}
