import { Router } from "express";
import { PrismaRepositoryCliente } from "../repositories/PrismaRepositoryCliente";
import { ServiceCliente } from "../../application/ServicesCliente";
import { ControllerCliente } from "../controllers/ControllersCliente";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";

const routerCliente = Router();

const repositoryCliente = new PrismaRepositoryCliente();
const repositoryEmpresa = new PrismaRepositoryEmpresa();

const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceCliente = new ServiceCliente(repositoryCliente, serviceEmpresa);

const controllerCliente = new ControllerCliente(serviceCliente);

routerCliente.get('/obtener-clientes/:id_empresa', authMiddleware, controllerCliente.obtenerTodos);
routerCliente.get('/obtener-cliente/:id_cliente', authMiddleware, controllerCliente.obtenerClienteId);
routerCliente.get('/obtener-cliente-cedula/:id_empresa/:cedula', authMiddleware, controllerCliente.obtenerClienteCedula);
routerCliente.post('/crear-cliente', authMiddleware, controllerCliente.crearCliente);
routerCliente.put('/actualizar-cliente/:id_cliente', authMiddleware, controllerCliente.actualizarInformacionCliente);
routerCliente.put('/desactivar-cliente/:id_cliente', authMiddleware, controllerCliente.desactivarCliente);
routerCliente.put('/activar-cliente/:id_cliente', authMiddleware, controllerCliente.activarCliente);

export default routerCliente;