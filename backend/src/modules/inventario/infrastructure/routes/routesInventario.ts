import { Router } from "express";
import { ServicesInventario } from "../../application/ServicesInventario";
import { PrismaRepositoryInventario } from "../repositories/PrismaRepositoryInventario";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { ServicesBodega } from "../../application/ServicesBodega";
import { PrismaRepositoryBodega } from "../repositories/PrismaRepositoryBodega";
import { ControllersInventario } from "../controllers/ControllersInventario";
import authMiddleware from "../../../../modules/auth/infrastructure/middleware/AuthMiddleware";
import { PrismaRepositoryItem } from "../repositories/PrismaRepositoryItem";

const routesInventario = Router();

const repositoryInventario = new PrismaRepositoryInventario();
const repositoryEmpresa = new PrismaRepositoryEmpresa();
const repositoryBodega = new PrismaRepositoryBodega();
const repositoryItem = new PrismaRepositoryItem();
const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceBodega = new ServicesBodega(repositoryBodega, serviceEmpresa);
const servicesInventario = new ServicesInventario(repositoryInventario, serviceBodega, repositoryItem, serviceEmpresa);
const controllersInventario = new ControllersInventario(servicesInventario);

routesInventario.get('/obtener-inventario-bodega', authMiddleware, controllersInventario.obtenerInventarioBodega);

export default routesInventario;