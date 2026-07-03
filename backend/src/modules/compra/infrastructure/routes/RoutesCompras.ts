import { Router } from "express";
import { PrismaRepositoryCompra } from "../repositories/PrismaRepositoryCompra";
import { ServicesCompra } from "../../application/ServicesCompra";
import { ControllersCompra } from "../controllers/ControllersCompra";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";
import { CloudinaryService } from "@/core/cloudinary/CloudinaryServices";

const routesCompra = Router();




export default routesCompra;