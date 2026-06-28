import { AuthService } from "@/modules/auth/services/AuthService";
import { LoginResponse } from "@/modules/auth/types/LoginResponse";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    usuario: Usuario | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

type Usuario = LoginResponse["data"]["usuario"];

const AuthContext = createContext<AuthContextType>({
    usuario: null,
    loading: true,
    login: async () => {},
    logout: async () => {}
});

export const AuthProvider = ({ children }: any) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    const cargarUsuario = async () => {
        try {
            const response = await AuthService.me();
            setUsuario(response.data.usuario);
        } catch (error: any) {
            setUsuario(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        await AuthService.login(email, password);
        await cargarUsuario();
    };

    const logout = async () => {
        await AuthService.logout();
        setUsuario(null);
    };

    useEffect(() => {
        cargarUsuario();
    }, []);
    
    return (
        <AuthContext.Provider value={{ usuario, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);