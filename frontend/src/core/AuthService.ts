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
    }
}