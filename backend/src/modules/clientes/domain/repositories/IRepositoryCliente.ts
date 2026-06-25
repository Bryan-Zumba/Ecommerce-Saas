import { Cliente } from "../entities/Cliente";


//Define los metodos que se usaran en la Capa de Acceso a Datos para la tabla Cliente
export interface RepositoryCliente {
    obtenerTodos(id_empresa: number): Promise<Cliente[]>;
    crearCliente(cliente: Omit<Cliente, 'id_cliente' | 'created_at' | 'estado'> & { id_empresa: number, estado?: boolean }): Promise<Cliente>;
    actualizarCliente(id: number, cliente: Omit<Cliente, 'id_cliente' | 'created_at' | 'estado'> & { id_empresa: number, estado?: boolean }): Promise<Cliente>;
    eliminarCliente(id: number): Promise<Cliente>;
}