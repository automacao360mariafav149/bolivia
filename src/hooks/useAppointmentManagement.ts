
import { useState, useEffect } from 'react';
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { AppointmentType } from '@/services/calendarApi';
import { fetchEvents, addEvent, updateEvent, deleteEvent } from '@/services/calendarApi';
import { format, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function useAppointmentManagement(appointmentType: AppointmentType, selectedDate?: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date | undefined>(selectedDate || new Date());
  const [selectedTab, setSelectedTab] = useState('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { toast } = useToast();

  // Update selected date when prop changes
  useEffect(() => {
    if (selectedDate) {
      setCurrentSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dateToUse = currentSelectedDate || new Date();
        const start = `${format(dateToUse, 'yyyy-MM-dd')}T00:00:00.000-03:00`;
        const end = `${format(dateToUse, 'yyyy-MM-dd')}T23:59:59.999-03:00`;
        
        console.log(`Loading events for ${appointmentType} on ${format(dateToUse, 'yyyy-MM-dd')}`);
        
        const data = await fetchEvents(start, end, appointmentType);
        console.log('Loaded events:', data);
        
        setEvents(Array.isArray(data) ? data : []);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error as Error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [currentSelectedDate, appointmentType]);

  // Filter events based on search and tab selection
  useEffect(() => {
    console.log('Filtering events. Search term:', searchTerm, 'Selected tab:', selectedTab);
    let filtered = events;

    // Filter by tab selection
    if (selectedTab === 'day' && currentSelectedDate) {
      filtered = events.filter(event => 
        isSameDay(new Date(event.start), currentSelectedDate)
      );
      console.log('Filtered by day:', filtered.length, 'events');
    }

    // Filter by search term
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(event => {
        const summaryMatch = event.summary?.toLowerCase().includes(searchLower);
        const descriptionMatch = event.description?.toLowerCase().includes(searchLower);
        const emailMatch = event.attendees?.some(attendee => 
          attendee?.email?.toLowerCase().includes(searchLower)
        );
        
        return summaryMatch || descriptionMatch || emailMatch;
      });
      console.log('Filtered by search term:', filtered.length, 'events');
    }

    setFilteredEvents(filtered);
  }, [events, selectedTab, currentSelectedDate, searchTerm]);

  const reloadEvents = async () => {
    const dateToUse = currentSelectedDate || new Date();
    const start = `${format(dateToUse, 'yyyy-MM-dd')}T00:00:00.000-03:00`;
    const end = `${format(dateToUse, 'yyyy-MM-dd')}T23:59:59.999-03:00`;
    const data = await fetchEvents(start, end, appointmentType);
    setEvents(Array.isArray(data) ? data : []);
    setLastUpdated(new Date());
  };

  const handleSubmitEvent = async (formData: EventFormData, currentEvent: CalendarEvent | null) => {
    console.log('Starting handleSubmitEvent with data:', formData);
    
    try {
      const eventData = {
        summary: formData.summary,
        description: formData.description,
        start: {
          dateTime: `${format(formData.date, 'yyyy-MM-dd')}T${formData.startTime}:00`,
          timeZone: 'America/Sao_Paulo'
        },
        end: {
          dateTime: `${format(formData.date, 'yyyy-MM-dd')}T${formData.endTime}:00`,
          timeZone: 'America/Sao_Paulo'
        },
        attendees: formData.email ? [{ email: formData.email }] : []
      };

      console.log('Event data to send to API:', eventData);

      if (currentEvent) {
        console.log('Updating existing event with ID:', currentEvent.id);
        await updateEvent({ ...eventData, id: currentEvent.id }, appointmentType);
        toast({
          title: "Evento atualizado",
          description: "O evento foi atualizado com sucesso.",
        });
      } else {
        console.log('Creating new event');
        const result = await addEvent(eventData, appointmentType);
        console.log('Add event result:', result);
        toast({
          title: "Evento criado",
          description: "O evento foi criado com sucesso.",
        });
      }

      await reloadEvents();
      console.log('Events reloaded after successful operation');
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar o evento. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    console.log('Deleting event:', eventId);
    
    try {
      await deleteEvent(eventId, appointmentType);
      await reloadEvents();

      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir o evento. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
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
  };
}
