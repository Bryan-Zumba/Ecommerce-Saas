//ARCHIVO PUENTE PARA CONECTAR FRONTEND CON BACKEND

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getToken = () => localStorage.getItem('token');

export const apiClient = {

    //PARA REALIZAR SOLICITUDES GET
    get: async <T>(endpoint: string): Promise<T> => {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
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
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
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
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
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
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error en la petición DELETE: ${response.status}`);
        }
        return response.json();
    },
};