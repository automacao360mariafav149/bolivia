import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getAllEndpoints } from '@/constants/apiEndpoints';
import { useEmployees } from '@/hooks/useEmployees';
import { Send, X } from 'lucide-react';

interface NewCarFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewCarFormDialog = ({ open, onOpenChange }: NewCarFormDialogProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [postagem, setPostagem] = useState('');
  const [vendedor, setVendedor] = useState('');
  const { employees, loading: loadingEmployees } = useEmployees();

  const endpoints = getAllEndpoints();
  const webhookUrl = endpoints?.novosCarrosForm || 'https://n8n_mcp.automacaodigital360.com/form/f8a17ade-1041-4cec-881e-0234c7cd1b21';

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Get form data
    const formElements = form.elements;
    const marca = (formElements.namedItem('Marca') as HTMLInputElement)?.value?.trim() || '';
    const modelo = (formElements.namedItem('Modelo') as HTMLInputElement)?.value?.trim() || '';
    const ano = (formElements.namedItem('Ano') as HTMLInputElement)?.value?.trim() || '';
    const cor = (formElements.namedItem('Cor') as HTMLInputElement)?.value?.trim() || '';
    const kilometragem = (formElements.namedItem('kilometragem') as HTMLInputElement)?.value?.trim() || '';
    const preco = (formElements.namedItem('Preço') as HTMLInputElement)?.value?.trim() || '';
    const descricao = (formElements.namedItem('Descrição') as HTMLTextAreaElement)?.value?.trim() || '';

    // Get files
    const filesInput = form.elements.namedItem('arquivos') as HTMLInputElement | null;
    const files = filesInput?.files ? Array.from(filesInput.files) : [];

    // Validate all mandatory fields
    const requiredFields = [
      { field: marca, name: 'Marca' },
      { field: modelo, name: 'Modelo' },
      { field: ano, name: 'Ano' },
      { field: cor, name: 'Cor' },
      { field: kilometragem, name: 'Kilometragem' },
      { field: preco, name: 'Preço' },
      { field: vendedor, name: 'Vendedor' },
      { field: descricao, name: 'Descrição' },
      { field: postagem, name: 'Postagem' }
    ];

    for (const { field, name } of requiredFields) {
      if (!field) {
        toast({
          title: 'Campo obrigatório',
          description: `Por favor, preencha o campo "${name}".`,
          variant: 'destructive',
        });
        return;
      }
    }

    if (files.length === 0) {
      toast({
        title: 'Imagens obrigatórias',
        description: 'Por favor, selecione pelo menos uma imagem ou vídeo.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file types
    const allowedTypes = ['image/', 'video/'];
    
    for (const file of files) {
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: `O arquivo "${file.name}" não é uma imagem ou vídeo válido.`,
          variant: 'destructive',
        });
        return;
      }
    }

    // Create the exact JSON structure expected by webhook
    const submittedAt = new Date().toISOString();
    
    // Create FormData with the exact field names expected
    const formData = new FormData();
    
    // Add form fields with exact JSON structure names
    formData.append('Marca', marca);
    formData.append('Modelo', modelo);
    formData.append('Ano', ano);
    formData.append('Cor', cor);
    formData.append('kilometragem', kilometragem); // Note: lowercase 'k' as per JSON
    formData.append('Preço', preco);
    formData.append('Vendedor', vendedor);
    formData.append('Descrição', descricao);
    formData.append('Postagem', postagem);
    formData.append('submittedAt', submittedAt);
    formData.append('formMode', 'production');

    // Criar informações detalhadas dos arquivos
    const arquivosInfo = files.map((file, index) => ({
      index: index,
      nome: file.name,
      tipo: file.type.startsWith('video/') ? 'mp4' : 'PNG',
      categoria: file.type.startsWith('video/') ? 'video' : 'imagem',
      tamanho: file.size
    }));

    // Adicionar metadados dos arquivos
    formData.append('arquivosInfo', JSON.stringify(arquivosInfo));

    // Add files as 'imagens' as expected by webhook
    files.forEach((file, index) => {
      formData.append('imagens', file);
      console.log(`Arquivo ${index + 1}:`, {
        name: file.name,
        type: file.type,
        categoria: file.type.startsWith('video/') ? 'video' : 'imagem',
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
    });

    // Debug: Log the exact structure being sent
    console.log('Estrutura JSON sendo enviada para o webhook:');
    console.log('URL:', webhookUrl);
    console.log('Campos conforme JSON esperado:');
    const videosCount = arquivosInfo.filter(info => info.categoria === 'video').length;
    const imagensCount = arquivosInfo.filter(info => info.categoria === 'imagem').length;

    console.log({
      imagens: `${files.length} arquivo(s) (${imagensCount} imagens, ${videosCount} vídeos)`,
      arquivosInfo: arquivosInfo,
      Marca: marca,
      Modelo: modelo,
      Ano: ano,
      Cor: cor,
      kilometragem: kilometragem,
      Preço: preco,
      Vendedor: vendedor,
      Descrição: descricao,
      Postagem: postagem,
      submittedAt: submittedAt,
      formMode: 'production'
    });

    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, value.name, `(${value.type}, ${(value.size / 1024).toFixed(2)}KB)`);
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      setSubmitting(true);
      console.log('Enviando dados para o webhook...');
      
      const res = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Resposta do webhook:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries())
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro na resposta:', errorText);
        throw new Error(`Erro no envio: ${res.status} - ${res.statusText}`);
      }

      const result = await res.text();
      console.log('Resposta completa do webhook:', result);

      toast({
        title: 'Enviado com sucesso',
        description: 'Os dados do veículo foram processados com sucesso.',
      });
      form.reset();
      setPostagem('');
      setVendedor('');
      onOpenChange(false);
    } catch (err) {
      console.error('Erro completo:', err);
      toast({
        title: 'Falha no envio',
        description: 'Não foi possível enviar os dados. Verifique o console para mais detalhes.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Adicionar Novo Veículo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="Marca" placeholder="Ex: Toyota" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" name="Modelo" placeholder="Ex: Corolla" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input id="ano" name="Ano" type="number" min={1900} max={2100} placeholder="Ex: 2021" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cor">Cor</Label>
              <Input id="cor" name="Cor" placeholder="Ex: Prata" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kilometragem">Kilometragem</Label>
              <Input id="kilometragem" name="kilometragem" placeholder="Ex: 45.000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              <Input id="preco" name="Preço" placeholder="Ex: 89.900" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendedor">Vendedor</Label>
              <Select value={vendedor} onValueChange={setVendedor} required>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione um vendedor" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg z-50">
                  {loadingEmployees ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : employees.length === 0 ? (
                    <SelectItem value="empty" disabled>Nenhum funcionário encontrado</SelectItem>
                  ) : (
                    employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.nome}>
                        {employee.nome}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" name="Descrição" placeholder="Detalhes do veículo" rows={3} required />
          </div>

          <div className="space-y-2">
            <Label>Postagem</Label>
            <RadioGroup value={postagem} onValueChange={setPostagem} required>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Carrossel" id="carrossel" disabled />
                <Label htmlFor="carrossel">Em Desenvolvimento - Carrossel</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Stories" id="stories" disabled />
                <Label htmlFor="stories">Em Desenvolvimento - Stories</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Reels" id="reels" disabled />
                <Label htmlFor="reels">Em Desenvolvimento - Reels</Label>
              </div>
              <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <RadioGroupItem value="Feed" id="feed" disabled />
                <Label htmlFor="feed">Em Desenvolvimento - Feed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Somente Estoque" id="somente-estoque" />
                <Label htmlFor="somente-estoque">Somente Estoque</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="arquivos">Imagens/Vídeos (múltiplos)</Label>
            <Input 
              id="arquivos" 
              name="arquivos" 
              type="file" 
              accept="image/*,video/*" 
              multiple 
              required 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            <p className="text-xs text-muted-foreground">
              Aceita imagens e vídeos. Sem limite de tamanho.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
};

export default NewCarFormDialog;