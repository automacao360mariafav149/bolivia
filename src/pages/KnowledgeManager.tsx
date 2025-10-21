
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, LogOut, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import SearchBar from '@/components/knowledge/SearchBar';
import DocumentGrid from '@/components/knowledge/DocumentGrid';
import AddDocumentDialog from '@/components/knowledge/AddDocumentDialog';
import { useDocuments } from '@/hooks/useDocuments';

const KnowledgeManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  
  const { 
    documents, 
    isLoading, 
    isRefreshing, 
    handleRefresh, 
    handleDeleteDocument,
    uploadFileToWebhook,
    clearAllDocuments
  } = useDocuments();

  const handleBackToDashboard = () => {
    navigate('/metrics');
  };

  const handleAddDocument = async (file: File, category: string) => {
    await uploadFileToWebhook(file, category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petshop-blue dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-petshop-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">Alvorada Veículos</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              Alvorada Veículos
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToDashboard}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Gerenciador de Conhecimento - Alvorada Veículos
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefresh}
            onAddDocument={() => setIsAddDocumentOpen(true)}
            onClearAll={clearAllDocuments}
            isRefreshing={isRefreshing}
          />

          <DocumentGrid 
            documents={documents}
            searchQuery={searchQuery}
            onDeleteDocument={handleDeleteDocument}
          />

          <AddDocumentDialog 
            isOpen={isAddDocumentOpen}
            onOpenChange={setIsAddDocumentOpen}
            onAddDocument={handleAddDocument}
          />
        </div>
      </main>
    </div>
  );
};

export default KnowledgeManager;
