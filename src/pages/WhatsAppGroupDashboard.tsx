
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import WhatsAppGroupHeader from '@/components/whatsapp-group/WhatsAppGroupHeader';
import MessagesPanel from '@/components/whatsapp-group/MessagesPanel';
import EmployeesPanel from '@/components/whatsapp-group/EmployeesPanel';
import { useWhatsAppGroupData } from '@/hooks/useWhatsAppGroupData';

const WhatsAppGroupDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { messages, employees, loading } = useWhatsAppGroupData();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <WhatsAppGroupHeader messagesCount={messages.length} />

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {/* Layout with chat and employees */}
        <div className="h-[calc(100vh-200px)]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Messages Panel */}
            <ResizablePanel defaultSize={70} minSize={50}>
              <MessagesPanel 
                messages={messages}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Employees Panel */}
            <ResizablePanel defaultSize={30} minSize={25}>
              <EmployeesPanel 
                employees={employees}
                loading={loading}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
    </div>
  );
};

export default WhatsAppGroupDashboard;
