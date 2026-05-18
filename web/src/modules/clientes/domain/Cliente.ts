export interface Cliente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  created_at?: string;
}