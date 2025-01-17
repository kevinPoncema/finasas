import { Router } from "express";
import authMiddleware from '@middlewares/Auth';

import {
  crearTransaccion,
  actualizarTransaccion,
  borrarTransaccion,
  obtenerTransacciones,
} from "@controllers/transaccionController";

import {obtenerTotales} from "@controllers/StatisticsController"
const transaccionesRoutes = Router();
transaccionesRoutes.get("/transacciones/:fechaInicio/:fechaFin",authMiddleware,obtenerTransacciones)

transaccionesRoutes.get("/totales",authMiddleware,obtenerTotales)
// Crear una transacción
transaccionesRoutes.post("/transacciones", authMiddleware,crearTransaccion);

// Actualizar una transacción existente
transaccionesRoutes.put("/transacciones/:id",authMiddleware, actualizarTransaccion);

// Borrar una transacción
transaccionesRoutes.delete("/transacciones/:id",authMiddleware, borrarTransaccion);

export default transaccionesRoutes;
