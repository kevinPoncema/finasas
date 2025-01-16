import { CategoriaSchema } from "./validateorsSchemas"; // Importar el schema de validación de Zod
import { Request, Response } from "express";
import { Categoria } from "@models/Categoria"; // Importar el modelo de Categoria
import { Subusuario } from "@models/Subusuario"; // Importar el modelo de Subusuario
import { z } from "zod";

// Crear una nueva categoría
export const crearCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el ID del subusuario desde el token
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asignar el resto al cuerpo de la solicitud

    // Validar los datos de la categoría
    const validatedData = CategoriaSchema.parse(req.body);

    // Crear la categoría
    console.log(tokenData)
    const categoria = await Categoria.create({
      nombre: validatedData.nombre,
      subusuario_id: tokenData.subusuario_id, // Asignar el subusuario_id desde el token
    });

    res.status(201).json({
      message: "Categoría creada exitosamente.",
      categoria: categoria, // Retornar los datos de la categoría creada
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Manejar errores de validación
      res.status(400).json({
        message: "Error en la solicitud.",
        errors: error.errors,
      });
    } else {
      // Manejar otros errores
      res.status(500).json({
        message: "Error al crear la categoría.",
        error: error.message,
      });
    }
  }
};

// Obtener todas las categorías de un subusuario
export const obtenerCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData } = req.body;

    // Buscar todas las categorías relacionadas con el subusuario
    const categorias = await Categoria.findAll({
      where: { subusuario_id: tokenData.subusuario_id },
    });

    if (categorias.length === 0) {
      res.status(404).json({
        message: "No se encontraron categorías para este subusuario.",
      });
      return;
    }

    res.status(200).json({
      message: "Categorías obtenidas exitosamente.",
      categorias: categorias.map((categoria) => categoria.toJSON()), // Retornar las categorías en formato JSON
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error al obtener las categorías.",
      error: error.message,
    });
  }
};

// Actualizar una categoría
export const actualizarCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData, ...rest } = req.body;
    req.body = rest;

    // Validar los datos de la categoría
    const validatedData = CategoriaSchema.partial().parse(req.body);

    // Buscar la categoría por ID
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      res.status(404).json({
        message: "Categoría no encontrada.",
      });
      return;
    }

    // Verificar que la categoría pertenezca al subusuario
    if (categoria.dataValues.subusuario_id !== tokenData.subusuario_id) {
      res.status(403).json({
        message: "No tienes permiso para modificar esta categoría.",
      });
      return;
    }

    // Actualizar la categoría
    await categoria.update(validatedData);

    res.status(200).json({
      message: "Categoría actualizada exitosamente.",
      categoria: categoria,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Error en la solicitud.",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Error al actualizar la categoría.",
        error: error.message,
      });
    }
  }
};

// Eliminar una categoría
export const eliminarCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData } = req.body;

    // Buscar la categoría por ID
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      res.status(404).json({
        message: "Categoría no encontrada.",
      });
      return;
    }

    // Verificar que la categoría pertenezca al subusuario
    if (categoria.dataValues.subusuario_id !== tokenData.subusuario_id) {
      res.status(403).json({
        message: "No tienes permiso para eliminar esta categoría.",
      });
      return;
    }

    // Eliminar la categoría
    await categoria.destroy();

    res.status(200).json({
      message: "Categoría eliminada exitosamente.",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error al eliminar la categoría.",
      error: error.message,
    });
  }
};
