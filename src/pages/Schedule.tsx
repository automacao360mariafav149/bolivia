
import React, { useState } from 'react';
import CalendarSidebar from '../components/schedule/CalendarSidebar';
import AppointmentsSection from '../components/schedule/AppointmentsSection';
import ScheduleHeader from '../components/schedule/ScheduleHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentType } from '../services/calendarApi';

const Schedule = () => {
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('Funcionario02');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ScheduleHeader />
      
      <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
            <Tabs defaultValue="funcionario02" onValueChange={(value) => setAppointmentType(value === 'funcionario02' ? 'Funcionario02' : 'Funcionario01')}>
              <TabsList className="grid w-[400px] grid-cols-2 bg-blue-100 dark:bg-blue-900">
                <TabsTrigger value="funcionario02" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Funcionário 02
                </TabsTrigger>
                <TabsTrigger value="funcionario01" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Funcionário 01
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <CalendarSidebar 
              appointmentType={appointmentType} 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
            <AppointmentsSection 
              appointmentType={appointmentType} 
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
