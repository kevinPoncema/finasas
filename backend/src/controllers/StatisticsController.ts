import { Request, Response } from "express";
import {ControlTotales} from "@models/ControlTotales"
import {Transaccion} from "@models/Transaccion"
import {Categoria} from "@models/Categoria"
import sequelize from "@config/database";
import { Op } from "sequelize";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Presupuesto from '@models/presupuesto'; // Para manejar rangos de fechas
export const obtenerTotales = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener el subusuario_id del token
      const { tokenData } = req.body;
      if (!tokenData?.subusuario_id) {
        res.status(400).json({ error: "No autenticado como subusuario" });
        return;
      }
  
      // Buscar el control total para el subusuario
      const controlTotales = await ControlTotales.findOne({
        where: { subusuario_id: tokenData.subusuario_id }, // Filtrar por subusuario_id
      });
  
      // Verificar si existe un registro en control_totales para ese subusuario
      if (!controlTotales) {
        res.status(404).json({ error: "No se encontraron totales para este subusuario." });
        return;
      }
  
      // Calcular el total general (totalIngreso - totalEgreso)
      const totalGeneral = controlTotales.dataValues.total_ingresos - controlTotales.dataValues.total_egresos;
  
      // Responder con los totales
      res.status(200).json({
        total_ingresos: Number(controlTotales.dataValues.total_ingresos),
        total_egresos: Number(controlTotales.dataValues.total_egresos),
        total_presupuesto_previsto: Number(controlTotales.dataValues.total_presupuesto_previsto),
        total_general: totalGeneral,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los totales." });
    }
  };

  //obtiene los porcentajes de los montos por categoria
  export const balancePresupuesto = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener el subusuario_id del token
      const { tokenData } = req.body;
      if (!tokenData?.subusuario_id) {
        res.status(400).json({ error: "No autenticado como subusuario" });
        return;
      }
  
      // Buscar el control total para el subusuario
      const controlTotales = await ControlTotales.findOne({
        where: { subusuario_id: tokenData.subusuario_id },
      });
  
      // Verificar si existe un registro en control_totales para ese subusuario
      if (!controlTotales) {
        res.status(404).json({ error: "No se encontraron totales para este subusuario." });
        return;
      }
  
      // Calcular el rango del mes actual
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1); // Primer día del mes actual
      const finMes = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día del mes actual
  
      // Consultar el regreso mensual (ingresos del mes actual)
      const egresoMensuales = await Transaccion.sum("monto", {
        where: {
          subusuario_id: tokenData.subusuario_id,
          tipo: "egreso", // Solo considerar egreso
          creado_en: {
            [Op.between]: [inicioMes, finMes], // Entre el inicio y fin del mes
          },
        },
      });

      const ingresoMensuales = await Transaccion.sum("monto", {
        where: {
          subusuario_id: tokenData.subusuario_id,
          tipo: "ingreso", // Solo considerar ingreso
          creado_en: {
            [Op.between]: [inicioMes, finMes], // Entre el inicio y fin del mes
          },
        },
      });
      // Responder con los totales y el regreso mensual
      const totalGeneral = controlTotales.dataValues.total_ingresos - controlTotales.dataValues.total_egresos;
      res.status(200).json({
        total_ingresos: Number(controlTotales.dataValues.total_ingresos),
        total_egresos: Number(controlTotales.dataValues.total_egresos),
        total_presupuesto_previsto: Number(controlTotales.dataValues.total_presupuesto_previsto),
        egreso_mensual: Number(egresoMensuales || 0), // Si no hay egreso, devolver 0
        total_general: Number(totalGeneral),
        ingreso_mensual:Number(ingresoMensuales || 0)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el balance del mes." });
    }
  };

