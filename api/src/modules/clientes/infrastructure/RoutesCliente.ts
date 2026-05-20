import { Router } from "express";
import { RepositoryPrismaCliente } from "./RepositoryPrismaCliente";
import { ServiceCliente } from "../application/ServicesCliente";
import { ControllerCliente } from "./ControllersCliente";   

const routerCliente = Router();

const repositoryCliente = new RepositoryPrismaCliente();

const serviceCliente = new ServiceCliente(repositoryCliente);

const controllerCliente = new ControllerCliente(serviceCliente);

routerCliente.get('/clientes', controllerCliente.obtenerClientes);
routerCliente.post('/clientes', controllerCliente.crearCliente);
export default routerCliente;