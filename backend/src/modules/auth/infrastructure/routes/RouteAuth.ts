import { Router } from "express";
import { PrismaRepositoryAccessCode } from "../repositories/PrismaRepositoryAccessCode";
import { ServicesAccessCode } from "../../application/services/ServicesAccessCode";
import { ControllerAccessCode } from "../controllers/ControllerAccessCode";
import { ControllersAuth } from "../controllers/ControllersAuth";
import { ServicesAuth } from "../../application/services/ServicesAuth";
import { ServicesUsuarios } from "../../../usuarios/application/ServicesUsuarios";
import { PrismaRepositoryUsuario } from "../../../usuarios/infrastructure/repositories/PrismaRepositoryUsuario";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { ServicesRol } from "../../../rol/application/ServicesRol";
import { PrismaRepositoryRol } from "../../../rol/infrastructure/repositories/PrismaRepositoryRol";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import authMiddleware from "../middleware/AuthMiddleware";
import { ServicesRegister } from "../../application/services/ServicesRegister";
import { ControllerRegister } from "../controllers/ControllersRegister";
import { PrismaRepositoryBodega } from "../../../bodega/infrastructure/repositories/PrismaRepositoryBodega";
import { ServicesBodega } from "../../../bodega/application/ServicesBodega";

const routerAuth = Router();

const repositoryAccessCode = new PrismaRepositoryAccessCode();
const serviceAccessCode = new ServicesAccessCode(repositoryAccessCode);
const controllerAccessCode = new ControllerAccessCode(serviceAccessCode);

const repositoryUsuario= new PrismaRepositoryUsuario();
const repositoryRol= new PrismaRepositoryRol();
const repositoryEmpresa= new PrismaRepositoryEmpresa();
const repositoryBodega = new PrismaRepositoryBodega();

const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceBodega = new ServicesBodega(repositoryBodega,serviceEmpresa)
const serviceRol = new ServicesRol(repositoryRol);
const serviceUsuario= new ServicesUsuarios(repositoryUsuario, serviceEmpresa, serviceRol);
const serviceAuth = new ServicesAuth(serviceUsuario);
const controllerAuth = new ControllersAuth(serviceAuth, serviceUsuario);

const serviceRegister = new ServicesRegister(serviceAccessCode,serviceEmpresa,serviceBodega,serviceRol,serviceUsuario);
const controllerRegister = new ControllerRegister(serviceRegister);

routerAuth.post('/validate-access-code', controllerAccessCode.validarCodigo);
routerAuth.post('/login', controllerAuth.login)
routerAuth.get('/me', authMiddleware, controllerAuth.me)
routerAuth.put('/incrementar-intento-acceso', controllerAccessCode.incrementarIntentoAcceso);
routerAuth.put('/registrar-uso-codigo', controllerAccessCode.registrarUsoCodigo);
routerAuth.post('/registrar-tienda', controllerRegister.registrarTienda);

export default routerAuth;