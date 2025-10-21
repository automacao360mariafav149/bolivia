
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import ClientSearchBar from '@/components/clients/ClientSearchBar';
import ClientsTable from '@/components/clients/ClientsTable';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import ClientDetailSheet from '@/components/clients/ClientDetailSheet';
import { useClientManagement } from '@/hooks/useClientManagement';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientsDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const {
    contacts,
    loadingContacts,
    refreshing,
    selectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    isPauseDurationDialogOpen,
    setIsPauseDurationDialogOpen,
    messageText,
    setMessageText,
    newContact,
    setNewContact,
    handleRefresh,
    handleContactClick,
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    openEditModal,
    handleMessageClick,
    handleMessageSubmit,
    handlePauseDurationConfirm
  } = useClientManagement();


  const actionButtons = (
    <>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Cliente
      </Button>
      <Button variant="outline">
        <Upload className="w-4 h-4 mr-2" />
        Importar Clientes
      </Button>
    </>
  );

  return (
    <div className="flex-1 overflow-auto">
      <Header 
        title="Clientes" 
        subtitle="Gerencie todos os seus clientes em um só lugar"
        showSearch={true}
        showActions={true}
        searchPlaceholder="Pesquisar clientes..."
        actionButtons={actionButtons}
      />
      
      <main className="p-6">
        <Card className="border dark:border-gray-700 shadow-sm">
          <CardContent className="p-0">
            <ClientsTable 
              contacts={contacts}
              isLoading={loadingContacts}
              searchTerm={searchTerm}
              onContactClick={handleContactClick}
            />
          </CardContent>
          <CardFooter className="border-t dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total de clientes: {contacts.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (contact.phone && contact.phone.includes(searchTerm))
              ).length}
            </div>
          </CardFooter>
        </Card>
      </main>

      <ClientDetailSheet 
        isOpen={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        selectedContact={selectedContact}
        onEditClick={openEditModal}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        onSendMessageClick={handleMessageClick}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteContact={handleDeleteContact}
        isMessageDialogOpen={isMessageDialogOpen}
        setIsMessageDialogOpen={setIsMessageDialogOpen}
        messageText={messageText}
        setMessageText={setMessageText}
        handleMessageSubmit={handleMessageSubmit}
        isPauseDurationDialogOpen={isPauseDurationDialogOpen}
        setIsPauseDurationDialogOpen={setIsPauseDurationDialogOpen}
        handlePauseDurationConfirm={handlePauseDurationConfirm}
      />
      
      <EditClientDialog 
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        selectedContact={selectedContact}
        editContactData={newContact}
        setEditContactData={setNewContact}
        handleEditContact={handleEditContact}
      />
    </div>
  );
};

export default ClientsDashboard;
