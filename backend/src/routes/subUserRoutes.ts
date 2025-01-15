import { Router } from 'express';
import { crearSubUsuario, actualizarSubUsuario, logInSubUsario,eliminarSubUsuario} from '@controllers/subUserControler';
import authMiddleware from '@middlewares/Auth';

const userRouter = Router();

/**
 * Ruta para crear un usuario.
 * Método: POST
 * URL: /users
 */
userRouter.post('/subuser',authMiddleware, crearSubUsuario);

/**
 * Ruta para actualizar un usuario.
 * Método: PUT
 * URL: /user
 */
userRouter.put('/subuser', authMiddleware, actualizarSubUsuario);

/**
 * Ruta para el inicio de sesión de un usuario.
 * Método: POST
 * URL: /login
 */
userRouter.post('/subuser/login', logInSubUsario);

userRouter.delete('/subuser', authMiddleware, eliminarSubUsuario);

export default userRouter;