import { usuarioSchema, usuarioLoginSchema } from "./validateorsSchemas";
import { Request, Response } from "express";
import { Subusuario } from "@models/Subusuario";
import { hashPassword,verifyPassword } from "@utils/passwordEncryted";
import { JWTManager } from "@utils/JWTManager";
import { ZodError } from "zod"; // Asegúrate de importar ZodError
import { z } from "zod";


export const crearSubUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el ID del usuario desde el token
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asignar el resto al cuerpo de la solicitud

    // Validar el cuerpo de la solicitud
    const validatedData = usuarioSchema.parse(req.body);

    // Verificar si el correo ya existe
    const correoExistente = await Subusuario.findOne({
      where: { correo: validatedData.correo }
    });

    if (correoExistente) {
      res.status(400).json({
        message: "El correo electrónico ya está en uso.",
      });
      return
    }

    // Encriptar la contraseña
    const encrytedPassword = await hashPassword(validatedData.contraseña); // Asegúrate de usar el campo correcto

    // Crear el subusuario
    console.log("TokentGood",tokenData)
    const su = await Subusuario.create({
      nombre: validatedData.nombre,
      correo: validatedData.correo,
      contraseña: encrytedPassword,
      usuario_principal: tokenData.id,
    });

    // Generar el token de autenticación
    const token = JWTManager.createToken({
      subusuario_id: su.dataValues.subusuario_id,
      correo: su.dataValues.correo,
      usuario_principal: su.dataValues.usuario_principal,
    });

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      token: token,
    });

  } catch (error:any) {
    if (error instanceof ZodError) {
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

export const logInSubUsario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar el cuerpo de la solicitud
    const validatedData = usuarioLoginSchema.parse(req.body);
    const {correo, contraseña } = validatedData;

 // Buscar el usuario en la base de datos por correo
    const su = await Subusuario.findOne({
    where: { correo },
    });



    // Si el usuario no se encuentra
    if (!su) {
      res.status(404).json({
        message: "Usuario no encontrado",
      });
      return
    }
    // Comparar la contraseña proporcionada con la almacenada (encriptada) en la base de datos
    const contraseñaValida = await verifyPassword(contraseña,su.dataValues.contraseña);
    if (!contraseñaValida) {
      res.status(401).json({
        message: "Contraseña incorrecta",
      });
      return
    }

    // Generar el token de autenticación
    const token = JWTManager.createToken({
      subusuario_id: su.dataValues.subusuario_id,
      correo: su.dataValues.correo,
      usuario_principal:su.dataValues.usuario_principal
    });

    // Responder con el token
    res.status(200).json({
      message: "Usuario autenticado exitosamente.",
      token: token, // Usa "token" en lugar de "tokent"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Error en la solicitud.",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: "Error al autenticar al usuario.",
        error: error.message,
      });
    }
  }
};

export const actualizarSubUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el ID del usuario desde el token
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asignar el resto al cuerpo de la solicitud

    // Validar el cuerpo de la solicitud (permitir campos opcionales)
    const validatedData = usuarioSchema.partial().parse(req.body);

    // Buscar el usuario por ID
    const usuarioExistente = await Subusuario.findByPk(tokenData.subusuario_id);

    if (!usuarioExistente) {
    res.status(404).json({ message: "Usuario no encontrado." });
    return
    }


    if (
      validatedData.correo && // Si se está actualizando el correo
      validatedData.correo !== usuarioExistente.dataValues.correo // Y es diferente del actual
    ) {
      const correoExistente = await Subusuario.findOne({
        where: { correo: validatedData.correo }
      });

      if (correoExistente) {
        res.status(400).json({
          message: "El correo electrónico ya está en uso.",
        });
        return
      }
    }

    // Si se envía una nueva contraseña, encriptarla
    if (validatedData.contraseña) {
      validatedData.contraseña = await hashPassword(validatedData.contraseña);
    }

    // Actualizar el usuario con los datos validados
    await usuarioExistente.update(validatedData);

    // Generar un nuevo token con la información actualizada
    const token = JWTManager.createToken({
      subusuario_id: usuarioExistente.dataValues.subusuario_id,
      correo: usuarioExistente.dataValues.correo,
      usuario_principal:usuarioExistente.dataValues.usuario_principal
    });

    res.status(200).json({
      message: "Usuario actualizado exitosamente.",
      token: token,
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

export const eliminarSubUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el ID del usuario desde los parámetros de la solicitud
    const { subusuario_id } = req.body.tokenData;

    // Verificar si el usuario existe
    const su = await Subusuario.findByPk(subusuario_id);

    if (!su) {
      res.status(404).json({ message: "Usuario no encontrado." });
      return
    }

    // Eliminar el registro
    await su.destroy();

    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error: any) {
    res.status(500).json({
      message: "Error al eliminar el usuario.",
      error: error.message,
    });
  }
};