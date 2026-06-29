import { Router } from "express";
import { PrismaRepositoryItem } from "../repositories/PrismaRepositoryItem";
import { ControllerItem } from "../controllers/ControllerItem";
import { PrismaRepositoryCategoria } from "../repositories/PrismaRepositoryCategoria";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { ServiceItem } from "../../application/ServiceItem"
import { ServiceCategoria } from "../../application/ServiceCategoria";

const routerItem = Router();

const repositoryItem = new PrismaRepositoryItem();
const RepositoryCategoria = new PrismaRepositoryCategoria();
const repositoryEmpresa = new PrismaRepositoryEmpresa();


const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceCategoria = new ServiceCategoria(RepositoryCategoria, serviceEmpresa);
const serviceItem = new ServiceItem(repositoryItem, serviceEmpresa, serviceCategoria);

const controllerItem = new ControllerItem(serviceItem);

routerItem.post("/crear-item", controllerItem.crearItem);
routerItem.get("/obtener-items/empresa/:id_empresa", controllerItem.obtenerItems);
routerItem.get("/obtener-items/categoria/:id_categoria", controllerItem.obtenerItemsPorCategoria);
routerItem.get("/obtener-item/:id_item", controllerItem.obtenerItemPorId);
routerItem.put("/actualizar-item/:id_item", controllerItem.actualizarItem);
routerItem.put("/desactivar-item/:id_item", controllerItem.desactivarItem);
routerItem.put("/activar-item/:id_item", controllerItem.activarItem);

export default routerItem;
