import { Router } from "express";
import { PrismaRepositoryCompra } from "../repositories/PrismaRepositoryCompr";
import { ServicesCompra } from "../../application/ServicesCompra";
import { ControllersCompra } from "../controllers/ControllersCompra";

const routesCompra = Router();

const repositoryCompra = new PrismaRepositoryCompra();
const servicesCompra = new ServicesCompra(repositoryCompra);
const controllersCompra = new ControllersCompra(servicesCompra);

routesCompra.post("/crear-solicitud-compra",controllersCompra.crearSolicitudCompra);

export default routesCompra