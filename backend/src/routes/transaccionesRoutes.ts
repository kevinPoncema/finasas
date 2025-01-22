import { Router } from "express";
import authMiddleware from '@middlewares/Auth';

import {
  crearTransaccion,
  actualizarTransaccion,
  borrarTransaccion,
  obtenerTransacciones,
  filtrarTransacciones
} from "@controllers/transaccionController";


const transaccionesRoutes = Router();
transaccionesRoutes.get("/transacciones/:fechaInicio/:fechaFin",authMiddleware,obtenerTransacciones)


// Crear una transacción
transaccionesRoutes.post("/transacciones", authMiddleware,crearTransaccion);

// Actualizar una transacción existente
transaccionesRoutes.put("/transacciones/:id",authMiddleware, actualizarTransaccion);
// Ruta para filtrar transacciones
transaccionesRoutes.post("/transacciones/filtrar", authMiddleware, filtrarTransacciones);
// Borrar una transaccin
transaccionesRoutes.delete("/transacciones/:id",authMiddleware, borrarTransaccion);

export default transaccionesRoutes;
