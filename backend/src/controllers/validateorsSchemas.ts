import { Transaccion } from './../models/Transaccion';
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

export const transaccionSchema = z.object({
  tipo: z.enum(["ingreso", "egreso"], {
    required_error: "El tipo es obligatorio y debe ser 'ingreso' o 'egreso'.",
  }),
  titulo: z.string().min(1, "El título es obligatorio."),
  descripcion: z.string().optional(),
  monto: z.number().positive("El monto debe ser un número positivo."),
  categoriaId: z.number({
    required_error: "El ID de la categoría es obligatorio.",
  }).int("El ID de la categoría debe ser un número entero.").optional(),
});
