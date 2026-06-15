import { Estado_empresa } from "@prisma/client";

export interface Empresa {
    id_empresa: number;
    nombre: string;
    descripcion: string | null;
    ruc: string | null;
    direccion: string | null;
    telefono: string | null;
    email: string | null;
    logo_url: string | null;
    estado_empresa: Estado_empresa;
    fecha_creacion: Date;
}