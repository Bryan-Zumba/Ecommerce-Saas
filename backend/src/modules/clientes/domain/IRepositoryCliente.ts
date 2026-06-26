import { Cliente } from "./Cliente";
import { ClienteInputDTO } from "./ClienteInputDTO";
import { ClienteUpdateDTO } from "./ClienteUpdateDTO";

export interface RepositoryCliente {
    obtenerTodos(id_empresa: number): Promise<Cliente[]>;
    obtenerClienteId(id_cliente: number): Promise<Cliente | null>;
    obtenerClienteCedula(id_empresa: number, cedula: string): Promise<Cliente | null>;
    crearCliente(cliente: ClienteInputDTO): Promise<Cliente>;
    actualizarInformacionCliente(id_cliente: number, cliente: ClienteUpdateDTO): Promise<Cliente>;
    desactivarCliente(id_cliente: number): Promise<Cliente>;
    activarCliente(id_cliente: number): Promise<Cliente>;
}