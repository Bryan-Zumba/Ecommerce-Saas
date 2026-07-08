import { Router } from "express";
import { PrismaRepositoryMovimiento_caja } from "../repository/PrismaRepositoryMovimiento_caja";
import { ServicesMovimientoCaja } from "../../application/ServicesMovimientoCaja";
import { ControllerMovimiento_caja } from "../controllers/ControllersMovimiento_caja";
import authMiddleware from "../../../../modules/auth/infrastructure/middleware/AuthMiddleware";

const routerMovimientoCaja = Router();

const repository = new PrismaRepositoryMovimiento_caja();
const service = new ServicesMovimientoCaja(repository);
const controller = new ControllerMovimiento_caja(service);

// Rutas protegidas por autenticacion
routerMovimientoCaja.get(
  "/obtener-movimientos",
  authMiddleware,
  controller.obtenerMovimientos_cajaPorEmpresa.bind(controller)
);
routerMovimientoCaja.get(
  "/obtener-movimiento/:id_movimiento_caja",
  authMiddleware,
  controller.obtenerMovimiento_cajaPorId.bind(controller)
);

export default routerMovimientoCaja;
