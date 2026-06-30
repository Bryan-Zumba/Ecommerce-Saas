export interface ClienteResponse {
    success: boolean;
    clientes: {
        id_cliente: number;
        id_empresa: number;
        nombres: string;
        apellidos: string;
        cedula: string;
        email: string | null;
        telefono: string | null;
        direccion: string | null;
        estado: boolean;
        created_at: string;
    }[];
}