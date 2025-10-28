/**
 * Serviço para buscar imagens de pastas públicas do Google Drive
 *
 * REQUISITOS:
 * 1. A pasta deve estar com compartilhamento público: "Qualquer pessoa com o link"
 * 2. Todos os arquivos dentro da pasta devem herdar as permissões da pasta
 */

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

/**
 * Busca imagens de uma pasta do Google Drive usando web scraping
 * Como a pasta é pública, podemos acessar a versão HTML e extrair os IDs
 */
export async function getImageIdsFromFolder(folderId: string): Promise<string[]> {
  try {
    console.log('Buscando IDs de imagens da pasta:', folderId);

    // Usar a API pública do Google Drive que não requer autenticação
    // para pastas públicas
    const url = `https://drive.google.com/drive/folders/${folderId}`;

    // Como o fetch direto pode ter problemas de CORS, vamos usar uma abordagem
    // que funciona com pastas públicas: acessar via proxy ou usar padrões conhecidos

    // Por enquanto, vamos retornar um array vazio e deixar que o componente
    // mostre a pasta via iframe. Vamos implementar uma solução melhor.

    return [];
  } catch (error) {
    console.error('Erro ao buscar IDs da pasta:', error);
    return [];
  }
}

/**
 * Busca todos os arquivos de imagem dentro de uma pasta pública do Google Drive
 * @param folderId - ID da pasta do Google Drive
 * @returns Array de URLs das imagens encontradas
 */
export async function fetchImagesFromDriveFolder(folderId: string): Promise<string[]> {
  try {
    console.log('Buscando imagens da pasta:', folderId);

    // URL da API do Google Drive (sem necessidade de API Key para pastas públicas)
    // Usando o método de web scraping da página pública
    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;

    try {
      // Tentar buscar via fetch (pode ser bloqueado por CORS)
      const response = await fetch(url);
      const html = await response.text();

      // Extrair IDs de arquivos do HTML
      const fileIds = extractFileIdsFromHtml(html);

      if (fileIds.length > 0) {
        console.log('IDs de arquivos encontrados:', fileIds);
        return fileIds.map(id => `https://drive.google.com/uc?export=view&id=${id}`);
      }
    } catch (fetchError) {
      console.log('Método fetch falhou, tentando abordagem alternativa:', fetchError);
    }

    // Abordagem alternativa: usar padrões conhecidos do Google Drive
    // Quando uma pasta está pública, podemos tentar IDs comuns
    return getFolderImageUrlsAlternative(folderId);

  } catch (error) {
    console.error('Erro ao buscar imagens da pasta:', error);
    throw new Error('Não foi possível carregar as imagens da pasta do Google Drive');
  }
}

/**
 * Extrai IDs de arquivos de imagem do HTML da pasta pública
 */
function extractFileIdsFromHtml(html: string): string[] {
  const ids: string[] = [];

  // Padrões para encontrar IDs no HTML
  const patterns = [
    /"id":"([^"]+)"/g,
    /\["([a-zA-Z0-9_-]{25,})"]/g,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 20 && match[1].length < 50) {
        if (!ids.includes(match[1]) && !match[1].includes('folder')) {
          ids.push(match[1]);
        }
      }
    }
  }

  return ids;
}

/**
 * Abordagem alternativa usando iframe embarcado do Google Drive
 * Esta função retorna URLs que podem ser usadas para exibir a galeria
 */
function getFolderImageUrlsAlternative(folderId: string): string[] {
  // Retorna a URL da pasta em formato de visualização
  // O componente poderá usar isso para exibir via iframe se necessário
  return [`https://drive.google.com/embeddedfolderview?id=${folderId}#grid`];
}

/**
 * Verifica se um ID é de uma pasta ou arquivo
 * Pastas geralmente podem ser abertas com /drive/folders/
 * Arquivos com /file/d/
 */
export function isDriveFolder(driveId: string): boolean {
  // Não há uma forma 100% confiável de determinar isso só pelo ID
  // Mas podemos tentar ambas abordagens
  return true; // Assume que pode ser pasta
}

/**
 * Busca imagens usando a Google Drive API v3 (requer API key)
 * Esta é a abordagem mais confiável, mas requer configuração
 */
export async function fetchImagesWithApiKey(
  folderId: string,
  apiKey: string
): Promise<string[]> {
  try {
    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.append('q', `'${folderId}' in parents and mimeType contains 'image/'`);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('fields', 'files(id,name,mimeType,thumbnailLink,webContentLink)');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const files: DriveFile[] = data.files || [];

    console.log('Arquivos encontrados via API:', files);

    // Retornar URLs de visualização das imagens
    return files.map(file => `https://drive.google.com/uc?export=view&id=${file.id}`);

  } catch (error) {
    console.error('Erro ao usar API do Google Drive:', error);
    throw error;
  }
}

/**
 * Método simplificado que tenta listar arquivos de uma pasta pública
 * usando a URL de feed RSS do Google Drive (deprecated mas ainda funciona em alguns casos)
 */
export async function fetchImagesViaRss(folderId: string): Promise<string[]> {
  try {
    // Construir URL de visualização embarcada que retorna dados estruturados
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}`;

    console.log('Tentando acessar pasta via URL embarcada:', embedUrl);

    // Retornar placeholder - na prática, precisaremos de um backend proxy
    // ou usar a abordagem de iframe
    return [];
  } catch (error) {
    console.error('Erro ao buscar via RSS:', error);
    return [];
  }
}
