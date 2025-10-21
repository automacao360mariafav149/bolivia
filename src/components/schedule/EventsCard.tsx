
import React from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search, LoaderCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EventsTable } from './EventsTable';

interface EventsCardProps {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  selectedTab: string;
  searchTerm: string;
  selectedDate: Date | undefined;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  onSearchChange: (term: string) => void;
  onTabChange: (tab: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onOpenEventLink: (url: string) => void;
}

export function EventsCard({
  events,
  filteredEvents,
  selectedTab,
  searchTerm,
  selectedDate,
  isLoading,
  error,
  lastUpdated,
  onSearchChange,
  onTabChange,
  onEditEvent,
  onDeleteEvent,
  onOpenEventLink
}: EventsCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-blue-200 dark:border-blue-700">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-t-lg border-b border-blue-200 dark:border-blue-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-blue-900 dark:text-blue-100">Agenda Alvorada Veiculos</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              {selectedTab === 'day' 
                ? `Visualizando ${filteredEvents.length} eventos para ${selectedDate ? format(selectedDate, "dd/MM/yyyy") : 'hoje'}` 
                : `Visualizando todos os ${filteredEvents.length} eventos`
              }
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500 dark:text-blue-400" />
              <Input 
                type="search" 
                placeholder="Buscar eventos..." 
                className="pl-9 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400" 
                value={searchTerm} 
                onChange={e => onSearchChange(e.target.value)} 
              />
            </div>
            
            <Tabs defaultValue={selectedTab} className="w-full sm:w-auto" onValueChange={onTabChange}>
              <TabsList className="bg-blue-100 dark:bg-blue-900">
                <TabsTrigger value="day" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Diário
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Todos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {error && events.length === 0 && (
          <Alert variant="destructive" className="mb-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Não conseguimos atualizar os eventos, tentando novamente em breve...
            </AlertDescription>
          </Alert>
        )}

        {isLoading && events.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full bg-blue-100 dark:bg-blue-900/30" />
            <Skeleton className="h-12 w-full bg-blue-100 dark:bg-blue-900/30" />
            <Skeleton className="h-12 w-full bg-blue-100 dark:bg-blue-900/30" />
            <Skeleton className="h-12 w-full bg-blue-100 dark:bg-blue-900/30" />
          </div>
        ) : (
          <EventsTable 
            events={filteredEvents} 
            isLoading={isLoading} 
            onEditEvent={onEditEvent} 
            onDeleteEvent={onDeleteEvent} 
            onOpenEventLink={onOpenEventLink} 
          />
        )}
      </CardContent>
      
      {lastUpdated && (
        <CardFooter className="bg-blue-50/50 dark:bg-blue-900/20 rounded-b-lg border-t border-blue-200 dark:border-blue-700">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Última atualização: {format(lastUpdated, "dd/MM/yyyy HH:mm:ss")}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
