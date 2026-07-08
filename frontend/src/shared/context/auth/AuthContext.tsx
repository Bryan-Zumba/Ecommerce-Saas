import { AuthService } from "@/modules/auth/services/AuthService";
import { LoginResponse } from "@/modules/auth/types/LoginResponse";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    usuario: Usuario | null;
    must_change_password: boolean | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    recargarUsuario: () => Promise<void>;
};

type Usuario = LoginResponse["data"]["usuario"];

const AuthContext = createContext<AuthContextType>({
    usuario: null,
    must_change_password: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
    recargarUsuario: async () => {}
});

export const AuthProvider = ({ children }: any) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [must_change_password, setMustChangePassword] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    const cargarUsuario = async () => {
        try {
            const response = await AuthService.me();
            setUsuario(response.data.usuario);
            setMustChangePassword(response.data.must_change_password);
        } catch (error: any) {
            setUsuario(null);
            setMustChangePassword(null);
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
        setMustChangePassword(null);
        localStorage.removeItem('carritoVentaLocal');
    };

    useEffect(() => {
        cargarUsuario();
    }, []);
    
    return (
        <AuthContext.Provider value={{ usuario, must_change_password, loading, login, logout, recargarUsuario: cargarUsuario }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);