import { Request, Response } from "express";
import TransaccionProgramada from "@models/TransaccionProgramada";
import {Transaccion} from "@models/Transaccion";
import { transaccionProgramadaSchema } from "./validateorsSchemas";
import { ZodError } from "zod";
import { Op } from 'sequelize';
import cron  from "node-cron";
// Función para crear la transacción programada
export const crearTP = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el ID del usuario desde el token
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asignar el resto al cuerpo de la solicitud
    // Validar los datos de la solicitud utilizando Zod
    const data = transaccionProgramadaSchema.parse(req.body);
    console.log("data",data)
    // Crear la transacción programada en la base de datos
    const nuevaTransaccion = await TransaccionProgramada.create({
      subusuario_id:tokenData.subusuario_id,
      tipo: data.tipo,
      titulo: data.titulo,
      descripcion: data.descripcion || null,
      monto: data.monto,
      categoria_id: data.categoriaId || null,
      recurrente: data.recurrente,
      fecha: data.fecha,
      periodo: data.periodo,
      cantidad_repeticiones: data.cantidadRepeticiones || null,
      repeticiones:0
    });

    // Responder con el registro de la transacción programada
    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear la transacción programada." });
  }
};


// Obtener todas las transacciones programadas para un subusuario
export const obtenerTPs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData } = req.body;

    // Obtener las transacciones programadas del subusuario desde la base de datos
    const transaccionesProgramadas = await TransaccionProgramada.findAll({
      where: { subusuario_id: tokenData.subusuario_id },
    });

    res.status(200).json(transaccionesProgramadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las transacciones programadas." });
  }
};

// Actualizar una transacción programada
export const actualizarTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asignar el resto al cuerpo de la solicitud
    const { transaccionesProgramadasId } = req.params;
    const data = transaccionProgramadaSchema.parse(req.body); // Validar los datos

    // Buscar la transacción programada en la base de datos
    const transaccion = await TransaccionProgramada.findByPk(transaccionesProgramadasId);

    if (!transaccion) {
      res.status(404).json({ error: "Transacción programada no encontrada." });
      return;
    }

    // Actualizar los datos de la transacción programada
    if (tokenData.subusuario_id == transaccion.dataValues.subusuario_id) {
      await transaccion.update({
        tipo: data.tipo,
        titulo: data.titulo,
        descripcion: data.descripcion || null,
        monto: data.monto,
        categoria_id: data.categoriaId || null,
        recurrente: data.recurrente,
        fecha: data.fecha,
        periodo: data.periodo,
        cantidad_repeticiones: data.cantidadRepeticiones || null,
      });
    }else{
      res.status(401).send({"mensaje":"no autorizado","error":"no se pude modificar las transaciones de otros"})
      return;
    }
    res.status(200).json(transaccion);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la transacción programada." });
  }
};

// Eliminar una transacción programada
export const eliminarTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asignar el resto al cuerpo de la solicitud
    const { transaccionesProgramadasId } = req.params;

    // Buscar la transacción programada en la base de datos
    const transaccion = await TransaccionProgramada.findByPk(transaccionesProgramadasId);

    if (!transaccion) {
      res.status(404).json({ error: "Transacción programada no encontrada." });
      return;
    }

    // Eliminar la transacción programada
    if (tokenData.subusuario_id == transaccion.dataValues.subusuario_id) {await transaccion.destroy();}
    else{
      res.status(401).send({"mensaje":"no autorizado","error":"no se pude modificar las transaciones de otros"})
      return
    }
    res.status(200).json({ message: "Transacción programada eliminada con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la transacción programada." });
  }
};

function obtenerNuevaFecha(fecha: string, periodo: "diario" | "semanal" | "mensual" | "anual" | "15enal"): Date {
  const fechaOriginal = new Date(fecha); // Convertimos la fecha de entrada a un objeto Date
  let nuevaFecha = new Date(fechaOriginal); // Creamos una copia de la fecha original para modificarla

  switch (periodo) {
    case "diario":
      nuevaFecha.setDate(nuevaFecha.getDate() + 1); // Añadir 1 día
      break;
    case "semanal":
      nuevaFecha.setDate(nuevaFecha.getDate() + 7); // Añadir 7 días
      break;
    case "mensual":
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1); // Añadir 1 mes
      break;
    case "anual":
      nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1); // Añadir 1 año
      break;
    case "15enal":
      // Añadir 15 días
      nuevaFecha.setDate(nuevaFecha.getDate() + 15);
      break;
    default:
      throw new Error("Periodo no válido");
  }
  return nuevaFecha;
}

//
async function crearTransaccionReal(tp:TransaccionProgramada) {
  console.log(tp.dataValues)
  Transaccion.create({
    subusuario_id:tp.dataValues.subusuario_id,
    tipo:tp.dataValues.tipo,
    monto:tp.dataValues.monto,
    titulo:tp.dataValues.titulo,
    descripcion:tp.dataValues.descripcion,
    categoria_id:tp.dataValues.categoria_id
  })
}
//funcion para revisar los procedimentos almacenados a las 12 am
async function mainTP() {
  const hoy = new Date();
  const fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // Empezamos el día de hoy
  const fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1); // El día siguiente (para que no se incluya)

  try {
    const tps = await TransaccionProgramada.findAll({
      where: {
        fecha: {
          [Op.gte]: fechaInicio, // Mayor o igual al inicio de hoy
          [Op.lt]: fechaFin, // Menor a mañana (para que solo se incluya hoy)
        },
      },
    });
  
      // Iterando con un bucle for
      for (const tp of tps) {
        console.log("iterando",tp.dataValues)
        if (tp.dataValues.cantidad_repeticiones == null || tp.dataValues.cantidad_repeticiones >tp.dataValues.repeticiones) {
          //crra la trasacion normal
          await crearTransaccionReal(tp)
          if (tp.dataValues.recurrente == false || tp.dataValues.repeticiones+1 >= tp.dataValues.cantidad_repeticiones) {
            tp.destroy()
          } else {
            tp.update({
              fecha:obtenerNuevaFecha(tp.dataValues.fecha,tp.dataValues.periodo),
              repeticiones:tp.dataValues.repeticiones+1
            })
          }

        }
      }
  } catch (error) {
    console.error('Error al obtener las transacciones programadas:', error);
    throw error;
  }
}

const task = cron.schedule('0 0 * * *',mainTP)
task.start()