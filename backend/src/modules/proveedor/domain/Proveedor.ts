export interface Proveedor {
    id_proveedor: number;
    id_empresa: number;
    nombre: string;
    direccion?: string | null;
    descripcion?:string | null;
    telefono?: string | null;
    email?: string | null;
    estado: boolean;
    fecha_registro: Date;
}
