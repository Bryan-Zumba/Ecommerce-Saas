import { Cliente } from "./Cliente";

//Define los metodos que se usaran en la Capa de Acceso a Datos para la tabla Cliente
export interface RepositoryCliente {
    obtenerTodos(): Promise<Cliente[]>;
}