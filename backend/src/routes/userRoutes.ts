import { Router } from 'express';
import {crearUsuario} from "@controllers/userControl"
const router = Router();
/**
 * Ruta para crear un usuario.
 * Método: POST
 * URL: /users
 */
router.post('/users', crearUsuario);

export default router;

