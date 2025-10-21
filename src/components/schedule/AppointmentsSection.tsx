
import React, { useState } from 'react';
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { AppointmentType } from '@/services/calendarApi';
import { EventsCard } from './EventsCard';
import { AppointmentsHeader } from './AppointmentsHeader';
import { AppointmentDialogs } from './AppointmentDialogs';
import { useAppointmentManagement } from '@/hooks/useAppointmentManagement';

interface AppointmentsSectionProps {
  appointmentType: AppointmentType;
  selectedDate?: Date;
}

export default function AppointmentsSection({ appointmentType, selectedDate }: AppointmentsSectionProps) {
  const {
    events,
    filteredEvents,
    currentSelectedDate,
    selectedTab,
    searchTerm,
    isLoading,
    error,
    lastUpdated,
    setSearchTerm,
    setSelectedTab,
    handleSubmitEvent,
    handleDeleteEvent,
  } = useAppointmentManagement(appointmentType, selectedDate);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddEvent = () => {
    console.log('Opening add event dialog');
    setCurrentEvent(null);
    setIsAddDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    console.log('Opening edit event dialog for:', event);
    setCurrentEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleDeleteEventClick = (event: CalendarEvent) => {
    console.log('Opening delete event dialog for:', event);
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenEventLink = (url: string) => {
    window.open(url, '_blank');
  };

  const onSubmitEvent = async (formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      await handleSubmitEvent(formData, currentEvent);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!currentEvent) return;
    
    setIsDeleting(true);
    try {
      await handleDeleteEvent(currentEvent.id);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/50">
      <div className="max-w-6xl mx-auto space-y-6">
        <AppointmentsHeader 
          appointmentType={appointmentType}
          onAddEvent={handleAddEvent}
        />

        <EventsCard
          events={events}
          filteredEvents={filteredEvents}
          selectedTab={selectedTab}
          searchTerm={searchTerm}
          selectedDate={currentSelectedDate}
          isLoading={isLoading}
          error={error}
          lastUpdated={lastUpdated}
          onSearchChange={setSearchTerm}
          onTabChange={setSelectedTab}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEventClick}
          onOpenEventLink={handleOpenEventLink}
        />

        <AppointmentDialogs
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          currentEvent={currentEvent}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
          onSubmitEvent={onSubmitEvent}
          onConfirmDelete={onConfirmDelete}
        />
      </div>
    </div>
  );
}
