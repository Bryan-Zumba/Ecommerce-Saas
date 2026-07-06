import { Router } from "express";
import { PrismaRepositoryMovimiento_Inventario } from "../repositories/PrismaRepositoryMovimiento_Inventario";
import { ServicesMovimiento_Inventario } from "../../application/ServicesMovimiento_Inventario";
import { ServiceItem } from "../../application/ServiceItem";
import { ServicesBodega } from "../../application/ServicesBodega";
import { PrismaRepositoryItem } from "../repositories/PrismaRepositoryItem";
import { PrismaRepositoryBodega } from "../repositories/PrismaRepositoryBodega";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryCategoria } from "../repositories/PrismaRepositoryCategoria";
import { ServiceCategoria } from "../../application/ServiceCategoria";
import { CloudinaryService } from "../../../../core/cloudinary/CloudinaryServices";
import { PrismaRepositoryInventario } from "../repositories/PrismaRepositoryInventario";
import { ServicesInventario } from "../../application/ServicesInventario";
import { ControllersMovimiento_Inventario } from "../controllers/ControllersMovimiento_Inventario";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";
const routerMovimiento_Inventario = Router();

const repositoryMovimiento_Inventario = new PrismaRepositoryMovimiento_Inventario();
const repositoryItem = new PrismaRepositoryItem();
const repositoryBodega = new PrismaRepositoryBodega();
const repositoryEmpresa = new PrismaRepositoryEmpresa();
const repositoryCategoria = new PrismaRepositoryCategoria();
const repositoryInventario = new PrismaRepositoryInventario();

const cloudinaryService = new CloudinaryService();
const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceBodega = new ServicesBodega(repositoryBodega,serviceEmpresa);
const serviceCategoria = new ServiceCategoria(repositoryCategoria,serviceEmpresa);
const serviceInventario = new ServicesInventario(repositoryInventario,serviceBodega,repositoryItem, serviceEmpresa)
const serviceItem = new ServiceItem(repositoryItem,serviceEmpresa,serviceCategoria,cloudinaryService,serviceInventario,serviceBodega);

const serviceMovimientoInventario= new ServicesMovimiento_Inventario(repositoryMovimiento_Inventario, serviceItem, serviceBodega);
const controllerMovimientoInventario = new ControllersMovimiento_Inventario(serviceMovimientoInventario);

routerMovimiento_Inventario.get('/obtener-movimientos-inventario-bodega/:id_bodega', authMiddleware, controllerMovimientoInventario.obtenerMovimientoInventarioBodega);
routerMovimiento_Inventario.get('/obtener-movimientos-inventario-id/:id_movimiento_inventario',authMiddleware,controllerMovimientoInventario.obtenerMovimientoInventarioId);
routerMovimiento_Inventario.get('/obtener-movimientos-inventario-item/:id_item',authMiddleware,controllerMovimientoInventario.obtenerMovimientoInventarioItem);

export default routerMovimiento_Inventario