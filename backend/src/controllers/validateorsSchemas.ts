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

export const transaccionProgramadaSchema = z.object({
  tipo: z.enum(["ingreso", "egreso"], {
    required_error: "El tipo es obligatorio y debe ser 'ingreso' o 'egreso'.",
  }),
  titulo: z.string().min(1, "El título es obligatorio."),
  descripcion: z.string().optional(),
  monto: z.number().positive("El monto debe ser un número positivo."),
  categoriaId: z.number({
    required_error: "El ID de la categoría es obligatorio.",
  }).int("El ID de la categoría debe ser un número entero.").optional(),
  
  // Campos adicionales para la transacción programada
  recurrente: z.boolean({
    required_error: "El campo 'recurrente' es obligatorio.",
  }),
  fecha: z.string({
    required_error: "La fecha es obligatoria.",
  }),

  periodo: z
  .enum(["diario", "semanal", "mensual", "anual", "15enal"], {
    required_error: "El periodo es obligatorio y debe ser uno de los siguientes: 'diario', 'semanal', 'mensual', 'anual', '15enal'.",
  })
  .nullable(), // Permitir que el periodo sea null

  cantidadRepeticiones: z.number().int().positive().optional().nullable().refine(val => val === null || val > 0, {
    message: "La cantidad de repeticiones debe ser un número positivo o nulo para repeticiones indefinidas.",
  }),
});

// Esquema de validación para el presupuesto
export const presupuestoSchema = z.object({
  nombre: z.string().min(1, "El nombre del presupuesto es obligatorio."),
  costo: z
    .number()
    .positive("El costo debe ser un valor positivo.")
    .min(0.01, "El costo debe ser mayor a 0."),
  descripcion: z.string().optional(), // Descripción es opcional
  categoriaId: z
    .number()
    .int("El id de categoría debe ser un número entero.")
    .optional() // La categoría es opcional, puede ser null
});