export interface Cliente {
  id_cliente: number;
  id_empresa:number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  created_at?: string;
}