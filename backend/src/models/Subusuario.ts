// models/Subusuario.ts
import { Table, Column, Model, DataType, CreatedAt, ForeignKey } from "sequelize-typescript";
import { Usuario } from "./Usuario";

@Table({
  tableName: "subusuarios",
  timestamps: true,
})
export class Subusuario extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })


  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  usuario_principal!: number;

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
}
