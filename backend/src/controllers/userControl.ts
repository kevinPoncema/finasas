import { Request, Response } from "express";
import { z } from "zod";
import { hashPassword } from "@utils/passwordEncryted";
import {JWTManager} from "@utils/JWTManager";
import { Usuario } from "@models/Usuario";

// Validar los datos de entrada con Zod
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("Debe ser un correo electrónico válido."),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar el cuerpo de la solicitud
    const validatedData = usuarioSchema.parse(req.body);
    // Encriptar la contraseña
    const encrytedPassword = await hashPassword(validatedData.contraseña);
    // Crear el usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      nombre: validatedData.nombre,
      correo: validatedData.correo,
      contraseña: encrytedPassword,
    });

     // Extraer solo los campos necesarios
    const tokent = JWTManager.createToken({
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
    });

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      tokent: tokent,
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
        message: "Error al crear el usuario.",
        error: error.message,
      });
    }
  }
};


export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener el ID del usuario desde los parámetros de la URL
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "El ID del usuario es obligatorio." });
      }
      // Validar el cuerpo de la solicitud
    const validatedData = usuarioSchema.partial().parse(req.body);
      // Buscar el usuario por ID
      const usuarioExistente = await Usuario.findByPk(id);
  
      if (!usuarioExistente) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
  
      // Si se envía una nueva contraseña, encriptarla
      if (validatedData.contraseña) {
        validatedData.contraseña = await hashPassword(validatedData.contraseña);
      }
  
      // Actualizar el usuario con los datos validados
      await usuarioExistente.update(validatedData);
  
      // Generar un nuevo token con la información actualizada
    const tokent = JWTManager.createToken({
        id: usuarioExistente.id,
        nombre: usuarioExistente.nombre,
        correo: usuarioExistente.correo,
    });
      res.status(200).json({
        message: "Usuario actualizado exitosamente.",
        tokent: tokent,
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
          message: "Error al actualizar el usuario.",
          error: error.message,
        });
      }
    }
  };
  