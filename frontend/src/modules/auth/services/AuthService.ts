import { apiClient } from "../../../core/apiClient";
import type { LoginResponse } from "../types/LoginResponse";
import { RegisterTiendaRequest, RegisterTiendaResponse } from "../types/RegisterTienda";

export const AuthService = {

    //METODO LOGIN
    login: async (email: string, password: string): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse>('/api/auth/login', { email, password });
    },

    //METODO CERRAR SESION
    logout: async (): Promise<void> => {
        await apiClient.post('/api/auth/logout', {});
    },

    //METODO VERIFICACION TOKEN
    me: async () => {
        const response = apiClient.get<LoginResponse>('/api/auth/me');
        return response;
    },

    //METODO VALIDACION CODIGO ACCESO
    validarCodigoAcc: async (codigo: string): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse>('/api/auth/validate-access-code', { codigo });
    },

    //METODO SOLICITAR RECUPERACION DE PASSWORD
    forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
        return apiClient.post<{ success: boolean; message: string }>('/api/auth/forgot-password', { email });
    },

    //METODO RESTABLECER PASSWORD CON TOKEN
    resetPassword: async (token: string, password: string): Promise<{ success: boolean; message: string }> => {
        return apiClient.put<{ success: boolean; message: string }>('/api/auth/reset-password', { token, password });
    },

    //METODO REGISTRAR TIENDA
    registerTienda: async (data: RegisterTiendaRequest): Promise<RegisterTiendaResponse> => {
        return apiClient.post<RegisterTiendaResponse>('/api/auth/registrar-tienda', data);
    },
}
