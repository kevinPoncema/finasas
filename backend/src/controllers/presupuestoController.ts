import { Request, Response } from "express";
import { ZodError } from "zod";
import { presupuestoSchema } from "./validateorsSchemas"; // Suponiendo que ya tienes un validador para presupuesto
import  Presupuesto  from "@models/presupuesto"; // Modelo de Presupuesto
import { Categoria } from "@models/Categoria"; // Modelo de Categoría
import { Op } from "sequelize"; // Operadores de Sequelize

// Obtener todos los presupuestos filtrados por id de subusuario y categoría
export const obtenerPresupuestos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoriaId, subusuarioId } = req.query;
    const { tokenData } = req.body;

    // Validar token del subusuario
    if (!tokenData || !tokenData.subusuario_id) {
      res.status(401).json({ error: "No autenticado como subusuario." });
      return;
    }

    // Verificar que los parámetros necesarios están presentes
    if (!categoriaId || !subusuarioId) {
      res.status(400).json({ error: "El id de categoría y el id de subusuario son obligatorios." });
      return;
    }

    // Consultar los presupuestos filtrados por subusuario_id y categoria_id
    const presupuestos = await Presupuesto.findAll({
      where: {
        subusuario_id: subusuarioId,
        categoria_id: categoriaId,
      },
      order: [["creado_en", "ASC"]], // Ordenar por fecha de creación
    });

    res.status(200).json(presupuestos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los presupuestos." });
  }
};

// Crear un nuevo presupuesto
export const crearPresupuesto = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar el cuerpo de la solicitud con Zod
    const data = presupuestoSchema.parse(req.body);

    const { tokenData } = req.body;

    if (!tokenData.subusuario_id) {
      res.status(400).json({ error: "No autenticado como subusuario" });
      return;
    }

    // Verificar si la categoría existe
    if (data.categoriaId) {
      const categoria = await Categoria.findByPk(data.categoriaId);
      if (!categoria) {
        res.status(404).json({ error: "La categoría no existe." });
        return;
      }
    }

    // Crear el presupuesto
    const nuevoPresupuesto = await Presupuesto.create({
      nombre: data.nombre,
      costo: data.costo,
      descripcion: data.descripcion || null,
      categoria_id: data.categoriaId || null,
      subusuario_id: tokenData.subusuario_id,
    });

    res.status(201).json(nuevoPresupuesto);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear el presupuesto." });
  }
};

// Actualizar un presupuesto existente
export const actualizarPresupuesto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // ID del presupuesto a actualizar
    const data = presupuestoSchema.parse(req.body);

    const { tokenData } = req.body;

    if (!tokenData.subusuario_id) {
      res.status(400).json({ error: "No autenticado como subusuario" });
      return;
    }

    // Verificar si el presupuesto existe y pertenece al subusuario
    const presupuesto = await Presupuesto.findOne({
      where: { presupuesto_id: id, subusuario_id: tokenData.subusuario_id },
    });

    if (!presupuesto) {
      res.status(404).json({ error: "Presupuesto no encontrado o no autorizado." });
      return;
    }

    // Actualizar el presupuesto
    await presupuesto.update({
      nombre: data.nombre,
      costo: data.costo,
      descripcion: data.descripcion || null,
      categoria_id: data.categoriaId,
    });

    res.status(200).json(presupuesto);
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el presupuesto." });
  }
};

// Borrar un presupuesto
export const borrarPresupuesto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { tokenData } = req.body;

    if (!tokenData.subusuario_id) {
      res.status(400).json({ error: "No autenticado como subusuario" });
      return;
    }

    // Verificar si el presupuesto existe y pertenece al subusuario
    const presupuesto = await Presupuesto.findOne({
      where: { presupuesto_id: id, subusuario_id: tokenData.subusuario_id },
    });

    if (!presupuesto) {
      res.status(404).json({ error: "Presupuesto no encontrado o no autorizado." });
      return;
    }

    // Borrar el presupuesto
    await presupuesto.destroy();
    res.status(200).json({ message: "Presupuesto eliminado con éxito." });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar el presupuesto." });
  }
};

// Obtener presupuestos filtrados por categoría y subusuario
export const obtenerPresupuestosPorCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoriaId } = req.params;  // Obtener el ID de la categoría desde los parámetros
      const { tokenData } = req.body;      // Obtener los datos del token (subusuario_id)
      // Verificar si el subusuario está autenticado
        if (!tokenData || !tokenData.subusuario_id) {
        res.status(401).json({ error: "No autenticado como subusuario." });
        return;
    }

      // Buscar presupuestos filtrados por categoría y subusuario
    const presupuestos = await Presupuesto.findAll({
        where: {
          categoria_id: categoriaId,  // Filtra por categoría
          subusuario_id: tokenData.subusuario_id, // Filtra por subusuario
        },
        order: [["creado_en", "ASC"]], // Ordenar por fecha ascendente
    });

    if (!presupuestos.length) {
        res.status(404).json({ error: "No se encontraron presupuestos para esta categoría." });
        return;
    }

    res.status(200).json(presupuestos);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los presupuestos." });
    }
};

export const filtrarPresupuestos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { descripcion, nombre, fecha_inicio, fecha_fin, order_by, tokenData } = req.body;

    // Verificar si el subusuario está autenticado
    if (!tokenData || !tokenData.subusuario_id) {
      res.status(401).json({ error: "No autenticado como subusuario." });
      return;
    }

    // Construir los filtros dinámicamente
    const filtros: any = { subusuario_id: tokenData.subusuario_id };

    if (descripcion) {
      filtros.descripcion = { [Op.like]: `%${descripcion}%` }; // Coincidencia parcial en descripción
    }

    if (nombre) {
      filtros.nombre = { [Op.like]: `%${nombre}%` }; // Coincidencia parcial en nombre
    }

    if (fecha_inicio && fecha_fin) {
      filtros.creado_en = { [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)] }; // Rango de fechas
    } else if (fecha_inicio || fecha_fin) {
      res.status(400).json({ error: "Debe proporcionar ambas fechas: fecha_inicio y fecha_fin." });
      return;
    }

    // Construir el orden dinámicamente
    const orden: any[] = [];
    if (order_by === "mayor") {
      orden.push(["costo", "DESC"]); // Ordenar por costo descendente
    } else if (order_by === "menor") {
      orden.push(["costo", "ASC"]); // Ordenar por costo ascendente
    }

    // Consultar presupuestos con los filtros y el orden construidos
    const presupuestos = await Presupuesto.findAll({
      where: filtros,
      order: orden.length ? orden : [["creado_en", "ASC"]], // Ordenar por fecha si no se especifica `order_by`
    });

    // Verificar si se encontraron resultados
    if (!presupuestos.length) {
      res.status(404).json({ error: "No se encontraron presupuestos con los criterios especificados." });
      return;
    }

    res.status(200).json(presupuestos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al filtrar los presupuestos." });
  }
};