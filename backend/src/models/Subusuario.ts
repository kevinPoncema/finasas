import { Table, Column, Model, DataType, CreatedAt, ForeignKey } from "sequelize-typescript";
import { Usuario } from "./Usuario";

@Table({
  tableName: "subusuarios",
  timestamps: true,
  underscored: true, // Convierte camelCase a snake_case en columnas
})
export class Subusuario extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  subusuario_id!: number; // Nueva columna como clave primaria

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  usuario_principal!: number; // Clave foránea que apunta a Usuario

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  nombre!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  correo!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  contraseña!: string;

  @CreatedAt
  @Column({
    field: 'creado_en', // Nombre explícito de la columna
  })
  creado_en!: Date;
}
