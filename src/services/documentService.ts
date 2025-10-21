
import { supabase } from '@/integrations/supabase/client';
import { getAllEndpoints } from '@/constants/apiEndpoints';
import { Document } from '@/types/document';

export const fetchDocumentsFromDatabase = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('titulo');

  if (error) {
    throw error;
  }

  // Transform the data to match our Document interface
  const formattedDocs: Document[] = data.map((doc, index) => {
    const documentName = doc.titulo || `Documento ${index + 1}`;
    
    return {
      id: index + 1,
      name: documentName,
      type: 'unknown',
      size: 'Unknown',
      category: 'Sem categoria',
      uploadedAt: new Date().toISOString().split('T')[0],
      titulo: doc.titulo,
    };
  });

  return formattedDocs;
};

export const uploadFileToWebhook = async (file: File, category: string): Promise<boolean> => {
  const endpoints = getAllEndpoints();
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);

  console.log('Enviando arquivo para o webhook:', file.name, 'categoria:', category);
  console.log('Endpoint usado:', endpoints.enviaRagc);
  
  const response = await fetch(endpoints.enviaRagc, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar o arquivo: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Arquivo enviado com sucesso:', result);
  
  return true;
};

export const deleteDocumentFromWebhook = async (title: string): Promise<void> => {
  const endpoints = getAllEndpoints();
  
  console.log('Enviando solicitação para excluir arquivo:', title);
  console.log('Endpoint usado:', endpoints.excluirArquivoRagc);
  
  const response = await fetch(endpoints.excluirArquivoRagc, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      titulo: title 
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao excluir o arquivo: ${response.statusText}`);
  }
};

export const clearAllDocumentsFromWebhook = async (): Promise<void> => {
  const endpoints = getAllEndpoints();
  
  console.log('Enviando solicitação para excluir toda a base de conhecimento');
  console.log('Endpoint usado:', endpoints.excluirRagc);
  
  const response = await fetch(endpoints.excluirRagc, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`Erro ao limpar a base de conhecimento: ${response.statusText}`);
  }
};
