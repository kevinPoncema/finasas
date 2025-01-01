import { Table, Column, Model, DataType, CreatedAt, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Subusuario } from "./Subusuario";

@Table({
  tableName: "transacciones",
  timestamps: true,
  underscored: true, // Convierte camelCase a snake_case en columnas
})
export class Transaccion extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  transaccion_id!: number; // Nueva clave primaria

  @ForeignKey(() => Subusuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  subusuario_id!: number | null; // Clave foránea al modelo Subusuario

  @BelongsTo(() => Subusuario)
  subusuario!: Subusuario; // Define la relación con el modelo Subusuario

  @Column({
    type: DataType.ENUM("ingreso", "egreso"),
    allowNull: false,
  })
  tipo!: "ingreso" | "egreso";

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  monto!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  título!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descripción!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  fecha!: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  categoría!: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  etiquetas!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  recurrente!: boolean;

  @Column({
    type: DataType.ENUM("diaria", "semanal", "mensual", "anual"),
    allowNull: true,
  })
  frecuencia!: "diaria" | "semanal" | "mensual" | "anual" | null;

  @CreatedAt
  @Column({
    field: 'creado_en', // Nombre explícito de la columna
  })
  creado_en!: Date;
}
