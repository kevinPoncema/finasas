import { Router } from "express";
import {
  crearTP,
  obtenerTPs,
  actualizarTP,
  eliminarTP,
  filtrarTransaccionesProgramadas
} from "@controllers/programerTranssaccionController";
import authMiddleware from "@middlewares/Auth";

const programerTranssaccionRouter = Router();

/**
 * Ruta para crear una nueva transacción programada
 * @route POST /transacciones-programadas
 * @param {object} body - El cuerpo de la solicitud debe incluir:
 *    - tipo: string
 *    - titulo: string
 *    - descripcion: string (opcional)
 *    - monto: number
 *    - categoriaId: number (opcional)
 *    - recurrente: boolean
 *    - fecha: string (fecha de la transacción)
 *    - periodo: string ("diario", "semanal", "mensual", "anual", "15enal")
 *    - cantidadRepeticiones: number (opcional)
 * @returns {object} 201 - La nueva transacción programada
 * @returns {object} 400 - Si los datos son inválidos
 * @returns {object} 500 - Error interno del servidor
 */
programerTranssaccionRouter.post("/transacciones-programadas", authMiddleware, crearTP);

/**
 * Ruta para obtener todas las transacciones programadas de un subusuario
 * @route GET /transacciones-programadas
 * @returns {array} 200 - Lista de transacciones programadas
 * @returns {object} 401 - Si no está autenticado
 * @returns {object} 500 - Error interno del servidor
 */
programerTranssaccionRouter.get("/transacciones-programadas", authMiddleware, obtenerTPs);

/**
 * Ruta para actualizar una transacción programada
 * @route PUT /transacciones-programadas/:transaccionesProgramadasId
 * @param {string} transaccionesProgramadasId - ID de la transacción programada a actualizar
 * @param {object} body - El cuerpo de la solicitud debe incluir:
 *    - tipo: string
 *    - titulo: string
 *    - descripcion: string (opcional)
 *    - monto: number
 *    - categoriaId: number (opcional)
 *    - recurrente: boolean
 *    - fecha: string (fecha de la transacción)
 *    - periodo: string ("diario", "semanal", "mensual", "anual", "15enal")
 *    - cantidadRepeticiones: number (opcional)
 * @returns {object} 200 - La transacción programada actualizada
 * @returns {object} 401 - Si no está autorizado para modificar la transacción
 * @returns {object} 404 - Si no se encuentra la transacción
 * @returns {object} 500 - Error interno del servidor
 */
programerTranssaccionRouter.put("/transacciones-programadas/:transaccionesProgramadasId", authMiddleware, actualizarTP);

/**
 * Ruta para eliminar una transacción programada
 * @route DELETE /transacciones-programadas/:transaccionesProgramadasId
 * @param {string} transaccionesProgramadasId - ID de la transacción programada a eliminar
 * @returns {object} 200 - Mensaje de éxito
 * @returns {object} 401 - Si no está autorizado para eliminar la transacción
 * @returns {object} 404 - Si no se encuentra la transacción
 * @returns {object} 500 - Error interno del servidor
 */
programerTranssaccionRouter.delete("/transacciones-programadas/:transaccionesProgramadasId", authMiddleware, eliminarTP);

/**
 * Ruta para filtrar transacciones programadas
 * @route POST /transacciones-programadas/filtrar
 * @param {object} body - El cuerpo de la solicitud puede incluir:
 *    - titulo: string (opcional)
 *    - descripcion: string (opcional)
 *    - tipo: string ("ingreso" o "egreso", opcional)
 *    - categoria_id: number (opcional)
 *    - recurrente: boolean (opcional)
 *    - fecha_inicio: string (fecha, opcional)
 *    - fecha_fin: string (fecha, opcional)
 *    - periodo: string (opcional, ejemplo: "diario", "semanal", "mensual")
 *    - order_by: string ("mayor" o "menor", para ordenar por monto, opcional)
 * @returns {array} 200 - Lista de transacciones programadas que coinciden con los filtros
 * @returns {object} 400 - Si hay error en los parámetros de entrada
 * @returns {object} 404 - Si no se encuentran transacciones con los filtros
 * @returns {object} 500 - Error interno del servidor
 */
programerTranssaccionRouter.post("/transacciones-programadas/filtrar", authMiddleware, filtrarTransaccionesProgramadas);

export default programerTranssaccionRouter;
