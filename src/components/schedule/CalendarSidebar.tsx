
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AppointmentType } from '@/services/calendarApi';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Clock, User } from 'lucide-react';

interface CalendarSidebarProps {
  appointmentType: AppointmentType;
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const CalendarSidebar = ({ appointmentType, onDateSelect, selectedDate }: CalendarSidebarProps) => {
  const { date, setDate, events } = useCalendarEvents(appointmentType);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateSelect?.(newDate);
    }
  };

  const displayDate = selectedDate || date;

  return (
    <div className="w-[350px] border-r p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
      <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
        <Calendar
          mode="single"
          selected={displayDate}
          onSelect={handleDateSelect}
          className="rounded-md"
          locale={pt}
        />
      </Card>
      
      <Card className="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            Eventos - {displayDate ? format(displayDate, "dd/MM/yyyy", { locale: pt }) : 'Hoje'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event: any) => (
                <div key={event.id} className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  <div className="font-medium text-sm text-blue-900 dark:text-blue-100">
                    {event.summary || 'Sem título'}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300 mt-1">
                    <Clock className="h-3 w-3" />
                    {event.start ? format(new Date(event.start), 'HH:mm') : 'Horário não definido'}
                  </div>
                  {event.attendees && event.attendees.length > 0 && event.attendees[0]?.email && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1">
                      <User className="h-3 w-3" />
                      {event.attendees[0].email}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum evento para este dia</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSidebar;
