import { Router } from "express";
import authMiddleware from '@middlewares/Auth';

import {
  obtenerPresupuestos,
  crearPresupuesto,
  actualizarPresupuesto,
  borrarPresupuesto,
  obtenerPresupuestosPorCategoria,
  filtrarPresupuestos
} from "@controllers/presupuestoController";

const presupuestoRoutes = Router();

// Obtener presupuestos filtrados por subusuario y categoría
presupuestoRoutes.get("/presupuestos", authMiddleware, obtenerPresupuestos);

// Crear un nuevo presupuesto
presupuestoRoutes.post("/presupuestos", authMiddleware, crearPresupuesto);

// Actualizar un presupuesto existente
presupuestoRoutes.put("/presupuestos/:id", authMiddleware, actualizarPresupuesto);

// Borrar un presupuesto
presupuestoRoutes.delete("/presupuestos/:id", authMiddleware, borrarPresupuesto);

// Obtener presupuestos filtrados por categoría
presupuestoRoutes.get("/presupuestos/categoria/:categoriaId", authMiddleware, obtenerPresupuestosPorCategoria);

// Obtener presupuestos filtrados dinámicamente
presupuestoRoutes.post("/presupuestos/filtrar", authMiddleware, filtrarPresupuestos);

export default presupuestoRoutes;
