/**
 * Script para extrair IDs de arquivos de uma pasta do Google Drive
 *
 * COMO USAR:
 * 1. Abra a pasta do Google Drive no navegador
 * 2. Pressione F12 para abrir o console
 * 3. Cole este script completo no console
 * 4. Pressione Enter
 * 5. O script irá copiar todos os IDs para sua área de transferência
 */

(function() {
  console.log('🚀 Iniciando extração de IDs do Google Drive...');

  // Aguardar a página carregar completamente
  setTimeout(() => {
    try {
      // Método 1: Tentar extrair da URL dos elementos
      const allLinks = document.querySelectorAll('a[href*="/file/d/"]');
      const ids = new Set();

      allLinks.forEach(link => {
        const href = link.getAttribute('href');
        const match = href.match(/\/file\/d\/([^\/\?]+)/);
        if (match && match[1]) {
          ids.add(match[1]);
        }
      });

      // Método 2: Tentar extrair do data-id
      const dataIdElements = document.querySelectorAll('[data-id]');
      dataIdElements.forEach(el => {
        const id = el.getAttribute('data-id');
        if (id && id.length > 20 && id.length < 50) {
          ids.add(id);
        }
      });

      // Método 3: Tentar extrair de divs com IDs longos
      const allDivs = document.querySelectorAll('div[data-target]');
      allDivs.forEach(div => {
        const target = div.getAttribute('data-target');
        if (target && target.length > 20) {
          ids.add(target);
        }
      });

      const idsArray = Array.from(ids);

      if (idsArray.length === 0) {
        console.error('❌ Nenhum ID encontrado!');
        console.log('💡 Dica: Certifique-se de que você está na visualização de uma pasta do Google Drive');
        console.log('💡 URL deve ser: https://drive.google.com/drive/folders/...');
        return;
      }

      // Juntar todos os IDs com vírgula
      const result = idsArray.join(',');

      // Copiar para área de transferência
      navigator.clipboard.writeText(result).then(() => {
        console.log('✅ Sucesso!');
        console.log(`📊 Total de arquivos encontrados: ${idsArray.length}`);
        console.log('📋 IDs copiados para a área de transferência!');
        console.log('\n🔗 String completa:');
        console.log(result);
        console.log('\n📝 Próximo passo:');
        console.log('Cole estes IDs no campo drive_id do banco de dados');

        // Mostrar alerta visual
        alert(`✅ ${idsArray.length} IDs copiados!\n\nCole no banco de dados.`);
      }).catch(err => {
        console.error('❌ Erro ao copiar:', err);
        console.log('\n🔗 IDs extraídos (copie manualmente):');
        console.log(result);
      });

    } catch (error) {
      console.error('❌ Erro durante extração:', error);
      console.log('💡 Tente recarregar a página e executar o script novamente');
    }
  }, 2000);

  console.log('⏳ Aguardando 2 segundos para garantir que a página carregou...');
})();

// Instruções adicionais
console.log(`
╔══════════════════════════════════════════════════════════╗
║     EXTRATOR DE IDS DO GOOGLE DRIVE                      ║
╚══════════════════════════════════════════════════════════╝

📌 INSTRUÇÕES:

1. Certifique-se de que você está em uma pasta do Google Drive
   URL exemplo: https://drive.google.com/drive/folders/1abc123...

2. O script tentará extrair os IDs automaticamente

3. Se encontrar IDs, eles serão copiados automaticamente

4. Cole os IDs no campo 'drive_id' do banco de dados

═══════════════════════════════════════════════════════════

💡 DICA ALTERNATIVA:

Se o script não funcionar, você pode extrair manualmente:

1. Clique direito em cada arquivo → "Obter link"
2. Copie o ID de cada URL
3. Junte todos com vírgulas
`);
