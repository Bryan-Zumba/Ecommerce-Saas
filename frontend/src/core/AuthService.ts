import { apiClient } from "./apiClient";
import type { LoginResponse } from "../modules/auth/types";

export const AuthService = {

    //METODO LOGIN
    login: async (email: string, password: string): Promise<LoginResponse> => {
        return apiClient.post<LoginResponse>('/api/auth/login', { email, password });
    },

    //METODO VERIFICACION TOKEN
    me: async()=>{
        const response = apiClient.get<LoginResponse>('/api/auth/me');
        return response;
    },

    //METODO VALIDACION CODIGO ACCESO
    validarCodigoAcc: async(codigo: string): Promise<LoginResponse>=>{
        return apiClient.post<LoginResponse>('/api/auth/validate-access-code',{codigo});
    },

    //METODO SOLICITAR RECUPERACION DE PASSWORD
    forgotPassword: async(email: string): Promise<{ success: boolean; message: string }>=>{
        return apiClient.post<{ success: boolean; message: string }>('/api/auth/forgot-password',{email});
    },

    //METODO RESTABLECER PASSWORD CON TOKEN
    resetPassword: async(token: string, password: string): Promise<{ success: boolean; message: string }>=>{
        return apiClient.put<{ success: boolean; message: string }>('/api/auth/reset-password',{token, password});
    }
}
