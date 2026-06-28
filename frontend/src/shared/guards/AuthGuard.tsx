import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

export const AuthGuard = () => {
    const { usuario, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>
    }

    if (!usuario) {
        return <Navigate to="/auth" replace />
    }
    return <Outlet />;
}