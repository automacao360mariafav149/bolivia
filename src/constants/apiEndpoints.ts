
// Função para obter endpoints salvos ou usar padrões (com migração de base)
const OLD_BASE = "https://dados-n8n-mcp.ixmiju.easypanel.host/webhook";
const NEW_BASE = "https://n8n_mcp.automacaodigital360.com/webhook";

const migrateBase = (obj: any) => {
  if (!obj || typeof obj !== 'object') return obj;
  const migrated: any = {};
  for (const [k, v] of Object.entries(obj)) {
    migrated[k] = typeof v === 'string' ? (v as string).split(OLD_BASE).join(NEW_BASE) : v;
  }
  return migrated;
};

const getSavedEndpoints = () => {
  const saved = localStorage.getItem('webhookEndpoints');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const migrated = migrateBase(parsed);
      if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
        localStorage.setItem('webhookEndpoints', JSON.stringify(migrated));
      }
      return migrated;
    } catch {
      return getDefaultEndpoints();
    }
  }
  return getDefaultEndpoints();
};

const getDefaultEndpoints = () => ({
  enviaMensagem: "https://n8n_mcp.automacaodigital360.com/webhook/envia_mensagem",
  pausaBot: "https://n8n_mcp.automacaodigital360.com/webhook/pausa_bot",
  iniciaBot: "https://n8n_mcp.automacaodigital360.com/webhook/inicia_bot",
  agenda: "https://n8n_mcp.automacaodigital360.com/webhook/agenda",
  agendaAlterar: "https://n8n_mcp.automacaodigital360.com/webhook/agenda/alterar",
  agendaAdicionar: "https://n8n_mcp.automacaodigital360.com/webhook/agenda/adicionar",
  agendaExcluir: "https://n8n_mcp.automacaodigital360.com/webhook/agenda/excluir",
  enviaRagc: "https://n8n_mcp.automacaodigital360.com/webhook/envia_ragc",
  excluirArquivoRagc: "https://n8n_mcp.automacaodigital360.com/webhook/excluir-arquivo-ragc",
  excluirRagc: "https://n8n_mcp.automacaodigital360.com/webhook/excluir-ragc",
  instanciaEvolution: "https://n8n_mcp.automacaodigital360.com/webhook/instanciaevolution",
  atualizarQrCode: "https://n8n_mcp.automacaodigital360.com/webhook/atualizar-qr-code",
  confirma: "https://n8n_mcp.automacaodigital360.com/webhook/confirma",
  criaCliente: "https://n8n_mcp.automacaodigital360.com/webhook/cria_cliente",
  editaCliente: "https://n8n_mcp.automacaodigital360.com/webhook/edita_cliente",
  excluiCliente: "https://n8n_mcp.automacaodigital360.com/webhook/exclui_cliente",
  adicionarVeiculo: "https://n8n_mcp.automacaodigital360.com/webhook/adicionar_veiculo",
  novosCarrosForm: "https://n8n_mcp.automacaodigital360.com/webhook/Envia_veiculos",
});

export const ENDPOINTS = {
  Funcionario01: {
    GET: `${getSavedEndpoints().agenda}/funcionario01`,
    ADD: `${getSavedEndpoints().agendaAdicionar}/funcionario01`,
    UPDATE: `${getSavedEndpoints().agendaAlterar}/funcionario01`,
    DELETE: "https://n8n_mcp.automacaodigital360.com/webhook/agenda/excluir/funcionario01",
  },
  Funcionario02: {
    GET: `${getSavedEndpoints().agenda}/funcionario02`,
    ADD: `${getSavedEndpoints().agendaAdicionar}/funcionario02`,
    UPDATE: `${getSavedEndpoints().agendaAlterar}/funcionario02`,
    DELETE: "https://n8n_mcp.automacaodigital360.com/webhook/agenda/excluir/funcionario02",
  },
};

// Exportar função para acessar todos os endpoints
export const getAllEndpoints = getSavedEndpoints;
