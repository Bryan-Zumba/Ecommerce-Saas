export interface ProveedorInputDTO {
    id_empresa: number;
    nombre: string;
    direccion?: string | null;
    descripcion?:string | null;
    telefono?: string | null;
    email?: string | null;
}