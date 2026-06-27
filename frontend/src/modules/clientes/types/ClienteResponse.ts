export interface ClienteResponse {
    clientes: {
        id_cliente: number;
        id_empresa: number;
        nombres: string;
        apellidos: string;
        cedula: string;
        email: string;
        telefono: string;
        direccion: string;
        created_at: string;
    }
}