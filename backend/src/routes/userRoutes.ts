import { Router } from 'express';
import {crearUsuario,actualizarUsuario} from "@controllers/userControl"
const userRouter = Router();
/**
 * Ruta para crear un usuario.
 * Método: POST
 * URL: /users
 */
userRouter.post('/user', crearUsuario);
userRouter.put("/user",actualizarUsuario)
export default userRouter;