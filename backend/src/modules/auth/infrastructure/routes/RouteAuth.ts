import { Router } from "express";
import { PrismaRepositoryAccessCode } from "../repositories/PrismaRepositoryAccessCode";
import { ServicesAccessCode } from "../../application/services/ServicesAccessCode";
import { ControllerAccessCode } from "../controllers/ControllerAccessCode";
import { ControllersAuth } from "../controllers/ControllersAuth";
import { ServicesAuth } from "../../application/services/ServicesAuth";
import { ServicesUsuarios } from "../../../usuarios/application/ServicesUsuarios";
import { PrismaRepositoryUsuario } from "../../../usuarios/infrastructure/repositories/PrismaRepositoryUsuario";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { ServicesRol } from "../../../usuarios/application/ServicesRol";
import { PrismaRepositoryRol } from "../../../usuarios/infrastructure/repositories/PrismaRepositoryRol";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import authMiddleware from "../middleware/AuthMiddleware";
import { ServicesRegister } from "../../application/services/ServicesRegister";
import { ControllerRegister } from "../controllers/ControllersRegister";
import { PrismaRepositoryBodega } from "../../../inventario/infrastructure/repositories/PrismaRepositoryBodega";
import { ServicesBodega } from "../../../inventario/application/ServicesBodega";
import { ServicesSesion } from "../../application/services/ServicesSesion";
import { PrismaRepositorySesion } from "../repositories/PrismaRepositorySesion";
import { ServicesEmail } from "../../application/services/ServicesEmail";

const routerAuth = Router();

const repositoryAccessCode = new PrismaRepositoryAccessCode();
const serviceAccessCode = new ServicesAccessCode(repositoryAccessCode);
const controllerAccessCode = new ControllerAccessCode(serviceAccessCode);

const repositoryUsuario = new PrismaRepositoryUsuario();
const repositoryRol = new PrismaRepositoryRol();
const repositoryEmpresa = new PrismaRepositoryEmpresa();
const repositoryBodega = new PrismaRepositoryBodega();
const repositorySesion = new PrismaRepositorySesion();

const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceBodega = new ServicesBodega(repositoryBodega)
const serviceRol = new ServicesRol(repositoryRol);
const serviceUsuario = new ServicesUsuarios(repositoryUsuario, serviceEmpresa, serviceRol);
const serviceSesion = new ServicesSesion(repositorySesion);
const serviceEmail = new ServicesEmail();
const serviceAuth = new ServicesAuth(serviceUsuario, serviceSesion, serviceEmail);
const controllerAuth = new ControllersAuth(serviceAuth, serviceUsuario);

const serviceRegister = new ServicesRegister(serviceAccessCode, serviceEmpresa, serviceBodega, serviceRol, serviceUsuario);
const controllerRegister = new ControllerRegister(serviceRegister);

routerAuth.post('/validate-access-code', controllerAccessCode.validarCodigo);
routerAuth.post('/login', controllerAuth.login);
routerAuth.post('/logout', controllerAuth.logout);
routerAuth.post('/refresh-token', controllerAuth.refreshToken);
routerAuth.get('/me', authMiddleware, controllerAuth.me)
routerAuth.put('/incrementar-intento-acceso', controllerAccessCode.incrementarIntentoAcceso);
routerAuth.put('/registrar-uso-codigo', controllerAccessCode.registrarUsoCodigo);
routerAuth.post('/registrar-tienda', controllerRegister.registrarTienda);
routerAuth.post('/forgot-password', controllerAuth.forgotPassword)
routerAuth.put('/reset-password', controllerAuth.resetPassword)

export default routerAuth;