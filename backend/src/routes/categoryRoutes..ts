import { Router } from 'express';
import { 
  crearCategoria, 
  obtenerCategorias, 
  actualizarCategoria, 
  eliminarCategoria 
} from '@controllers/categoryControler';
import authMiddleware from '@middlewares/Auth';

const categoriaRouter = Router();

/**
 * Ruta para crear una categoría.
 * Método: POST
 * URL: /categorias
 */
categoriaRouter.post('/categorias', authMiddleware, crearCategoria);

/**
 * Ruta para obtener todas las categorías del subusuario.
 * Método: GET
 * URL: /categorias
 */
categoriaRouter.get('/categorias', authMiddleware, obtenerCategorias);

/**
 * Ruta para actualizar una categoría.
 * Método: PUT
 * URL: /categorias/:id
 * Nota: ":id" es un parámetro dinámico para el ID de la categoría a actualizar.
 */
categoriaRouter.put('/categorias/:id', authMiddleware, actualizarCategoria);

/**
 * Ruta para eliminar una categoría.
 * Método: DELETE
 * URL: /categorias/:id
 * Nota: ":id" es un parámetro dinámico para el ID de la categoría a eliminar.
 */
categoriaRouter.delete('/categorias/:id', authMiddleware, eliminarCategoria);

export default categoriaRouter;
