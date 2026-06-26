export type ClienteInputDTO = {
    id_empresa: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
}