//obtiene los porcentajes de los montos por categoria
export const getCategorySummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData } = req.body;

    // Validación del token
    if (!tokenData?.subusuario_id) {
      res.status(400).json({ error: "No autenticado como subusuario." });
      return;
    }

    const subusuarioId = tokenData.subusuario_id;

    // Consulta: Transacciones agrupadas por categoría
    const data = await Transaccion.findAll({
      attributes: [
        "categoria_id", // Obtener el ID de la categoría
        [sequelize.fn("COUNT", sequelize.col("transaccion_id")), "totalTransacciones"],
        [sequelize.fn("SUM", sequelize.col("monto")), "totalMonto"],
      ],
      include: [
        {
          model: Categoria,
          attributes: ["id", "nombre"], // Incluir el nombre de la categoría y su id
        },
      ],
      where: { subusuario_id: subusuarioId },
      group: ["categoria_id", "categoria.id"], // Agrupar por categoría
    });

    // Calcular el total general de montos para calcular porcentajes
    const totalGeneral = data.reduce(
      (sum, item: any) => sum + parseFloat(item.dataValues.totalMonto),
      0
    );

    // Mapear los resultados para incluir el porcentaje y formatear la respuesta
    console.log(data)
    const result = data.map((item: any) => ({
      categoria: item.dataValues.categoria, // Nombre de la categoría
      estadisticas:{
      totalTransacciones: Number(item.dataValues.totalTransacciones),
      totalMonto: Number(item.dataValues.totalMonto),
      porcentaje: totalGeneral
        ? ((Number(item.dataValues.totalMonto) / totalGeneral) * 100).toFixed(2) + "%"
        : "0.00%", // Evitar división por cero
      }
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener las transacciones por categoría:", error);
    res.status(500).json({ error: "Error al obtener las transacciones por categoría." });
  }
};

export const obtenerMontoTotalPorPeriodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenData } = req.body;

    // Validación del token
    if (!tokenData?.subusuario_id) {
      res.status(400).json({ error: "No autenticado como subusuario." });
      return;
    }

    const subusuarioId = tokenData.subusuario_id;
    // Asegurarse de que 'periodo' sea un string
    const periodo = Array.isArray(req.query.periodo) ? req.query.periodo[0] : req.query.periodo;

    // Validación del parámetro 'periodo'
    if (!periodo || !["dia", "semana", "mes"].includes(periodo)) {
      res.status(400).json({ error: "El parámetro 'periodo' debe ser 'dia', 'semana' o 'mes'." });
      return;
    }

    let groupBy: any;
    let dateFormat: string;

    // Configuración del agrupamiento y formato de fecha según el período
    switch (periodo) {
      case "dia":
        groupBy = sequelize.fn("DATE", sequelize.col("creado_en"));
        dateFormat = "%Y-%m-%d"; // Formato de fecha: Año-Mes-Día
        break;
      case "semana":
        groupBy = sequelize.fn("WEEK", sequelize.col("creado_en"));
        dateFormat = "%Y-%u"; // Formato de semana: Año-Semana
        break;
      case "mes":
        groupBy = sequelize.fn("MONTH", sequelize.col("creado_en"));
        dateFormat = "%Y-%m"; // Formato de mes: Año-Mes
        break;
      default:
        groupBy = sequelize.fn("DATE", sequelize.col("creado_en"));
        dateFormat = "%Y-%m-%d";
        break;
    }

    // Consulta para obtener los totales de ingresos y egresos por el período
    const data = await Transaccion.findAll({
      attributes: [
        [groupBy, "fecha"], // Agrupar por fecha según el período
        [sequelize.fn("SUM", sequelize.col("monto")), "totalMontoIngreso"],
        [sequelize.fn("SUM", sequelize.literal("CASE WHEN tipo = 'egreso' THEN monto ELSE 0 END")), "totalMontoEgreso"]
      ],
      where: {
        subusuario_id: subusuarioId,
      },
      group: [groupBy], // Asegurarse de usar groupBy en la cláusula GROUP BY
      order: [[groupBy, "ASC"]], // Asegurarse de usar groupBy en el ORDER BY
    });

    // Mapear la respuesta para retornar la fecha formateada y los totales
    const result = data.map((item: any) => ({
      fecha: item.dataValues.fecha, // Fecha en el formato determinado
      totalMontoIngreso: Number(item.dataValues.totalMontoIngreso) || 0, // Total de ingresos
      totalMontoEgreso: Number(item.dataValues.totalMontoEgreso) || 0, // Total de egresos
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los montos totales por período:", error);
    res.status(500).json({ error: "Error al obtener los montos totales por período." });
  }
};


//funciones para consultar informacion para el reportre
// Consulta para obtener categorías
const obtenerCategorias = async (fechaInicio: string, fechaFin: string, subusuarioId: number) => {
  return await Categoria.findAll({
    where: {
      subusuario_id: subusuarioId,
      creado_en: {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
      },
    },
  });
};

const obtenerPresupuestos = async (fechaInicio: string, fechaFin: string, subusuarioId: number) => {
  return await Presupuesto.findAll({
    where: {
      subusuario_id: subusuarioId,
      creado_en: {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
      },
    },
  });
};

// Consulta para obtener ingresos o egresos
const obtenerTransacciones = async (fechaInicio: string, fechaFin: string, tipo: "ingreso" | "egreso", subusuarioId: number) => {
  return await Transaccion.findAll({
    where: {
      tipo,
      subusuario_id: subusuarioId,
      creado_en: {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
      },
    },
  });
};

// Consulta para estadísticas
const obtenerEstadisticas = async (fechaInicio: string, fechaFin: string, subusuarioId: number) => {
  return await Transaccion.findAll({
    attributes: [
      [sequelize.fn("DATE", sequelize.col("creado_en")), "fecha"],
      [sequelize.fn("SUM", sequelize.col("monto")), "totalMonto"],
    ],
    where: {
      subusuario_id: subusuarioId,
      creado_en: {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
      },
    },
    group: [sequelize.fn("DATE", sequelize.col("creado_en"))],
  });
};
// Controlador para exportar datos a Excel
export const exportDataExel = async (req: Request, res: Response): Promise<void> => {
  const { fechaInicio, fechaFin } = req.query;
  const { tokenData } = req.body;

  // Verificar parámetros requeridos
  if (!fechaInicio || !fechaFin || !tokenData?.subusuario_id) {
    res.status(400).json({ error: "Se requiere fechaInicio, fechaFin y un subusuario válido." });
    return;
  }

  const subusuarioId = tokenData.subusuario_id;
  try {
    // Obtener datos
    const categorias = await obtenerCategorias(fechaInicio as string, fechaFin as string, subusuarioId);
    const ingresos = await obtenerTransacciones(fechaInicio as string, fechaFin as string, "ingreso", subusuarioId);
    const egresos = await obtenerTransacciones(fechaInicio as string, fechaFin as string, "egreso", subusuarioId);
    const estadisticas = await obtenerEstadisticas(fechaInicio as string, fechaFin as string, subusuarioId);
    const articulos =await obtenerPresupuestos(fechaInicio as string, fechaFin as string, subusuarioId)
    // Crear workbook y hojas
    const workbook = new ExcelJS.Workbook();
    const hojaCategorias = workbook.addWorksheet("Categorías");
    const hojaListaArituclos = workbook.addWorksheet("Lista de Articulos");
    const hojaIngresos = workbook.addWorksheet("Ingresos");
    const hojaEgresos = workbook.addWorksheet("Egresos");
    const hojaEstadisticas = workbook.addWorksheet("Estadísticas");

    // Agregar datos a la hoja Categorías
    hojaCategorias.columns = [
      { header: "ID", key: "id" },
      { header: "Nombre", key: "nombre" },
      { header: "Fecha de Creación", key: "creado_en" },
    ];
    categorias.forEach((categoria) => {
      hojaCategorias.addRow({
        id: categoria.dataValues.id,
        nombre: categoria.dataValues.nombre,
        creado_en: categoria.dataValues.creado_en,
      });
    });

    hojaListaArituclos.columns =[
      { header: "ID", key: "id" },
      { header: "Nombre", key: "nombre" },
      { header: "Costo", key: "costo" },
      {header:"Descripcion",key:"descripcion"}
    ]
    articulos.forEach((articulo)=>{
      hojaListaArituclos.addRow({
        id:articulo.dataValues.presupuesto_id,
        nombre:articulo.dataValues.nombre,
        costo:articulo.dataValues.costo,
        descripcion:articulo.dataValues.descripcion
      })
    })
    // Agregar datos a la hoja Ingresos
    hojaIngresos.columns = [
      { header: "ID", key: "id" },
      { header: "Titulo", key: "titulo" },
      { header: "Descripcion", key: "Descripcion" },
      { header: "Monto", key: "monto" },
      { header: "Fecha de Creación", key: "creado_en" },
    ];
    ingresos.forEach((ingreso) => {
      hojaIngresos.addRow({
        id: ingreso.dataValues.transaccion_id,
        titulo:ingreso.dataValues.titulo,
        descripcion:ingreso.dataValues.descripcion,
        monto: ingreso.dataValues.monto,
        creado_en: ingreso.dataValues.creado_en,
      });
    });

    // Agregar datos a la hoja Egresos
    hojaEgresos.columns = [
      { header: "ID", key: "id" },
      { header: "Titulo", key: "titulo" },
      { header: "Descripcion", key: "Descripcion" },
      { header: "Monto", key: "monto" },
      { header: "Fecha de Creación", key: "creado_en" },
    ];
    egresos.forEach((egreso) => {
      hojaEgresos.addRow({
        id: egreso.dataValues.id,
        titulo:egreso.dataValues.titulo,
        descripcion:egreso.dataValues.descripcion,
        monto: egreso.dataValues.monto,
        creado_en: egreso.dataValues.creado_en,
      });
    });

    // Agregar datos a la hoja Estadísticas
    hojaEstadisticas.columns = [
      { header: "Fecha", key: "fecha" },
      { header: "Monto Total", key: "totalMonto" },
    ];
    estadisticas.forEach((estadistica) => {
      hojaEstadisticas.addRow({
        fecha: estadistica.dataValues.fecha,
        totalMonto: estadistica.dataValues.totalMonto,
      });
    });

    // Configurar respuesta
    const fileName = `Reporte_${fechaInicio}_a_${fechaFin}_subusuario_${subusuarioId}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error al exportar datos:", error);
    res.status(500).json({ error: "Error al exportar datos a Excel" });
  }
};

// Controlador para exportar datos a PDF
export const exportDataPDF = async (req: Request, res: Response): Promise<void> => {
  const { fechaInicio, fechaFin } = req.query;
  const { tokenData } = req.body;

  // Verificar parámetros requeridos
  if (!fechaInicio || !fechaFin || !tokenData?.subusuario_id) {
    res.status(400).json({ error: "Se requiere fechaInicio, fechaFin y un subusuario válido." });
    return;
  }

  const subusuarioId = tokenData.subusuario_id;

  try {
    // Obtener datos
    const categorias = await obtenerCategorias(fechaInicio as string, fechaFin as string, subusuarioId);
    const ingresos = await obtenerTransacciones(fechaInicio as string, fechaFin as string, "ingreso", subusuarioId);
    const egresos = await obtenerTransacciones(fechaInicio as string, fechaFin as string, "egreso", subusuarioId);
    const estadisticas = await obtenerEstadisticas(fechaInicio as string, fechaFin as string, subusuarioId);
    const articulos =await obtenerPresupuestos(fechaInicio as string, fechaFin as string, subusuarioId)
    // Crear documento PDF
    const doc = new PDFDocument();
    const fileName = `Reporte_${fechaInicio}_a_${fechaFin}_subusuario_${subusuarioId}.pdf`;

    // Configurar respuesta HTTP
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    
    // Pipe PDF a la respuesta
    doc.pipe(res);

    // Título del documento
    doc.fontSize(16).text(`Reporte de ${fechaInicio} a ${fechaFin}`, { align: "center" });
    doc.moveDown();

    // Categorías
    doc.fontSize(14).text("Categorías:");
    categorias.forEach((categoria) => {
      doc.fontSize(12).text(`- ID: ${categoria.dataValues.id}, Nombre: ${categoria.dataValues.nombre}, Fecha: ${categoria.dataValues.creado_en}`);
    });
    doc.moveDown();

        // Categorías
        doc.fontSize(14).text("Categorías:");
        articulos.forEach((art) => {
          doc.fontSize(12).text(`- ID: ${art.dataValues.presupuesto_id}, Nombre: ${art.dataValues.nombre}, Costo: ${art.dataValues.costo}, Descripcion ${art.dataValues.descripcion}`);
        });
        doc.moveDown()

    // Ingresos
    doc.fontSize(14).text("Ingresos:");
    ingresos.forEach((ingreso) => {
      doc.fontSize(12).text(`- ID: ${ingreso.dataValues.id}, Título: ${ingreso.dataValues.titulo}, Monto: ${ingreso.dataValues.monto}, Fecha: ${ingreso.dataValues.creado_en}`);
    });
    doc.moveDown();

    // Egresos
    doc.fontSize(14).text("Egresos:");
    egresos.forEach((egreso) => {
      doc.fontSize(12).text(`- ID: ${egreso.dataValues.id}, Título: ${egreso.dataValues.titulo}, Monto: ${egreso.dataValues.monto}, Fecha: ${egreso.dataValues.creado_en}`);
    });
    doc.moveDown();

    // Estadísticas
    doc.fontSize(14).text("Estadísticas:");
    estadisticas.forEach((estadistica) => {
      doc.fontSize(12).text(`- Fecha: ${estadistica.dataValues.fecha}, Monto Total: ${estadistica.dataValues.totalMonto}`);
    });

    // Finalizar y cerrar el documento
    doc.end();
  } catch (error) {
    console.error("Error al exportar datos:", error);
    res.status(500).json({ error: "Error al exportar datos a PDF" });
  }
};