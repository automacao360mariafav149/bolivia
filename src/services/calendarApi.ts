
import { ENDPOINTS } from '../constants/apiEndpoints';
import { secureWebhookRequest } from '../utils/webhookSecurity';

export type AppointmentType = 'Funcionario01' | 'Funcionario02';

export const fetchEvents = async (
  start: string,
  end: string,
  type: AppointmentType = 'Funcionario02'
) => {
  const endpoint = type === 'Funcionario01' ? ENDPOINTS.Funcionario01.GET : ENDPOINTS.Funcionario02.GET;
  console.log(`Fetching events from: ${endpoint}?start=${start}&end=${end}`);
  
  try {
    const response = await fetch(`${endpoint}?start=${start}&end=${end}`);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log('Response text:', text);
    
    if (!text) {
      console.log('Empty response, returning empty array');
      return [];
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const addEvent = async (eventData: any, type: AppointmentType = 'Funcionario02') => {
  const endpoint = type === 'Funcionario01' ? ENDPOINTS.Funcionario01.ADD : ENDPOINTS.Funcionario02.ADD;
  
  try {
    const response = await secureWebhookRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    
    console.log('Add event response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log('Add event response text:', text);
    
    if (!text) {
      return { success: true };
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return { success: true };
    }
  } catch (error) {
    console.error('Add event error:', error);
    throw error;
  }
};

export const updateEvent = async (eventData: any, type: AppointmentType = 'Funcionario02') => {
  const endpoint = type === 'Funcionario01' ? ENDPOINTS.Funcionario01.UPDATE : ENDPOINTS.Funcionario02.UPDATE;
  
  try {
    const response = await secureWebhookRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    
    console.log('Update event response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar evento: ${response.status} - ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Update event response text:', text);
    
    if (!text) {
      return { success: true };
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return { success: true };
    }
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string, type: AppointmentType = 'Funcionario02') => {
  const endpoint = type === 'Funcionario01' ? ENDPOINTS.Funcionario01.DELETE : ENDPOINTS.Funcionario02.DELETE;
  console.log('=== INÍCIO DELETE EVENT ===');
  console.log('Endpoint URL:', endpoint);
  console.log('Event ID:', eventId);
  console.log('Appointment Type:', type);
  
  // Estratégia 1: Tentar POST com ID no body
  try {
    console.log('ESTRATÉGIA 1: POST com ID no body');
    const deleteData = { id: eventId };
    console.log('Request body:', JSON.stringify(deleteData));
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      mode: 'cors',
      body: JSON.stringify(deleteData),
    });
    
    console.log('POST Response status:', response.status);
    console.log('POST Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const text = await response.text();
      console.log('POST Success response:', text);
      return { success: true, method: 'POST_BODY' };
    }
    
    console.log('POST com body falhou, tentando próxima estratégia...');
  } catch (error) {
    console.log('POST com body erro:', error);
  }
  
  // Estratégia 2: Tentar POST com ID como query parameter
  try {
    console.log('ESTRATÉGIA 2: POST com ID como query parameter');
    const urlWithId = `${endpoint}?id=${eventId}`;
    console.log('URL com query parameter:', urlWithId);
    
    const response = await fetch(urlWithId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    console.log('POST Query Response status:', response.status);
    
    if (response.ok) {
      const text = await response.text();
      console.log('POST Query Success response:', text);
      return { success: true, method: 'POST_QUERY' };
    }
    
    console.log('POST com query falhou, tentando próxima estratégia...');
  } catch (error) {
    console.log('POST com query erro:', error);
  }
  
  // Estratégia 3: Tentar GET com ID como query parameter
  try {
    console.log('ESTRATÉGIA 3: GET com ID como query parameter');
    const urlWithId = `${endpoint}?id=${eventId}`;
    console.log('GET URL:', urlWithId);
    
    const response = await fetch(urlWithId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    
    console.log('GET Response status:', response.status);
    
    if (response.ok) {
      const text = await response.text();
      console.log('GET Success response:', text);
      return { success: true, method: 'GET_QUERY' };
    }
    
    console.log('GET com query falhou, tentando próxima estratégia...');
  } catch (error) {
    console.log('GET com query erro:', error);
  }
  
  // Estratégia 4: Tentar DELETE tradicional
  try {
    console.log('ESTRATÉGIA 4: DELETE tradicional');
    const deleteData = { id: eventId };
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(deleteData),
    });
    
    console.log('DELETE Response status:', response.status);
    
    if (response.ok) {
      const text = await response.text();
      console.log('DELETE Success response:', text);
      return { success: true, method: 'DELETE' };
    }
    
    console.log('DELETE tradicional falhou');
  } catch (error) {
    console.log('DELETE tradicional erro:', error);
  }
  
  // Estratégia 5: Tentar POST sem headers específicos
  try {
    console.log('ESTRATÉGIA 5: POST simples sem headers específicos');
    const deleteData = { id: eventId };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(deleteData),
    });
    
    console.log('POST Simples Response status:', response.status);
    
    if (response.ok) {
      const text = await response.text();
      console.log('POST Simples Success response:', text);
      return { success: true, method: 'POST_SIMPLE' };
    }
    
    console.log('POST simples falhou');
  } catch (error) {
    console.log('POST simples erro:', error);
  }
  
  console.log('=== TODAS AS ESTRATÉGIAS FALHARAM ===');
  console.error('Não foi possível excluir o evento usando nenhuma das estratégias disponíveis');
  throw new Error('Não foi possível conectar ao servidor para excluir o evento. Verifique sua conexão e tente novamente.');
};
