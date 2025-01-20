import { Table, Column, Model, DataType, CreatedAt, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Subusuario } from "./Subusuario";
import { Categoria } from "./Categoria";

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
  transaccion_id!: number; // Clave primaria

  // Relación con Subusuario
  @ForeignKey(() => Subusuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  subusuario_id!: number | null; // Clave foránea al modelo Subusuario

  @BelongsTo(() => Subusuario)
  subusuario!: Subusuario; // Relación con Subusuario

  // Tipo de transacción (ingreso o egreso)
  @Column({
    type: DataType.ENUM("ingreso", "egreso"),
    allowNull: false,
  })
  tipo!: "ingreso" | "egreso";

  // Monto de la transacción
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  monto!: number;

  // Título de la transacción
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  titulo!: string;

  // Descripción de la transacción
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descripcion!: string | null;


  // Relación con Categoría
  @ForeignKey(() => Categoria)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  categoria_id!: number | null; // Clave foránea a la tabla Categoria

  @BelongsTo(() => Categoria)
  categoria!: Categoria; // Relación con Categoria


  // Tiempos de creación y actualización
  @CreatedAt
  @Column({
    field: 'creado_en',
  })
  creado_en!: Date;
}
