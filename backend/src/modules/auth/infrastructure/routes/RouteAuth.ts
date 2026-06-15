import { Router } from "express";
import { PrismaRepositoryAccessCode } from "../repositories/PrismaRepositoryAccessCode";
import { ServicesAccessCode } from "../../application/services/ServicesAccessCode";
import { ControllerAccessCode } from "../controllers/ControllerAccessCode";

const routerAuth = Router();

const repositoryAccessCode = new PrismaRepositoryAccessCode();
const serviceAccessCode = new ServicesAccessCode(repositoryAccessCode);
const controllerAccessCode = new ControllerAccessCode(serviceAccessCode);

routerAuth.post('/validate-access-code', controllerAccessCode.validarCodigo);

export default routerAuth;