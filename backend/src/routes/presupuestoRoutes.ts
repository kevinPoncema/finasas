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

/**
 * Ruta para obtener todos los presupuestos filtrados por subusuario y categoría.
 * @route GET /presupuestos
 * @query {string} categoriaId - ID de la categoría para filtrar los presupuestos (opcional).
 * @query {string} subusuarioId - ID del subusuario (extraído del token).
 * @returns {Array} 200 - Lista de presupuestos.
 * @returns {Object} 401 - Error de autenticación.
 * @returns {Object} 500 - Error en la obtención de presupuestos.
 */
presupuestoRoutes.get("/presupuestos", authMiddleware, obtenerPresupuestos);

/**
 * Ruta para crear un nuevo presupuesto.
 * @route POST /presupuestos
 * @body {string} nombre - Nombre del presupuesto.
 * @body {number} costo - Costo del presupuesto.
 * @body {string} descripcion - Descripción del presupuesto (opcional).
 * @body {number} categoriaId - ID de la categoría (opcional).
 * @returns {Object} 201 - Presupuesto creado exitosamente.
 * @returns {Object} 400 - Error de autenticación o validación.
 * @returns {Object} 404 - Categoría no encontrada.
 * @returns {Object} 500 - Error al crear el presupuesto.
 */
presupuestoRoutes.post("/presupuestos", authMiddleware, crearPresupuesto);

/**
 * Ruta para actualizar un presupuesto existente.
 * @route PUT /presupuestos/:id
 * @param {string} id - ID del presupuesto a actualizar.
 * @body {string} nombre - Nombre del presupuesto.
 * @body {number} costo - Costo del presupuesto.
 * @body {string} descripcion - Descripción del presupuesto (opcional).
 * @body {number} categoriaId - ID de la categoría (opcional).
 * @returns {Object} 200 - Presupuesto actualizado exitosamente.
 * @returns {Object} 400 - Error de autenticación o validación.
 * @returns {Object} 404 - Presupuesto no encontrado o no autorizado.
 * @returns {Object} 500 - Error al actualizar el presupuesto.
 */
presupuestoRoutes.put("/presupuestos/:id", authMiddleware, actualizarPresupuesto);

/**
 * Ruta para borrar un presupuesto.
 * @route DELETE /presupuestos/:id
 * @param {string} id - ID del presupuesto a eliminar.
 * @returns {Object} 200 - Presupuesto eliminado exitosamente.
 * @returns {Object} 400 - Error de autenticación.
 * @returns {Object} 404 - Presupuesto no encontrado o no autorizado.
 * @returns {Object} 500 - Error al borrar el presupuesto.
 */
presupuestoRoutes.delete("/presupuestos/:id", authMiddleware, borrarPresupuesto);

/**
 * Ruta para obtener presupuestos filtrados por categoría.
 * @route GET /presupuestos/categoria/:categoriaId
 * @param {string} categoriaId - ID de la categoría para filtrar los presupuestos.
 * @returns {Array} 200 - Lista de presupuestos filtrados por categoría.
 * @returns {Object} 401 - Error de autenticación.
 * @returns {Object} 404 - No se encontraron presupuestos para la categoría.
 * @returns {Object} 500 - Error al obtener los presupuestos.
 */
presupuestoRoutes.get("/presupuestos/categoria/:categoriaId", authMiddleware, obtenerPresupuestosPorCategoria);

/**
 * Ruta para filtrar presupuestos dinámicamente.
 * @route POST /presupuestos/filtrar
 * @body {string} descripcion - Descripción para buscar en los presupuestos (opcional).
 * @body {string} nombre - Nombre del presupuesto para buscar (opcional).
 * @body {string} fecha_inicio - Fecha de inicio para el filtro de fechas (opcional).
 * @body {string} fecha_fin - Fecha de fin para el filtro de fechas (opcional).
 * @body {string} order_by - Orden de los resultados ("mayor" o "menor") para ordenar por costo (opcional).
 * @body {number} costo - Costo del presupuesto para filtrar (opcional).
 * @body {number} categoria_id - ID de la categoría para filtrar (opcional).
 * @returns {Array} 200 - Lista de presupuestos filtrados.
 * @returns {Object} 400 - Error de validación de fechas.
 * @returns {Object} 404 - No se encontraron presupuestos con los filtros.
 * @returns {Object} 500 - Error al filtrar los presupuestos.
 */
presupuestoRoutes.post("/presupuestos/filtrar", authMiddleware, filtrarPresupuestos);

export default presupuestoRoutes;
