import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { Session } from "@supabase/supabase-js";

export const AuthGuard = ({ children }: any) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false)
        })
    },[]);

    if(loading){
        return<div>Cargando...</div>
    }

    if(!session){
        return <Navigate to="/auth"/>
    }
    return children;
}