import { Router } from "express"; 
import authMiddleware from '@middlewares/Auth';

import {
  crearTransaccion,
  actualizarTransaccion,
  borrarTransaccion,
  obtenerTransacciones,
  filtrarTransacciones,
  obtenerTransaccionesSinFechas
} from "@controllers/transaccionController";

const transaccionesRoutes = Router();

/**
 * Ruta para obtener transacciones en un rango de fechas.
 * @method GET
 * @url /transacciones/:fechaInicio/:fechaFin
 * @param {fechaInicio} - Fecha de inicio del rango (YYYY-MM-DD).
 * @param {fechaFin} - Fecha de fin del rango (YYYY-MM-DD).
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @description Obtiene todas las transacciones dentro del rango de fechas para el subusuario autenticado.
 * @response 200 - Transacciones obtenidas exitosamente.
 * @response 400 - Fechas inválidas o falta de parámetros.
 * @response 401 - Usuario no autenticado.
 * @response 500 - Error interno al obtener las transacciones.
 */
transaccionesRoutes.get("/transacciones/:fechaInicio/:fechaFin", authMiddleware, obtenerTransacciones);

/**
 * Ruta para obtener todas las transacciones sin aplicar filtro de fechas.
 * @method GET
 * @url /transacciones/
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @description Obtiene todas las transacciones del subusuario autenticado sin filtro de fechas.
 * @response 200 - Transacciones obtenidas exitosamente.
 * @response 401 - Usuario no autenticado.
 * @response 500 - Error interno al obtener las transacciones.
 */
transaccionesRoutes.get("/transacciones/", authMiddleware, obtenerTransaccionesSinFechas);

/**
 * Ruta para crear una nueva transacción.
 * @method POST
 * @url /transacciones
 * @body { 
 *   tipo: string, // "ingreso" o "egreso"
 *   monto: number,
 *   titulo: string,
 *   descripcion?: string,
 *   categoriaId?: number
 * }
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @description Crea una nueva transacción para el subusuario autenticado.
 * @response 201 - Transacción creada exitosamente.
 * @response 400 - Error de validación o falta de datos.
 * @response 404 - Categoría no encontrada (si se proporciona un id de categoría).
 * @response 500 - Error interno al crear la transacción.
 */
transaccionesRoutes.post("/transacciones", authMiddleware, crearTransaccion);

/**
 * Ruta para actualizar una transacción existente.
 * @method PUT
 * @url /transacciones/:id
 * @param {id} - ID de la transacción a actualizar.
 * @body { 
 *   tipo: string, // "ingreso" o "egreso"
 *   monto: number,
 *   titulo: string,
 *   descripcion?: string,
 *   categoriaId?: number
 * }
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @description Actualiza los detalles de una transacción existente para el subusuario autenticado.
 * @response 200 - Transacción actualizada exitosamente.
 * @response 400 - Error de validación.
 * @response 404 - Transacción no encontrada o no autorizada.
 * @response 500 - Error interno al actualizar la transacción.
 */
transaccionesRoutes.put("/transacciones/:id", authMiddleware, actualizarTransaccion);

/**
 * Ruta para filtrar transacciones con criterios específicos.
 * @method POST
 * @url /transacciones/filtrar
 * @body { 
 *   descripcion?: string,
 *   titulo?: string,
 *   tipo?: string, // "ingreso" o "egreso"
 *   categoria_id?: number,
 *   monto?: number,
 *   fecha_inicio?: string, // Fecha de inicio (YYYY-MM-DD)
 *   fecha_fin?: string, // Fecha de fin (YYYY-MM-DD)
 *   order_by?: string // "mayor" o "menor" para ordenar por monto
 *   tokenData: { subusuario_id: number }
 * }
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @description Filtra las transacciones basadas en los parámetros proporcionados.
 * @response 200 - Transacciones filtradas exitosamente.
 * @response 400 - Parámetros inválidos.
 * @response 404 - No se encontraron transacciones con los filtros dados.
 * @response 500 - Error interno al filtrar las transacciones.
 */
transaccionesRoutes.post("/transacciones/filtrar", authMiddleware, filtrarTransacciones);

/**
 * Ruta para borrar una transacción.
 * @method DELETE
 * @url /transacciones/:id
 * @param {id} - ID de la transacción a eliminar.
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @description Elimina una transacción específica del subusuario autenticado.
 * @response 200 - Transacción eliminada exitosamente.
 * @response 404 - Transacción no encontrada o no autorizada.
 * @response 500 - Error interno al borrar la transacción.
 */
transaccionesRoutes.delete("/transacciones/:id", authMiddleware, borrarTransaccion);

export default transaccionesRoutes;
