import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import { Subusuario } from "./Subusuario"; // Asegúrate de tener este modelo
import { Categoria } from "./Categoria"; // Asegúrate de tener este modelo

@Table({
  tableName: "transacciones_programadas", // Nombre de la tabla
  timestamps: true, // Maneja automáticamente createdAt y updatedAt
  underscored: true, // Convierte camelCase a snake_case en las columnas
})
export default class TransaccionProgramada extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  transacciones_programadas_id!: number; // ID de la transacción programada

  // Subusuario relacionado con la transacción programada
  @ForeignKey(() => Subusuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subusuario_id!: number;

  @BelongsTo(() => Subusuario)
  subusuario!: Subusuario;

  // Título de la transacción programada
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  titulo!: string;

  // Descripción de la transacción (opcional)
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  descripcion?: string;

  // Categoría relacionada con la transacción (opcional)
  @ForeignKey(() => Categoria)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  categoria_id?: number;

  @BelongsTo(() => Categoria)
  categoria?: Categoria;

  // Monto de la transacción programada
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  monto!: number;

  // Tipo de la transacción (ingreso o egreso)
  @Column({
    type: DataType.ENUM("ingreso", "egreso"),
    allowNull: false,
  })
  tipo!: "ingreso" | "egreso";

  // Indicador de recurrencia (si es recurrente o no)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  recurrente!: boolean;

  // Fecha de inicio de la transacción programada
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  fecha!: Date;

  // Periodo de recurrencia (diario, semanal, mensual, anual)
  @Column({
    type: DataType.ENUM("diario", "semanal", "mensual", "anual", "15enal"),
    allowNull: false,
  })
  periodo!: "diario" | "semanal" | "mensual" | "anual" | "15enal";

  // Número de repeticiones. Null significa que se repetirá indefinidamente.
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  cantidad_repeticiones?: number;

  // Número de repeticiones realizadas, con valor predeterminado de 0
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0, // Valor predeterminado
  })
  repeticiones!: number;

  @CreatedAt
  @Column({
    field: 'creado_en', // Nombre explícito de la columna
  })
  creado_en!: Date;

  @UpdatedAt
  @Column({
    field: 'actualizado_en', // Nombre explícito de la columna
  })
  actualizado_en!: Date;
}
