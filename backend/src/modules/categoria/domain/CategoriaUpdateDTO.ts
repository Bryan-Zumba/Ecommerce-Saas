export interface CategoriaUpdateDTO {
    id_empresa: number;
    nombre: string;
    descripcion?: string | null;
    estado: boolean;
}