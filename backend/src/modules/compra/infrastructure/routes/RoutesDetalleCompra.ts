import { Router } from "express";
import { PrismaRepositoryDetalleCompra } from "../repositories/PrismaRepositoryDetalleCompra";
import { ServicesDetalleCompra } from "../../application/ServicesDetalleCompra";
import { PrismaRepositoryBodega } from "../../../inventario/infrastructure/repositories/PrismaRepositoryBodega";
import { ServicesBodega } from "../../../inventario/application/ServicesBodega";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryItem } from "../../../inventario/infrastructure/repositories/PrismaRepositoryItem";
import { ServiceItem } from "../../../inventario/application/ServiceItem";
import { PrismaRepositoryCategoria } from "../../../inventario/infrastructure/repositories/PrismaRepositoryCategoria";
import { ServiceCategoria } from "../../../inventario/application/ServiceCategoria";
import { CloudinaryService } from "../../../../core/cloudinary/CloudinaryServices";
import { PrismaRepositoryInventario } from "../../../inventario/infrastructure/repositories/PrismaRepositoryInventario";
import { ServicesInventario } from "../../../inventario/application/ServicesInventario";
import { PrismaRepositoryCompra } from "../repositories/PrismaRepositoryCompra";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";
import { ControllersDetalleCompra } from "../controllers/ControllersDetalleCompra";

const routesDetalleCompra = Router();

const cloudinaryService = new CloudinaryService()
const repositoryBodega = new PrismaRepositoryBodega();
const repositoryEmpresa = new PrismaRepositoryEmpresa();
const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceBodega = new ServicesBodega(repositoryBodega, serviceEmpresa);
const repositoryDetalleCompra = new PrismaRepositoryDetalleCompra();
const repositoryItem = new PrismaRepositoryItem();
const repositoryCategoria = new PrismaRepositoryCategoria();
const repositoryInventario = new PrismaRepositoryInventario();
const serviceInventario = new ServicesInventario(repositoryInventario,serviceBodega,repositoryItem,serviceEmpresa)
const serviceCategoria = new ServiceCategoria(repositoryCategoria, serviceEmpresa);
const serviceItem = new ServiceItem(repositoryItem, serviceEmpresa,serviceCategoria,cloudinaryService,serviceInventario,serviceBodega);
const repositoryCompra= new PrismaRepositoryCompra();
const serviceDetalleCompra = new ServicesDetalleCompra(repositoryDetalleCompra,serviceBodega,serviceItem,repositoryCompra);

const controllerDetalleCompra = new ControllersDetalleCompra(serviceDetalleCompra);

routesDetalleCompra.get('/obtener-detalle-compra/:id_compra', authMiddleware, controllerDetalleCompra.obtenerDetalleCompraPorIdCompra);

export default routesDetalleCompra;