// Validar los datos de entrada con Zod
import { z } from "zod";
export const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("Debe ser un correo electrónico válido."),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const usuarioLoginSchema = z.object({
  correo: z.string().email("Debe ser un correo electrónico válido."),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const CategoriaSchema = z.object({
  nombre: z.string().min(1)
})