/**
 * Utilitários para trabalhar com imagens do Google Drive
 *
 * IMPORTANTE: Para que as imagens funcionem, é necessário:
 * 1. Cada arquivo de imagem deve estar com compartilhamento público
 * 2. Configuração: Botão direito → Compartilhar → "Qualquer pessoa com o link" → "Leitor"
 * 3. Usar o ID individual do arquivo, NÃO o ID da pasta
 */

/**
 * Converte IDs do Google Drive em URLs de visualização direta
 * @param driveIds - String com um ou múltiplos IDs separados por vírgula
 * @returns Array de URLs prontas para uso em tags <img>
 *
 * Exemplos de entrada:
 * - "1abc123xyz" (um ID)
 * - "1abc123xyz,2def456uvw,3ghi789rst" (múltiplos IDs)
 */
export function getDriveImageUrls(driveIds: string): string[] {
  if (!driveIds || driveIds.trim() === '') {
    return [];
  }

  // Separar por vírgula e limpar espaços
  const ids = driveIds
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0);

  // Converter cada ID em URL de visualização
  return ids.map(id => `https://drive.google.com/uc?export=view&id=${id}`);
}

/**
 * Extrai o ID do arquivo de uma URL do Google Drive
 * @param url - URL do Google Drive (diversos formatos aceitos)
 * @returns ID do arquivo ou null se não encontrado
 *
 * Formatos suportados:
 * - https://drive.google.com/file/d/1abc123xyz/view
 * - https://drive.google.com/open?id=1abc123xyz
 * - https://drive.google.com/uc?id=1abc123xyz
 */
export function extractDriveId(url: string): string | null {
  if (!url) return null;

  // Formato: /file/d/{ID}/
  const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
  if (fileMatch) return fileMatch[1];

  // Formato: ?id={ID} ou &id={ID}
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch) return idMatch[1];

  // Se já for um ID (sem / ou ?)
  if (!url.includes('/') && !url.includes('?')) {
    return url;
  }

  return null;
}

/**
 * Valida se um ID do Google Drive tem formato válido
 * IDs do Drive geralmente têm entre 25-45 caracteres alfanuméricos e hífens/underscores
 */
export function isValidDriveId(id: string): boolean {
  if (!id || id.length < 20 || id.length > 50) {
    return false;
  }

  // Verificar se contém apenas caracteres válidos
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Gera URLs alternativas para tentar carregar a imagem
 * Útil quando um formato não funciona
 */
export function getAlternativeDriveUrls(driveId: string): string[] {
  return [
    // Formato principal (mais confiável)
    `https://drive.google.com/uc?export=view&id=${driveId}`,

    // Formato thumbnail (boa qualidade)
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,

    // Formato thumbnail (alta qualidade)
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w2000`,

    // Formato de preview
    `https://lh3.googleusercontent.com/d/${driveId}`,
  ];
}

/**
 * Testa se uma URL de imagem está acessível
 * @param url - URL da imagem
 * @returns Promise que resolve com true se acessível, false caso contrário
 */
export async function testImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;

    // Timeout de 10 segundos
    setTimeout(() => resolve(false), 10000);
  });
}

/**
 * Encontra a primeira URL funcional de uma lista de alternativas
 */
export async function findWorkingUrl(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    const works = await testImageUrl(url);
    if (works) {
      return url;
    }
  }
  return null;
}
