import { Router } from "express";
import authMiddleware from '@middlewares/Auth';
import {obtenerTotales,getCategorySummary,obtenerMontoTotalPorPeriodo,exportDataExel,exportDataPDF,balancePresupuesto} from "@controllers/StatisticsController"
export const StatisticsRouter = Router()
StatisticsRouter.get("/totales",authMiddleware,obtenerTotales)
StatisticsRouter.get("/getCategorySummary",authMiddleware,getCategorySummary)
StatisticsRouter.get("/getGraficaPeriodo/",authMiddleware,obtenerMontoTotalPorPeriodo)
StatisticsRouter.get("/export-excel/",authMiddleware,exportDataExel)
StatisticsRouter.get("/export-pdf/",authMiddleware,exportDataPDF)
StatisticsRouter.get("/balance-general",authMiddleware,balancePresupuesto)