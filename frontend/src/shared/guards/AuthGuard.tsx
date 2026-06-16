import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthService } from "@/core/AuthService";

export const AuthGuard = ({ children }: any) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const validate= async()=>{
            try {
                const data = await AuthService.me();
                setIsAuth(true)
            } catch (error) {
                setIsAuth(false)
            } finally{
                setLoading(false)
            }
        }
        validate()
    },[]);

    if(loading){
        return<div>Cargando...</div>
    }

    if(!isAuth){
        return <Navigate to="/auth" replace/>
    }
    return children;
}