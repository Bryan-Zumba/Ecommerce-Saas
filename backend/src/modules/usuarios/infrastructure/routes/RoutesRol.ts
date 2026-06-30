import { Router } from "express";
import { PrismaRepositoryRol } from "../repositories/PrismaRepositoryRol";
import { ServicesRol } from "../../application/ServicesRol";
import { ControllersRol } from "../controllers/ControllersRol";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";

const routerRol = Router();

const repositoryRol = new PrismaRepositoryRol();
const servicesRol = new ServicesRol(repositoryRol);
const controllersRol = new ControllersRol(servicesRol);

routerRol.get('/obtener-roles', authMiddleware, controllersRol.obtenerRoles);
routerRol.get('/obtener-rol-id/:id_rol', authMiddleware, controllersRol.obtenerRolPorId);
routerRol.get('/obtener-rol-nombre/:nombre', authMiddleware, controllersRol.obtenerRolPorNombre);
routerRol.get('/obtener-permisos-rol/:nombre', authMiddleware, controllersRol.obtenerPermisosRol);
export default routerRol;