import { Router } from 'express';
import { crearUsuario, actualizarUsuario, logInUsario,eliminarUsuario} from '@controllers/userControl';
import authMiddleware from '@middlewares/Auth';

const userRouter = Router();

/**
 * Ruta para crear un usuario.
 * Método: POST
 * URL: /users
 */
userRouter.post('/user', crearUsuario);

/**
 * Ruta para actualizar un usuario.
 * Método: PUT
 * URL: /user
 */
userRouter.put('/user', authMiddleware, actualizarUsuario);

/**
 * Ruta para el inicio de sesión de un usuario.
 * Método: POST
 * URL: /login
 */
userRouter.post('/login', logInUsario);

userRouter.delete('/user', authMiddleware, eliminarUsuario);

export default userRouter;