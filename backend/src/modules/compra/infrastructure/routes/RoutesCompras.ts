import { Router } from "express";
import { PrismaRepositoryCompra } from "../repositories/PrismaRepositoryCompra";
import { ServicesCompra } from "../../application/ServicesCompra";
import { ControllersCompra } from "../controllers/ControllersCompra";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";
import { CloudinaryService } from "@/core/cloudinary/CloudinaryServices";

const routesCompra = Router();

const repositoryEmpresa = new PrismaRepositoryEmpresa();
const servicesEmpresa = new ServicesEmpresa(repositoryEmpresa);
const cloudinaryService = new CloudinaryService();
const repositoryCompra = new PrismaRepositoryCompra();
const servicesCompra = new ServicesCompra(repositoryCompra, servicesEmpresa, cloudinaryService);
const controllersCompra = new ControllersCompra(servicesCompra);

routesCompra.post("/crear-compra", authMiddleware, controllersCompra.crearSolicitudCompra);

export default routesCompra;