import { Router } from "express";
import { PrismaRepositoryCategoria } from "../repositories/PrismaRepositoryCategoria";
import { ServiceCategoria } from "../../application/ServiceCategoria";
import { ControllerCategoria } from "../controllers/ControllerCategoria";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";

const routerCategoria = Router();

const repositoryCategoria = new PrismaRepositoryCategoria();
const repositoryEmpresa = new PrismaRepositoryEmpresa();

const servicesEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceCategoria = new ServiceCategoria(repositoryCategoria, servicesEmpresa);


const controllerCategoria = new ControllerCategoria(serviceCategoria);


routerCategoria.get("/obtener-categorias/empresa/:id_empresa", controllerCategoria.obtenerCategorias);

routerCategoria.get("/obtener-categorias/:id_categoria", controllerCategoria.obtenerCategoriaId);

routerCategoria.post("/crear-categorias", controllerCategoria.crearCategoria);

routerCategoria.put("/actualizar-categoria/:id_categoria", controllerCategoria.actualizarCategoria);

routerCategoria.put("/desactivar-categoria/:id_categoria", controllerCategoria.desactivarCategoria);

routerCategoria.put("/activar-categoria/:id_categoria", controllerCategoria.activarCategoria);

export default routerCategoria;