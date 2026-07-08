import { Router } from "express";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";
import { PrismaRepositoryDetalleVenta } from "../repositories/PrismaRepositoryDetalleVenta";
import { PrismaRepositoryVenta } from "../repositories/PrismaRepositoryVenta";
import { ServicesDetalleVenta } from "../../application/ServicesDetalleVenta";
import { ControllersDetalleVenta } from "../controllers/ControllersDetalleVenta";

// Inyecciones compartidas necesarias
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryItem } from "../../../inventario/infrastructure/repositories/PrismaRepositoryItem";
import { ServiceItem } from "../../../inventario/application/ServiceItem";
import { PrismaRepositoryCategoria } from "../../../inventario/infrastructure/repositories/PrismaRepositoryCategoria";
import { ServiceCategoria } from "../../../inventario/application/ServiceCategoria";
import { CloudinaryService } from "../../../../core/cloudinary/CloudinaryServices";
import { PrismaRepositoryBodega } from "../../../inventario/infrastructure/repositories/PrismaRepositoryBodega";
import { ServicesBodega } from "../../../inventario/application/ServicesBodega";
import { PrismaRepositoryInventario } from "../../../inventario/infrastructure/repositories/PrismaRepositoryInventario";
import { ServicesInventario } from "../../../inventario/application/ServicesInventario";

const routesDetalleVenta = Router();

const repositoryEmpresa = new PrismaRepositoryEmpresa();
const servicesEmpresa = new ServicesEmpresa(repositoryEmpresa);
const repositoryCategoria = new PrismaRepositoryCategoria();
const serviceCategoria = new ServiceCategoria(repositoryCategoria, servicesEmpresa);
const repositoryItem = new PrismaRepositoryItem();
const repositoryBodega = new PrismaRepositoryBodega();
const repositoryInventario = new PrismaRepositoryInventario();
const serviceBodega = new ServicesBodega(repositoryBodega, servicesEmpresa);
const serviceInventario = new ServicesInventario(repositoryInventario, serviceBodega, repositoryItem, servicesEmpresa);
const cloudinaryService = new CloudinaryService();
const serviceItem = new ServiceItem(repositoryItem, servicesEmpresa, serviceCategoria, cloudinaryService, serviceInventario, serviceBodega);

const repositoryDetalleVenta = new PrismaRepositoryDetalleVenta();
const repositoryVenta = new PrismaRepositoryVenta();

const servicesDetalleVenta = new ServicesDetalleVenta(repositoryDetalleVenta, repositoryVenta, serviceBodega, serviceItem);
const controllerDetalleVenta = new ControllersDetalleVenta(servicesDetalleVenta);

routesDetalleVenta.get("/obtener-detalle-venta/:id_venta", authMiddleware, controllerDetalleVenta.obtenerDetalleVentaPorIdVenta);

export default routesDetalleVenta;
