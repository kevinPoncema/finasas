import { Router } from "express";
import { crearTP, obtenerTPs, actualizarTP, eliminarTP } from "@controllers/programerTranssaccionController";
import authMiddleware from "@middlewares/Auth"
const programerTranssaccionRouter = Router();

// Ruta para crear una nueva transacción programada
programerTranssaccionRouter.post("/transacciones-programadas",authMiddleware, crearTP);

// Ruta para obtener todas las transacciones programadas de un subusuario
programerTranssaccionRouter.get("/transacciones-programadas",authMiddleware, obtenerTPs);

// Ruta para actualizar una transacción programada
programerTranssaccionRouter.put("/transacciones-programadas/:transaccionesProgramadasId",authMiddleware, actualizarTP);

// Ruta para eliminar una transacción programada
programerTranssaccionRouter.delete("/transacciones-programadas/:transaccionesProgramadasId",authMiddleware, eliminarTP);

export default programerTranssaccionRouter;
