/**
 * apiClient.ts
 * Cliente base para realizar peticiones al backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = {
  /**
   * Realiza una petición GET
   */
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error en la petición GET: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Realiza una petición POST
   */
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: undefined })) as { message?: string };
      throw new Error(errorData.message || `Error en la petición POST: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Realiza una petición PUT
   */
  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: undefined })) as { message?: string };
      throw new Error(errorData.message || `Error en la petición PUT: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Realiza una petición DELETE
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error en la petición DELETE: ${response.statusText}`);
    }
    return response.json();
  },
};
