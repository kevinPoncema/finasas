import { Request, Response } from "express";
import { ZodError } from "zod";
import { transaccionSchema } from "./validateorsSchemas";
import { Transaccion } from "@models/Transaccion";
import { Categoria } from "../models/Categoria"; // Modelo de Categoría
import { Op } from "sequelize"; // Operadores de Sequelize

export const obtenerTransacciones = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fechaInicio, fechaFin } = req.params;
      const { tokenData } = req.body;
  
      // Validar token del subusuario
      if (!tokenData || !tokenData.subusuario_id) {
        res.status(401).json({ error: "No autenticado como subusuario." });
        return
      }
  
      // Validar las fechas
      if (!fechaInicio || !fechaFin) {
        res.status(400).json({ error: "Las fechas inicial y final son obligatorias." });
        return
      }
  
      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);
  
      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({ error: "Las fechas proporcionadas no son válidas." });
        return
      }
      // Consultar las transacciones del subusuario dentro del rango de fechas
      console.log(fechaInicio,fechaFin,fechaInicioDate,fechaFinDate)
      const transacciones = await Transaccion.findAll({
        where: {
          subusuario_id: tokenData.subusuario_id,
          creado_en: {
            [Op.between]: [fechaInicioDate, fechaFinDate],
          },
        },
        order: [["creado_en", "ASC"]], // Ordenar por fecha ascendente
      });
  
    res.status(200).json(transacciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener las transacciones." });
    }
  };

  export const obtenerTransaccionesSinFechas = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fechaInicio, fechaFin } = req.params;
      const { tokenData } = req.body;
  
      // Validar token del subusuario
      if (!tokenData || !tokenData.subusuario_id) {
        res.status(401).json({ error: "No autenticado como subusuario." });
        return
      }
  
      // Consultar las transacciones del subusuario dentro del rango de fecha
      const transacciones = await Transaccion.findAll({
        where: {
          subusuario_id: tokenData.subusuario_id,
        },
        order: [["creado_en", "ASC"]], // Ordenar por fecha ascendente
      });
  
    res.status(200).json(transacciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener las transacciones." });
    }
  };

// Crear Transacción
export const crearTransaccion = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar el cuerpo de la solicitud con Zod
    const data = transaccionSchema.parse(req.body);

    // Obtener los datos del token
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asignar el resto al cuerpo de la solicitud

    if (!tokenData.subusuario_id) {
       res.status(400).json({ error: "No autenticado como subusuario" });
       return
    }

    // Verificar si la categoría existe
    if(data.categoriaId){
    const categoria = await Categoria.findByPk(data.categoriaId);
    if (!categoria) {
    res.status(404).json({ error: "La categoría no existe." });
    return
    }}

    // Crear la transacción
    const nuevaTransaccion = await Transaccion.create({
      tipo: data.tipo,
      monto: data.monto,
      titulo: data.titulo,
      descripcion: data.descripcion || null,
      categoria_id: data.categoriaId || null,
      subusuario_id: tokenData.subusuario_id,
      recurrente: false,
      frecuencia: null,
    });

    res.status(201).json(nuevaTransaccion);
  } catch (error: any) {
    if (error instanceof ZodError) {
    res.status(400).json({ error: error.errors });
    return
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear la transacción." });
  }
};

// Actualizar Transacción
export const actualizarTransaccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // ID de la transacción a actualizar
    const data = transaccionSchema.parse(req.body);

    // Obtener los datos del token
    const { tokenData } = req.body;

    if (!tokenData.subusuario_id) {
    res.status(400).json({ error: "No autenticado como subusuario" });
    return
    }

    // Verificar si la transacción existe y pertenece al subusuario
    const transaccion = await Transaccion.findOne({
      where: { transaccion_id: id, subusuario_id: tokenData.subusuario_id },
    });

    if (!transaccion) {
    res.status(404).json({ error: "Transacción no encontrada o no autorizada." });
    return
    }

    // Actualizar la transacción
    await transaccion.update({
      tipo: data.tipo,
      monto: data.monto,
      titulo: data.titulo,
      descripcion: data.descripcion || null,
      categoria_id: data.categoriaId,
    });

    res.status(200).json(transaccion);
  } catch (error: any) {
    if (error instanceof ZodError) {
       res.status(400).json({ error: error.errors });
       return
    }
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la transacción." });
  }
};

// Borrar Transacción
export const borrarTransaccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Obtener los datos del token
    const { tokenData } = req.body;

    if (!tokenData.subusuario_id) {
    res.status(400).json({ error: "No autenticado como subusuario" });
    return
    }

    // Verificar si la transacción existe y pertenece al subusuario
    const transaccion = await Transaccion.findOne({
      where: { transaccion_id: id, subusuario_id: tokenData.subusuario_id },
    });

    if (!transaccion) {
    res.status(404).json({ error: "Transacción no encontrada o no autorizada." });
    return
    }

    // Borrar la transacción
    await transaccion.destroy();
    res.status(200).json({ message: "Transacción eliminada con éxito." });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar la transacción." });
  }
};



export const filtrarTransacciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { descripcion, titulo, tipo, fecha_inicio, fecha_fin, order_by, tokenData,categoria_id,monto } = req.body;

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

    if (titulo) {
      filtros.titulo = { [Op.like]: `%${titulo}%` }; // Coincidencia parcial en título
    }

    if (tipo) {
      filtros.tipo = tipo; // Filtrar por tipo ("ingreso" o "egreso")
    }
    if (categoria_id) {
      filtros.categoria_id = categoria_id
    }

    if (monto) {
      filtros.monto = monto
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
      orden.push(["monto", "DESC"]); // Ordenar por monto descendente
    } else if (order_by === "menor") {
      orden.push(["monto", "ASC"]); // Ordenar por monto ascendente
    }

    // Consultar transacciones con los filtros y el orden construidos
    const transacciones = await Transaccion.findAll({
      where: filtros,
      order: orden.length ? orden : [["creado_en", "ASC"]], // Ordenar por fecha si no se especifica `order_by`
    });

    // Verificar si se encontraron resultados
    if (!transacciones.length) {
      res.status(404).json({ error: "No se encontraron transacciones con los criterios especificados." });
      return;
    }

    res.status(200).json(transacciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al filtrar las transacciones." });
  }
};