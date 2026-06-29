import { Router } from "express";
import { PrismaRepositoryUsuario } from "../repositories/PrismaRepositoryUsuario";
import { ServicesUsuarios } from "../../application/ServicesUsuarios";
import { ControllersUsuario } from "../controllers/ControllersUsuario";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryRol } from "../repositories/PrismaRepositoryRol";
import { ServicesRol } from "../../application/ServicesRol";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";

const routerUsuario = Router();

const repositoryEmpresa = new PrismaRepositoryEmpresa();
const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);

const repositoryRol = new PrismaRepositoryRol();
const serviceRol = new ServicesRol(repositoryRol);

const repositoryUsuario = new PrismaRepositoryUsuario();
const servicesUsuario = new ServicesUsuarios(repositoryUsuario, serviceEmpresa, serviceRol);
const controllersUsuario = new ControllersUsuario(servicesUsuario);

routerUsuario.post('/crear-usuario', controllersUsuario.crearUsuario);
routerUsuario.put('actualizar-informacion-usuario', controllersUsuario.actualizarInformacionUsuario);
routerUsuario.get('/obtener-usuario-email', controllersUsuario.obtenerUsuarioEmail);
routerUsuario.get('/obtener-usuario/:id_usuario', authMiddleware, controllersUsuario.obtenerUsuarioId);

export default routerUsuario;