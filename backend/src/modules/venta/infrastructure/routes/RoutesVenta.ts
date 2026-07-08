import { Router } from "express";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";
import { PrismaRepositoryVenta } from "../repositories/PrismaRepositoryVenta";
import { PrismaRepositoryDetalleVenta } from "../repositories/PrismaRepositoryDetalleVenta";
import { ServicesVenta } from "../../application/ServicesVenta";
import { ServicesDetalleVenta } from "../../application/ServicesDetalleVenta";
import { ControllersVenta } from "../controllers/ControllersVenta";

// Inyecciones compartidas necesarias
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryCliente } from "../../../clientes/infrastructure/repositories/PrismaRepositoryCliente";
import { ServiceCliente } from "../../../clientes/application/ServicesCliente";
import { PrismaRepositoryItem } from "../../../inventario/infrastructure/repositories/PrismaRepositoryItem";
import { ServiceItem } from "../../../inventario/application/ServiceItem";
import { PrismaRepositoryCategoria } from "../../../inventario/infrastructure/repositories/PrismaRepositoryCategoria";
import { ServiceCategoria } from "../../../inventario/application/ServiceCategoria";
import { CloudinaryService } from "../../../../core/cloudinary/CloudinaryServices";
import { PrismaRepositoryBodega } from "../../../inventario/infrastructure/repositories/PrismaRepositoryBodega";
import { ServicesBodega } from "../../../inventario/application/ServicesBodega";
import { PrismaRepositoryInventario } from "../../../inventario/infrastructure/repositories/PrismaRepositoryInventario";
import { ServicesInventario } from "../../../inventario/application/ServicesInventario";
import { PrismaRepositoryMovimiento_Inventario } from "../../../inventario/infrastructure/repositories/PrismaRepositoryMovimiento_Inventario";
import { ServicesMovimiento_Inventario } from "../../../inventario/application/ServicesMovimiento_Inventario";
import { PrismaRepositoryMovimiento_caja } from "../../../caja/infrastructure/repository/PrismaRepositoryMovimiento_caja";
import { ServicesMovimientoCaja } from "../../../caja/application/ServicesMovimientoCaja";

const routesVenta = Router();

// 1. Inicialización de dependencias base
const repositoryEmpresa = new PrismaRepositoryEmpresa();
const servicesEmpresa = new ServicesEmpresa(repositoryEmpresa);

const repositoryCliente = new PrismaRepositoryCliente();
const serviceCliente = new ServiceCliente(repositoryCliente, servicesEmpresa);

const repositoryCategoria = new PrismaRepositoryCategoria();
const serviceCategoria = new ServiceCategoria(repositoryCategoria, servicesEmpresa);

const repositoryItem = new PrismaRepositoryItem();
const repositoryBodega = new PrismaRepositoryBodega();
const repositoryInventario = new PrismaRepositoryInventario();
const serviceBodega = new ServicesBodega(repositoryBodega, servicesEmpresa);
const serviceInventario = new ServicesInventario(repositoryInventario, serviceBodega, repositoryItem, servicesEmpresa);

const cloudinaryService = new CloudinaryService();
const serviceItem = new ServiceItem(repositoryItem, servicesEmpresa, serviceCategoria, cloudinaryService, serviceInventario, serviceBodega);

const repositoryMovimientoInventario = new PrismaRepositoryMovimiento_Inventario();
const serviceMovimientoInventario = new ServicesMovimiento_Inventario(repositoryMovimientoInventario, serviceItem, serviceBodega);

const repositoryMovimientoCaja = new PrismaRepositoryMovimiento_caja();
const serviceMovimientoCaja = new ServicesMovimientoCaja(repositoryMovimientoCaja);

// 2. Inicialización de repositorios de Venta
const repositoryVenta = new PrismaRepositoryVenta();
const repositoryDetalleVenta = new PrismaRepositoryDetalleVenta();

// 3. Inicialización de servicios de Venta
const servicesDetalleVenta = new ServicesDetalleVenta(repositoryDetalleVenta, repositoryVenta, serviceBodega, serviceItem);
const servicesVenta = new ServicesVenta(
    repositoryVenta,
    servicesDetalleVenta,
    servicesEmpresa,
    serviceCliente,
    serviceItem,
    serviceBodega,
    serviceInventario,
    serviceMovimientoInventario,
    serviceMovimientoCaja
);

// 4. Inicialización de controlador
const controllerVenta = new ControllersVenta(servicesVenta);

// 5. Configuración de endpoints
routesVenta.get("/catalogo", authMiddleware, controllerVenta.obtenerCatalogoVenta);
routesVenta.post("/crear-venta", authMiddleware, controllerVenta.crearVenta);
routesVenta.get("/obtener-ventas-empresa", authMiddleware, controllerVenta.obtenerVentasEmpresa);
routesVenta.post("/:id_venta/cancelar", authMiddleware, controllerVenta.cancelarVenta);

export default routesVenta;
export { servicesVenta, repositoryVenta }; // Para reutilización si se requiere
