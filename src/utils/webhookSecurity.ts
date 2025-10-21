// Webhook security utilities
const ALLOWED_WEBHOOK_DOMAINS = [
  'webhook.site',
  'n8n.io', 
  'localhost',
  'automacaodigital360.com'
];

const WEBHOOK_TIMEOUT = 10000; // 10 seconds

export const validateWebhookUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_WEBHOOK_DOMAINS.some(domain => 
      parsedUrl.hostname.endsWith(domain)
    );
  } catch {
    return false;
  }
};

export const secureWebhookRequest = async (
  url: string, 
  options: RequestInit,
  timeout = WEBHOOK_TIMEOUT
): Promise<Response> => {
  if (!validateWebhookUrl(url)) {
    throw new Error('Invalid webhook URL');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw new Error(`Webhook request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};