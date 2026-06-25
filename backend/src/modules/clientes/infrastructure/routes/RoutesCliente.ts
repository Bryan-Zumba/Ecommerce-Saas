import { Router } from "express";
import { RepositoryPrismaCliente } from "../repositories/RepositoryPrismaCliente";
import { ServiceCliente } from "../../application/ServicesCliente";
import { ControllerCliente } from "../controllers/ControllersCliente";

const routerCliente = Router();

const repositoryCliente = new RepositoryPrismaCliente();

const serviceCliente = new ServiceCliente(repositoryCliente);

const controllerCliente = new ControllerCliente(serviceCliente);

routerCliente.get('/obtener-clientes/:id_empresa', controllerCliente.obtenerClientes);
routerCliente.post('/crear-cliente', controllerCliente.crearCliente);
routerCliente.put('/actualizar-cliente/:id_cliente', controllerCliente.actualizarCliente);
routerCliente.delete('/eliminar-cliente/:id_cliente', controllerCliente.eliminarCliente);
export default routerCliente;