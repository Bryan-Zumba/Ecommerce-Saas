import { Usuario } from '../../domain/UsuariosTypes';

export const mockUsuarios: Usuario[] = [
  {
    id_usuario: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@empresa.com',
    telefono: '0991234567',
    estado: true,
    id_rol: 1,
    rol_nombre: 'Administrador'
  },
  {
    id_usuario: 2,
    nombre: 'María',
    apellido: 'Gómez',
    email: 'maria.gomez@empresa.com',
    telefono: '0987654321',
    estado: true,
    id_rol: 2,
    rol_nombre: 'Supervisor'
  },
  {
    id_usuario: 3,
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@empresa.com',
    telefono: '0971122334',
    estado: false,
    id_rol: 3,
    rol_nombre: 'Cajero'
  },
  {
    id_usuario: 4,
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@empresa.com',
    telefono: '0965566778',
    estado: true,
    id_rol: 3,
    rol_nombre: 'Cajero'
  }
];
