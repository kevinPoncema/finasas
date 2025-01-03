import express, { Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "@config/database"; // Configuración de Sequelize
import { Usuario } from "@models/Usuario";
import { Subusuario } from "@models/Subusuario";
import { Transaccion } from "@models/Transaccion";
import userRouter from "@routes/userRoutes"
// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear instancia de Express
const app = express();

// Configuración de puerto desde el archivo .env o usar el puerto 3000 como predeterminado
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Sincronizar modelos y conectar con la base de datos
(async () => {
  try {
    await sequelize.addModels([Usuario, Subusuario, Transaccion]); // Añadir los modelos
    await sequelize.sync({ alter: true }); // alter: true actualiza tablas sin perder datos
    console.log("Base de datos sincronizada correctamente.");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
})();

// Ruta principal (ping-pong)
app.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "pong" });
});

app.use(userRouter)
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
