
import React from 'react';
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { EventFormDialog } from '@/components/EventFormDialog';
import { DeleteEventDialog } from '@/components/DeleteEventDialog';

interface AppointmentDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  currentEvent: CalendarEvent | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  onSubmitEvent: (formData: EventFormData) => Promise<void>;
  onConfirmDelete: () => Promise<void>;
}

export function AppointmentDialogs({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  currentEvent,
  isSubmitting,
  isDeleting,
  onSubmitEvent,
  onConfirmDelete
}: AppointmentDialogsProps) {
  return (
    <>
      <EventFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onSubmitEvent}
        isSubmitting={isSubmitting}
        title="Novo Agendamento"
        description="Preencha os dados para criar um novo agendamento."
        submitLabel="Criar Agendamento"
      />

      <EventFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={onSubmitEvent}
        isSubmitting={isSubmitting}
        event={currentEvent}
        title="Editar Agendamento"
        description="Atualize os dados do agendamento."
        submitLabel="Atualizar Agendamento"
      />

      <DeleteEventDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={onConfirmDelete}
        event={currentEvent}
        isDeleting={isDeleting}
      />
    </>
  );
}
