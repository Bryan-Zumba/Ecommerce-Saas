import { Router } from "express";
import { PrismaRepositoryCompra } from "../repositories/PrismaRepositoryCompra";
import { ServicesCompra } from "../../application/ServicesCompra";
import { ControllersCompra } from "../controllers/ControllersCompra";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";
import { CloudinaryService } from "../../../../core/cloudinary/CloudinaryServices";
import { PrismaRepositoryDetalleCompra } from "../repositories/PrismaRepositoryDetalleCompra";
import { ServicesDetalleCompra } from "../../application/ServicesDetalleCompra";
import { PrismaRepositoryBodega } from "../../../inventario/infrastructure/repositories/PrismaRepositoryBodega";
import { ServicesBodega } from "../../../inventario/application/ServicesBodega";
import { PrismaRepositoryItem } from "../../../inventario/infrastructure/repositories/PrismaRepositoryItem";
import { ServiceItem } from "../../../inventario/application/ServiceItem";
import { ServiceCategoria } from "../../../inventario/application/ServiceCategoria";
import { PrismaRepositoryCategoria } from "../../../inventario/infrastructure/repositories/PrismaRepositoryCategoria";
import { PrismaRepositoryProveedor } from "../../../proveedor/infrastructure/repositories/PrismaRepositoryProveedor";
import { ServiceProveedor } from "../../../proveedor/application/ServiceProveedor";
import imageUploadMiddleware from "../../../../core/middleware/imageUploadMiddleware";
import { PrismaRepositoryInventario } from "../../../inventario/infrastructure/repositories/PrismaRepositoryInventario";
import { ServicesInventario } from "../../../inventario/application/ServicesInventario";
import { PrismaRepositoryMovimiento_Inventario } from "../../../inventario/infrastructure/repositories/PrismaRepositoryMovimiento_Inventario";
import { ServicesMovimiento_Inventario } from "../../../inventario/application/ServicesMovimiento_Inventario";
import { PrismaRepositoryMovimiento_caja } from "../../../caja/infrastructure/repository/PrismaRepositoryMovimiento_caja";
import { ServicesMovimientoCaja } from "../../../caja/application/ServicesMovimientoCaja";

const routesCompra = Router();

const cloudinaryService = new CloudinaryService();

const repositoryEmpresa = new PrismaRepositoryEmpresa();
const servicesEmpresa = new ServicesEmpresa(repositoryEmpresa);
const repositoryCategoria = new PrismaRepositoryCategoria()
const serviceCategoria = new ServiceCategoria(repositoryCategoria, servicesEmpresa)
const repositoryItem = new PrismaRepositoryItem()
const repositoryBodega = new PrismaRepositoryBodega()
const repositoryInventario = new PrismaRepositoryInventario();
const serviceBodega = new ServicesBodega(repositoryBodega, servicesEmpresa)

const serviceInventario = new ServicesInventario(repositoryInventario, serviceBodega,repositoryItem,servicesEmpresa)
const serviceItem = new ServiceItem(repositoryItem, servicesEmpresa, serviceCategoria, cloudinaryService, serviceInventario, serviceBodega)
const repositoryProveedor = new PrismaRepositoryProveedor();
const serviceProveedor = new ServiceProveedor(repositoryProveedor, servicesEmpresa)
const repositoryDetalleCompra = new PrismaRepositoryDetalleCompra();
const repositoryCompra = new PrismaRepositoryCompra();
const servicesDetalleCompra = new ServicesDetalleCompra(repositoryDetalleCompra, serviceBodega, serviceItem,repositoryCompra);

const repositoryMovimientoInventario = new PrismaRepositoryMovimiento_Inventario();
const serviceMovimientoInventario = new ServicesMovimiento_Inventario(repositoryMovimientoInventario, serviceItem, serviceBodega);
const repositoryMovimientoCaja = new PrismaRepositoryMovimiento_caja();
const serviceMovimientoCaja = new ServicesMovimientoCaja(repositoryMovimientoCaja);

const serviceCompra = new ServicesCompra(repositoryCompra, servicesDetalleCompra, servicesEmpresa, serviceProveedor,cloudinaryService,serviceInventario,
    serviceMovimientoInventario,
    serviceMovimientoCaja
)
const controllerCompra = new ControllersCompra(serviceCompra)

routesCompra.post('/crear-solicitud-compra', authMiddleware,imageUploadMiddleware.single('imagen'),controllerCompra.crearSolicitudCompra);
routesCompra.get('/obtener-compras-empresa', authMiddleware,controllerCompra.obtenerComprasEmpresa);
routesCompra.post('/:id_compra/aprobar', authMiddleware, controllerCompra.aprobarCompra);
routesCompra.post('/:id_compra/rechazar', authMiddleware, controllerCompra.rechazarCompra);

export default routesCompra;