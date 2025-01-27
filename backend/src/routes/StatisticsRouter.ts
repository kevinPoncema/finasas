import { Router } from "express";
import authMiddleware from '@middlewares/Auth';
import { 
    obtenerTotales,
    getCategorySummary,
    obtenerMontoTotalPorPeriodo,
    exportDataExel,
    exportDataPDF,
    balancePresupuesto 
} from "@controllers/StatisticsController";

export const StatisticsRouter = Router();

/**
 * @openapi
 * /totales:
 *   get:
 *     summary: Obtener los totales generales.
 *     description: Obtiene los totales de las estadísticas generales.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Respuesta exitosa con los totales.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 1000
 *       401:
 *         description: No autorizado.
 */
StatisticsRouter.get("/totales", authMiddleware, obtenerTotales);

/**
 * @openapi
 * /getCategorySummary:
 *   get:
 *     summary: Obtener resumen por categoría.
 *     description: Devuelve un resumen de los totales por categoría.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Respuesta exitosa con el resumen por categoría.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                   example: "Alimentos"
 *                 total:
 *                   type: number
 *                   example: 250
 *       401:
 *         description: No autorizado.
 */
StatisticsRouter.get("/getCategorySummary", authMiddleware, getCategorySummary);

/**
 * @openapi
 * /getGraficaPeriodo:
 *   get:
 *     summary: Obtener monto total por periodo.
 *     description: Obtiene el monto total de las estadísticas por un periodo específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: periodo
 *         in: query
 *         description: El periodo para obtener los totales.
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-01"
 *     responses:
 *       200:
 *         description: Respuesta exitosa con los totales por periodo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 periodo:
 *                   type: string
 *                   example: "2025-01"
 *                 total:
 *                   type: number
 *                   example: 500
 *       400:
 *         description: Parámetro de periodo incorrecto.
 *       401:
 *         description: No autorizado.
 */
StatisticsRouter.get("/getGraficaPeriodo", authMiddleware, obtenerMontoTotalPorPeriodo);

/**
 * @openapi
 * /export-excel:
 *   get:
 *     summary: Exportar datos a Excel.
 *     description: Exporta los datos estadísticos a un archivo Excel.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado.
 */
StatisticsRouter.get("/export-excel", authMiddleware, exportDataExel);

/**
 * @openapi
 * /export-pdf:
 *   get:
 *     summary: Exportar datos a PDF.
 *     description: Exporta los datos estadísticos a un archivo PDF.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado exitosamente.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado.
 */
StatisticsRouter.get("/export-pdf", authMiddleware, exportDataPDF);

/**
 * @openapi
 * /balance-general:
 *   get:
 *     summary: Obtener balance de presupuesto general.
 *     description: Devuelve el balance del presupuesto general.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Respuesta exitosa con el balance del presupuesto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPresupuesto:
 *                   type: number
 *                   example: 2000
 *                 totalGastado:
 *                   type: number
 *                   example: 1500
 *       401:
 *         description: No autorizado.
 */
StatisticsRouter.get("/balance-general", authMiddleware, balancePresupuesto);

