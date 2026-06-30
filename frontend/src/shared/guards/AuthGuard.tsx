import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

export const AuthGuard = () => {
    const { usuario, must_change_password, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Cargando...</div>
    }

    if (!usuario) {
        return <Navigate to="/auth" replace />
    }

    if (must_change_password && location.pathname !== '/auth/primer-acceso') {
        return <Navigate to="/auth/primer-acceso" replace />
    }

    if (!must_change_password && location.pathname === '/auth/primer-acceso') {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
}