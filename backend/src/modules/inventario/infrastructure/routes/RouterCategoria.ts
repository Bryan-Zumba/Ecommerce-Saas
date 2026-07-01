import { Router } from "express";
import { PrismaRepositoryCategoria } from "../repositories/PrismaRepositoryCategoria";
import { ServiceCategoria } from "../../application/ServiceCategoria";
import { ControllerCategoria } from "../controllers/ControllerCategoria";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";

const routerCategoria = Router();

const repositoryCategoria = new PrismaRepositoryCategoria();
const repositoryEmpresa = new PrismaRepositoryEmpresa();

const servicesEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceCategoria = new ServiceCategoria(repositoryCategoria, servicesEmpresa);

const controllerCategoria = new ControllerCategoria(serviceCategoria);

routerCategoria.get("/obtener-categorias", authMiddleware, controllerCategoria.obtenerCategorias);
routerCategoria.get("/obtener-categoria/:id_categoria", controllerCategoria.obtenerCategoriaId);
routerCategoria.post("/crear-categoria", authMiddleware, controllerCategoria.crearCategoria);
routerCategoria.put("/actualizar-categoria/:id_categoria", controllerCategoria.actualizarCategoria);
routerCategoria.put("/desactivar-categoria/:id_categoria", controllerCategoria.desactivarCategoria);
routerCategoria.put("/activar-categoria/:id_categoria", controllerCategoria.activarCategoria);

export default routerCategoria;