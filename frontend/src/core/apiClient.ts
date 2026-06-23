//ARCHIVO PUENTE PARA CONECTAR FRONTEND CON BACKEND

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010';

export const apiClient = {

    //PARA REALIZAR SOLICITUDES GET
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error en la petición GET: ${response.status}`);
        }
        return response.json();
    },

    //PARA REALIZAR SOLICITUDES POST
    post: async <T>(endpoint: string, data: unknown): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error en la petición POST: ${response.status}`);
        }
        return response.json();
    },

    //PARA REALIZAR SOLICITUDES PUT
    put: async <T>(endpoint: string, data: unknown): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error en la petición PUT: ${response.status}`);
        }
        return response.json();
    },

    //PARA REALIZAR SOLICITUDES DELETE
    delete: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error en la petición DELETE: ${response.status}`);
        }
        return response.json();
    },
};