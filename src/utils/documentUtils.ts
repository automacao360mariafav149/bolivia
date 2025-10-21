
import { Document } from '@/types/document';

export const getMetadataValue = (metadata: any, key: string, defaultValue: string): string => {
  if (typeof metadata === 'object' && metadata !== null && key in metadata) {
    return String(metadata[key]) || defaultValue;
  }
  return defaultValue;
};

export const filterUniqueByTitle = (docs: Document[]): Document[] => {
  const uniqueTitles = new Set<string>();
  return docs.filter(doc => {
    const title = doc.titulo || doc.name;
    if (uniqueTitles.has(title)) {
      return false;
    }
    uniqueTitles.add(title);
    return true;
  });
};
