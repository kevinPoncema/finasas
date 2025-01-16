import { Router } from 'express';
import { crearSubUsuario, actualizarSubUsuario, logInSubUsario,eliminarSubUsuario} from '@controllers/subUserControler';
import authMiddleware from '@middlewares/Auth';

const subUserRouter = Router();

/**
 * Ruta para crear un usuario.
 * Método: POST
 * URL: /users
 */
subUserRouter.post('/subuser',authMiddleware, crearSubUsuario);

/**
 * Ruta para actualizar un usuario.
 * Método: PUT
 * URL: /user
 */
subUserRouter.put('/subuser', authMiddleware, actualizarSubUsuario);

/**
 * Ruta para el inicio de sesión de un usuario.
 * Método: POST
 * URL: /login
 */
subUserRouter.post('/subuser/login', logInSubUsario);

subUserRouter.delete('/subuser', authMiddleware, eliminarSubUsuario);

export default subUserRouter;