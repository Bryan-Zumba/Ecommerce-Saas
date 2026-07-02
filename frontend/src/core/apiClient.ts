//ARCHIVO PUENTE PARA CONECTAR FRONTEND CON BACKEND

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010';

// Variables para gestionar la cola y estado del refresco del token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: () => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: Error | null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

const request = async <T>(endpoint: string, options: RequestInit): Promise<T> => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        // Si devuelve 401 y no es la petición de login, refresh-token ni me (verificación de sesión), intentamos refrescar el token
        if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/refresh-token') && !endpoint.includes('/api/auth/me')) {
            if (isRefreshing) {
                // Si ya hay un refresco en curso, encolamos la petición
                return new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => request<T>(endpoint, options))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                // Petición al backend para refrescar el access_token usando las cookies httpOnly
                const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!refreshResponse.ok) {
                    throw new Error('Refresh token inválido o expirado');
                }

                isRefreshing = false;
                processQueue(null);

                // Reintentar la petición original
                return request<T>(endpoint, options);
            } catch (refreshError: any) {
                isRefreshing = false;
                processQueue(refreshError);
                // Si falla el refresco, limpiamos la sesión redirigiendo al login
                window.location.href = '/auth';
                throw refreshError;
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error en la petición: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};

export const apiClient = {

    //PARA REALIZAR SOLICITUDES GET
    get: async <T>(endpoint: string): Promise<T> => {
        return request<T>(endpoint, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },

    //PARA REALIZAR SOLICITUDES POST
    post: async <T>(endpoint: string, data: unknown): Promise<T> => {
        const isFormData = data instanceof FormData;
        const headers: HeadersInit = {};
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return request<T>(endpoint, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: isFormData ? data : JSON.stringify(data),
        });
    },

    //PARA REALIZAR SOLICITUDES PUT
    put: async <T>(endpoint: string, data: unknown): Promise<T> => {
        const isFormData = data instanceof FormData;
        const headers: HeadersInit = {};
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return request<T>(endpoint, {
            method: 'PUT',
            credentials: 'include',
            headers,
            body: isFormData ? data : JSON.stringify(data),
        });
    },

    //PARA REALIZAR SOLICITUDES DELETE
    delete: async <T>(endpoint: string): Promise<T> => {
        return request<T>(endpoint, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },
};