import { Router } from "express";
import { ControllersEmpresa } from "../controllers/ControllersEmpresa";
import { ServicesEmpresa } from "../../application/ServicesEmpresa";
import { PrismaRepositoryEmpresa } from "../repositories/PrismaRepositoryEmpresa";

const routerEmpresa = Router();

const repositoryEmpresa = new PrismaRepositoryEmpresa();
const servicesEmpresa = new ServicesEmpresa(repositoryEmpresa);
const controllersEmpresa = new ControllersEmpresa(servicesEmpresa);

routerEmpresa.post('/crear-empresa', controllersEmpresa.crearEmpresa);
routerEmpresa.get('/buscar-empresa/:id_empresa', controllersEmpresa.obtenerEmpresaPorId);

export default routerEmpresa;