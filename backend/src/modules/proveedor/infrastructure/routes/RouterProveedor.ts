import { Router } from "express";
import { ServiceProveedor } from "../../application/ServiceProveedor";
import { ControllerProveedores } from "../controllers/ControllerProveedores";
import { PrismaRepositoryProveedor } from "../repositories/PrismaRepositoryProveedor";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";

const routerProveedor = Router();

const repositoryProveedor = new PrismaRepositoryProveedor();
const repositoryEmpresa = new PrismaRepositoryEmpresa();

const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceProveedor = new ServiceProveedor(repositoryProveedor, serviceEmpresa);

const controllerProveedor = new ControllerProveedores(serviceProveedor);

routerProveedor.get("/obtener-proveedores", authMiddleware,controllerProveedor.obtenerProveedores);
routerProveedor.get("/obtener-proveedor/:id_proveedor", controllerProveedor.obtenerProveedorPorId);
routerProveedor.post("/crear-proveedor", authMiddleware,controllerProveedor.crearProveedor);
routerProveedor.put("/actualizar-proveedor/:id_proveedor", controllerProveedor.actualizarProveedor);
routerProveedor.put("/activar-proveedor/:id_proveedor", controllerProveedor.activarProveedor);
routerProveedor.put("/desactivar-proveedor/:id_proveedor", controllerProveedor.desactivarProveedor);

export default routerProveedor;