
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientStats } from '@/components/clients/ClientStats';
import { ClientTabs } from '@/components/clients/ClientTabs';
import { ClientCard } from '@/components/clients/ClientCard';
import AddClientDialog from '@/components/clients/AddClientDialog';
import EditClientDialog from '@/components/clients/EditClientDialog';
import ClientDetailSheet from '@/components/clients/ClientDetailSheet';
import { useClientManagement } from '@/hooks/useClientManagement';
import { useClientStats } from '@/hooks/useClientStats';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/client';

const ClientsDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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

  const { stats, loading: statsLoading, refetchStats } = useClientStats();

  // Fetch stats on mount
  useEffect(() => {
    refetchStats();
  }, [refetchStats]);

  // Filter contacts based on search and active tab
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Filter by tab (status)
    if (activeTab === 'active') {
      filtered = filtered.filter(c => c.status === 'Active');
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(c => c.status === 'Inactive');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.phone && c.phone.includes(term))
      );
    }

    return filtered;
  }, [contacts, activeTab, searchTerm]);

  // Calculate status counts
  const statusCounts = useMemo(() => ({
    all: contacts.length,
    active: contacts.filter(c => c.status === 'Active').length,
    inactive: contacts.filter(c => c.status === 'Inactive').length,
  }), [contacts]);

  // Stats for ClientStats component
  const clientStats = {
    total: stats.totalClients,
    active: stats.activeClients,
    newThisMonth: stats.newClientsThisMonth,
    growth: stats.growthPercentage,
  };

  // Handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleViewClient = (client: Contact) => {
    handleContactClick(client);
  };

  const handleEditClient = (client: Contact) => {
    handleContactClick(client);
    openEditModal(client);
  };

  const handleDeleteClient = async (client: Contact) => {
    if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      await handleDeleteContact();
      refetchStats(); // Refresh stats after deletion
    }
  };

  const handleMessageClient = (client: Contact) => {
    handleContactClick(client);
    handleMessageClick();
  };

  const handleNewClient = () => {
    setIsAddContactOpen(true);
  };

  const handleAddContactWrapper = async () => {
    await handleAddContact();
    refetchStats();
  };

  const handleEditContactWrapper = async () => {
    await handleEditContact();
    refetchStats();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Header */}
        <div className="relative mb-8">
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Clientes
                  </h1>
                  <p className="text-slate-400 text-lg mt-1">
                    Gestão completa do relacionamento com seus clientes
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleNewClient}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-3 px-6 py-3 h-12 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5" />
                  Novo Cliente
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <ClientStats stats={clientStats} loading={statsLoading} />

        {/* Tabs e Busca */}
        <ClientTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          totalCount={contacts.length}
          statusCounts={statusCounts}
        />

        {/* Clients List */}
        {loadingContacts ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-800 h-32 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-slate-300 text-lg font-semibold mb-2">Nenhum cliente encontrado</p>
            <p className="text-slate-500 text-sm">
              {searchTerm
                ? 'Tente ajustar os filtros de busca'
                : 'Adicione seu primeiro cliente para começar'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
                onView={handleViewClient}
                onMessage={handleMessageClient}
              />
            ))}
          </div>
        )}

        {/* Add Client Dialog */}
        <AddClientDialog
          isOpen={isAddContactOpen}
          onOpenChange={setIsAddContactOpen}
          newContact={newContact}
          setNewContact={setNewContact}
          handleAddContact={handleAddContactWrapper}
        />

        {/* Client Detail Sheet */}
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

        {/* Edit Client Dialog */}
        <EditClientDialog
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          selectedContact={selectedContact}
          editContactData={newContact}
          setEditContactData={setNewContact}
          handleEditContact={handleEditContactWrapper}
        />
      </div>
    </div>
  );
};

export default ClientsDashboard;
