import { Request, Response } from "express";
import {ControlTotales} from "@models/ControlTotales"


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
        total_general: totalGeneral,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los totales." });
    }
  };