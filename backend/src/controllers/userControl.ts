import { Request, Response } from "express";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@utils/passwordEncryted";
import { JWTManager } from "@utils/JWTManager";
import { Usuario } from "@models/Usuario";

// Validar los datos de entrada con Zod
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("Debe ser un correo electrónico válido."),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

const usuarioLoginSchema = z.object({
  correo: z.string().email("Debe ser un correo electrónico válido."),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar el cuerpo de la solicitud
    const validatedData = usuarioSchema.parse(req.body);

    // Verificar si el correo ya existe
    const correoExistente = await Usuario.findOne({
      where: { correo: validatedData.correo }
    });

    if (correoExistente) {
      return res.status(400).json({
        message: "El correo electrónico ya está en uso.",
      });
    }

    // Encriptar la contraseña
    const encrytedPassword = await hashPassword(validatedData.contraseña);

    // Crear el usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      correo: validatedData.correo,
      contraseña: encrytedPassword,
    });

    // Generar el token de autenticación
    const token = JWTManager.createToken({
      id: nuevoUsuario.usuario_id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
    });

    res.status(201).json({
      message: "Usuario creado exitosamente.",
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
        message: "Error al crear el usuario.",
        error: error.message,
      });
    }
  }
};

export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el ID del usuario desde el token
   
    const { tokenData, ...rest } = req.body;
    req.body = rest; // Asigna el resto al cuerpo de la solicitud

    if (!tokenData.id) {
      return res.status(400).json({ message: "El ID del usuario es obligatorio." });
    }

    // Validar el cuerpo de la solicitud (permitir campos opcionales)
    const validatedData = usuarioSchema.partial().parse(req.body);

    // Buscar el usuario por ID
    const usuarioExistente = await Usuario.findByPk(tokenData.id);

    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Verificar si el correo ya está siendo usado por otro usuario
    if (validatedData.correo && validatedData.correo !== usuarioExistente.correo) {
      const correoExistente = await Usuario.findOne({
        where: { correo: validatedData.correo }
      });

      if (correoExistente) {
        return res.status(400).json({
          message: "El correo electrónico ya está en uso.",
        });
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
      id: usuarioExistente.usuario_id,
      nombre: usuarioExistente.nombre,
      correo: usuarioExistente.correo,
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


export const logInUsario = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar el cuerpo de la solicitud
    const validatedData = usuarioLoginSchema.parse(req.body);
    const {correo, contraseña } = validatedData;

 // Buscar el usuario en la base de datos por correo
    const usuario = await Usuario.findOne({
    where: { correo },
    });



    // Si el usuario no se encuentra
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    // Comparar la contraseña proporcionada con la almacenada (encriptada) en la base de datos
    const contraseñaValida = await verifyPassword(contraseña,usuario.dataValues.contraseña);
    console.log(contraseñaValida)
    if (!contraseñaValida) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
      });
    }

    // Generar el token de autenticación
    const token = JWTManager.createToken({
      id: usuario.usuario_id,
      correo: usuario.correo,
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
