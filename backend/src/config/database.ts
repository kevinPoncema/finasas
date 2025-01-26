import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+01:00', // Hora estándar de España
  dialectOptions: {
    timezone: 'Etc/GMT-1', // Esto también aplica para algunas configuraciones de MySQL
  }, 
  models: [path.join(__dirname, "../models")], // Ruta a los modelos
  logging:false, //console.log, // Puedes desactivar los logs con `false`
});

export default sequelize;
