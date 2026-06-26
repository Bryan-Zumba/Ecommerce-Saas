export interface ClienteUpdateDTO {
    nombres: string;
    apellidos: string;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
}