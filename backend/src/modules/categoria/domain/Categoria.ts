export interface Categoria {
    id_categoria: number;
    id_empresa: number;
    nombre: string;
    descripcion?: string | null;
    estado: boolean;
}
