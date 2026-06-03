import { Rol } from '../../domain/RolesTypes';

export const mockRoles: Rol[] = [
  {
    id_rol: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso total a todas las funcionalidades y configuraciones del sistema.',
    estado: true,
    permisos: [
      { modulo: 'Usuarios', acciones: ['Crear', 'Editar', 'Eliminar', 'Ver', 'Asignar Rol'] },
      { modulo: 'Inventario', acciones: ['Crear', 'Editar', 'Eliminar', 'Ver', 'Ajustar Stock'] },
      { modulo: 'Ventas', acciones: ['Registrar', 'Anular', 'Ver', 'Reembolsar'] },
      { modulo: 'Reportes', acciones: ['Ver Todos', 'Exportar'] },
    ]
  },
  {
    id_rol: 2,
    nombre: 'Supervisor',
    descripcion: 'Supervisa las operaciones diarias, inventarios y ventas, pero sin acceso a configuración de sistema.',
    estado: true,
    permisos: [
      { modulo: 'Usuarios', acciones: ['Ver'] },
      { modulo: 'Inventario', acciones: ['Crear', 'Editar', 'Ver'] },
      { modulo: 'Ventas', acciones: ['Registrar', 'Anular', 'Ver'] },
      { modulo: 'Reportes', acciones: ['Ver Operativos', 'Exportar'] },
    ]
  },
  {
    id_rol: 3,
    nombre: 'Cajero',
    descripcion: 'Encargado exclusivamente de registrar ventas y manejar la caja asignada.',
    estado: true,
    permisos: [
      { modulo: 'Usuarios', acciones: [] },
      { modulo: 'Inventario', acciones: ['Ver'] },
      { modulo: 'Ventas', acciones: ['Registrar', 'Ver propias'] },
      { modulo: 'Reportes', acciones: ['Cierre de caja'] },
    ]
  }
];
