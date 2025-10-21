
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Car } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

// Default webhook base URL
const DEFAULT_WEBHOOK_BASE = "https://n8n_mcp.automacaodigital360.com/webhook";

// Default endpoints configuration
const defaultEndpoints = {
  enviaMensagem: `${DEFAULT_WEBHOOK_BASE}/envia_mensagem`,
  pausaBot: `${DEFAULT_WEBHOOK_BASE}/pausa_bot`,
  iniciaBot: `${DEFAULT_WEBHOOK_BASE}/inicia_bot`,
  agenda: `${DEFAULT_WEBHOOK_BASE}/agenda`,
  agendaAlterar: `${DEFAULT_WEBHOOK_BASE}/agenda/alterar`,
  agendaAdicionar: `${DEFAULT_WEBHOOK_BASE}/agenda/adicionar`,
  agendaExcluir: `${DEFAULT_WEBHOOK_BASE}/agenda/excluir`,
  enviaRag: `${DEFAULT_WEBHOOK_BASE}/envia_rag`,
  excluirArquivoRag: `${DEFAULT_WEBHOOK_BASE}/excluir-arquivo-rag`,
  excluirRag: `${DEFAULT_WEBHOOK_BASE}/excluir-rag`,
  instanciaEvolution: `${DEFAULT_WEBHOOK_BASE}/instanciaevolution`,
  atualizarQrCode: `${DEFAULT_WEBHOOK_BASE}/atualizar-qr-code`,
  confirma: `${DEFAULT_WEBHOOK_BASE}/confirma`,
  criaCliente: `${DEFAULT_WEBHOOK_BASE}/cria_cliente`,
  editaCliente: `${DEFAULT_WEBHOOK_BASE}/edita_cliente`,
  excluiCliente: `${DEFAULT_WEBHOOK_BASE}/exclui_cliente`,
};

const endpointGroups = {
  'Configuração Supabase': [
    { id: 'supabaseUrl', label: 'URL do Supabase', value: import.meta.env.VITE_SUPABASE_URL || '', readOnly: true },
    { id: 'supabaseKey', label: 'Chave Anônima do Supabase', value: import.meta.env.VITE_SUPABASE_ANON_KEY || '', readOnly: true }
  ],
  'Configuração da Agenda': [
    { id: 'agenda', label: 'URL Base da Agenda', key: 'agenda' },
    { id: 'agendaAdicionar', label: 'Adicionar Evento', key: 'agendaAdicionar' },
    { id: 'agendaAlterar', label: 'Alterar Evento', key: 'agendaAlterar' },
    { id: 'agendaExcluir', label: 'Excluir Evento', key: 'agendaExcluir' }
  ],
  'Configuração do Bot': [
    { id: 'enviaMensagem', label: 'Enviar Mensagem', key: 'enviaMensagem' },
    { id: 'pausaBot', label: 'Pausar Bot', key: 'pausaBot' },
    { id: 'iniciaBot', label: 'Iniciar Bot', key: 'iniciaBot' },
    { id: 'confirma', label: 'Confirmar', key: 'confirma' }
  ],
  'Configuração RAG': [
    { id: 'enviaRag', label: 'Enviar RAG', key: 'enviaRag' },
    { id: 'excluirArquivoRag', label: 'Excluir Arquivo RAG', key: 'excluirArquivoRag' },
    { id: 'excluirRag', label: 'Excluir RAG', key: 'excluirRag' }
  ],
  'Configuração Evolution': [
    { id: 'instanciaEvolution', label: 'Instância Evolution', key: 'instanciaEvolution' },
    { id: 'atualizarQrCode', label: 'Atualizar QR Code', key: 'atualizarQrCode' }
  ],
  'Configuração de Clientes': [
    { id: 'criaCliente', label: 'Criar Cliente', key: 'criaCliente' },
    { id: 'editaCliente', label: 'Editar Cliente', key: 'editaCliente' },
    { id: 'excluiCliente', label: 'Excluir Cliente', key: 'excluiCliente' }
  ]
};

const ConfigurationManager = () => {
  const [endpoints, setEndpoints] = React.useState(() => {
    const savedEndpoints = localStorage.getItem('webhookEndpoints');
    const OLD_BASE = "https://dados-n8n-mcp.ixmiju.easypanel.host/webhook";
    const NEW_BASE = "https://n8n_mcp.automacaodigital360.com/webhook";
    if (savedEndpoints) {
      try {
        const parsed = JSON.parse(savedEndpoints);
        const migrated = Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [k, typeof v === 'string' ? (v as string).split(OLD_BASE).join(NEW_BASE) : v])
        );
        if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
          localStorage.setItem('webhookEndpoints', JSON.stringify(migrated));
        }
        return migrated;
      } catch {
        return defaultEndpoints;
      }
    }
    return defaultEndpoints;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEndpointChange = (key: string, value: string) => {
    setEndpoints(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('webhookEndpoints', JSON.stringify(endpoints));
    toast({
      title: "Configurações salvas",
      description: "As configurações foram salvas com sucesso.",
    });
  };

  const handleReset = () => {
    setEndpoints(defaultEndpoints);
    localStorage.setItem('webhookEndpoints', JSON.stringify(defaultEndpoints));
    toast({
      title: "Configurações restauradas",
      description: "As configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações do Sistema</h1>
          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="border-gray-300 dark:border-gray-600">
              Restaurar Padrão
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {Object.entries(endpointGroups).map(([groupTitle, fields]) => (
            <Card key={groupTitle} className="w-full dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{groupTitle}</h3>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-gray-700 dark:text-gray-300">{field.label}</Label>
                      <Input
                        id={field.id}
                        value={field.readOnly ? field.value : endpoints[field.key as keyof typeof endpoints]}
                        onChange={field.readOnly ? undefined : (e) => handleEndpointChange(field.key, e.target.value)}
                        readOnly={field.readOnly}
                        className="w-full font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder={field.readOnly ? undefined : `Digite a URL para ${field.label}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationManager;
