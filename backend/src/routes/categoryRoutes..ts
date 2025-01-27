import { Router } from 'express';
import { 
  crearCategoria, 
  obtenerCategorias, 
  actualizarCategoria, 
  eliminarCategoria,
  filtrarCategoriasPorNombre 
} from '@controllers/categoryControler';
import authMiddleware from '@middlewares/Auth';

const categoriaRouter = Router();

/**
 * Ruta para crear una categoría.
 * @method POST
 * @url /categorias
 * @body { nombre: string }
 * @description Crea una nueva categoría asociada al subusuario autenticado.
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @response 201 - Categoría creada exitosamente.
 * @response 400 - Error de validación en los datos de la solicitud.
 * @response 500 - Error interno al crear la categoría.
 */
categoriaRouter.post('/categorias', authMiddleware, crearCategoria);

/**
 * Ruta para obtener todas las categorías del subusuario.
 * @method GET
 * @url /categorias
 * @description Obtiene todas las categorías asociadas al subusuario autenticado.
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @response 200 - Categorías obtenidas exitosamente.
 * @response 404 - No se encontraron categorías para el subusuario.
 * @response 500 - Error interno al obtener las categorías.
 */
categoriaRouter.get('/categorias', authMiddleware, obtenerCategorias);

/**
 * Ruta para actualizar una categoría.
 * @method PUT
 * @url /categorias/:id
 * @param {id} - ID de la categoría a actualizar.
 * @body { nombre?: string }
 * @description Actualiza los datos de una categoría específica.
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @response 200 - Categoría actualizada exitosamente.
 * @response 404 - Categoría no encontrada.
 * @response 403 - No tienes permiso para modificar esta categoría.
 * @response 500 - Error interno al actualizar la categoría.
 */
categoriaRouter.put('/categorias/:id', authMiddleware, actualizarCategoria);

/**
 * Ruta para eliminar una categoría.
 * @method DELETE
 * @url /categorias/:id
 * @param {id} - ID de la categoría a eliminar.
 * @description Elimina una categoría específica.
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @response 200 - Categoría eliminada exitosamente.
 * @response 404 - Categoría no encontrada.
 * @response 403 - No tienes permiso para eliminar esta categoría.
 * @response 500 - Error interno al eliminar la categoría.
 */
categoriaRouter.delete('/categorias/:id', authMiddleware, eliminarCategoria);

/**
 * Ruta para filtrar categorías por nombre.
 * @method POST
 * @url /categorias/filtrar-por-nombre
 * @body { nombre: string }
 * @description Filtra las categorías asociadas al subusuario por nombre (coincidencia parcial).
 * @middleware authMiddleware - Verifica que el usuario esté autenticado.
 * @response 200 - Categorías filtradas exitosamente.
 * @response 400 - No se proporcionó un nombre para filtrar.
 * @response 404 - No se encontraron categorías que coincidan con el nombre especificado.
 * @response 500 - Error interno al filtrar las categorías.
 */
categoriaRouter.post("/categorias/filtrar-por-nombre", authMiddleware, filtrarCategoriasPorNombre);

export default categoriaRouter;
