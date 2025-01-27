import { Router } from 'express';
import { 
  crearSubUsuario, 
  actualizarSubUsuario, 
  logInSubUsario, 
  eliminarSubUsuario 
} from '@controllers/subUserControler';
import authMiddleware from '@middlewares/Auth';

const subUserRouter = Router();

/**
 * @openapi
 * /subuser:
 *   post:
 *     summary: Crear un nuevo subusuario.
 *     description: Permite crear un subusuario en el sistema.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - contraseña
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               correo:
 *                 type: string
 *                 example: "juanperez@correo.com"
 *               contraseña:
 *                 type: string
 *                 example: "secreto123"
 *     responses:
 *       201:
 *         description: Subusuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario creado exitosamente."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Error de validación o conflicto de correo electrónico.
 *       500:
 *         description: Error interno del servidor.
 */
subUserRouter.post('/subuser', authMiddleware, crearSubUsuario);

/**
 * @openapi
 * /subuser:
 *   put:
 *     summary: Actualizar un subusuario existente.
 *     description: Permite actualizar los datos de un subusuario en el sistema.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               correo:
 *                 type: string
 *                 example: "juanperez@correo.com"
 *               contraseña:
 *                 type: string
 *                 example: "nuevoSecreto123"
 *     responses:
 *       200:
 *         description: Subusuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario actualizado exitosamente."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Error de validación o conflicto de correo electrónico.
 *       404:
 *         description: El subusuario no fue encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
subUserRouter.put('/subuser', authMiddleware, actualizarSubUsuario);

/**
 * @openapi
 * /subuser/login:
 *   post:
 *     summary: Iniciar sesión como subusuario.
 *     description: Permite que un subusuario se autentique y obtenga un token JWT.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contraseña
 *             properties:
 *               correo:
 *                 type: string
 *                 example: "juanperez@correo.com"
 *               contraseña:
 *                 type: string
 *                 example: "secreto123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario autenticado exitosamente."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Contraseña incorrecta.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
subUserRouter.post('/subuser/login', logInSubUsario);

/**
 * @openapi
 * /subuser:
 *   delete:
 *     summary: Eliminar un subusuario.
 *     description: Permite eliminar un subusuario del sistema.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subusuario eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado exitosamente."
 *       404:
 *         description: Subusuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
subUserRouter.delete('/subuser', authMiddleware, eliminarSubUsuario);

export default subUserRouter;
