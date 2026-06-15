import { Router } from "express";
import { PrismaRepositoryRol } from "../repositories/PrismaRepositoryRol";
import { ServicesRol } from "../../application/ServicesRol";
import { ControllersRol } from "../controllers/ControllersRol";

const routerRol = Router();

const repositoryRol = new PrismaRepositoryRol();
const servicesRol = new ServicesRol(repositoryRol);
const controllersRol = new ControllersRol(servicesRol);

routerRol.get('/obtener-roles', controllersRol.obtenerRoles);
routerRol.get('/obtener-rol-id/:id_rol', controllersRol.obtenerRolPorId);
routerRol.get('/obtener-rol-nombre/:nombre', controllersRol.obtenerRolPorNombre);

export default routerRol;