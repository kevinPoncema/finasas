import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: "usuarios",
  timestamps: true, // Esto maneja automáticamente createdAt y updatedAt
})
export class Usuario extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

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
  creado_en!: Date;

  @UpdatedAt
  actualizado_en!: Date;
}
