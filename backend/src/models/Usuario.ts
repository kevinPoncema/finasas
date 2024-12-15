// models/Usuario.ts
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

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  token!: string | null;

  @CreatedAt
  creado_en!: Date;
}
