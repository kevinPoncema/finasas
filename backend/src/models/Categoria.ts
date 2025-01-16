import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Subusuario } from "./Subusuario";

@Table({
  tableName: "categorias",
  timestamps: true, // Maneja automáticamente createdAt y updatedAt
  underscored: true, // Convierte camelCase a snake_case en columnas
})
export class Categoria extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number; // ID auto-incremental

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true, // Asegura que el nombre sea único
  })
  nombre!: string;

  // Clave foránea a Subusuario
  @ForeignKey(() => Subusuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Este campo puede ser nulo si no está asociado a un subusuario
  })
  subusuario_id!: number | null;

  @BelongsTo(() => Subusuario)
  subusuario!: Subusuario; // Relación inversa con Subusuario

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
