export interface RegisterTiendaRequest {
    codigo_acceso: string;
    empresa: {
        nombre: string;
        descripcion?: string;
        ruc: string;
        direccion?: string;
        telefono?: string;
        email?: string;
        logo_url?: string;
    };
    bodega: {
        nombre: string;
        ubicacion?: string;
        descripcion?: string;
    };
    usuario: {
        nombre: string;
        apellido: string;
        telefono?: string;
        email: string;
        password: string;
    }
}

export interface RegisterTiendaResponse {
    success: boolean;
    message: string;
}