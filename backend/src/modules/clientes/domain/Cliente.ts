//Definimos la clase Cliente para poder manipular la informacion
//que mandaremos a la Base de Datos

export interface Cliente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  created_at: Date;
}