export interface Bodega{
    id_bodega: number,
    id_empresa: number,
    nombre: string,
    descripcion: string | null,
    ubicacion: string | null,
    estado: boolean,
    fecha_registro: Date
}