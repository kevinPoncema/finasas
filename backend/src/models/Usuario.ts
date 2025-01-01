import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: "usuarios",
  timestamps: true, // Maneja automáticamente createdAt y updatedAt
  underscored: true, // Convierte camelCase a snake_case en columnas
})
export class Usuario extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  usuario_id!: number; // Nueva columna agregada como identificador único

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  nombre!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Valida que el correo sea un formato válido
    },
  })
  correo!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  contraseña!: string;

  @CreatedAt
  @Column({
    field: 'creado_en', // Define explícitamente el nombre de la columna
  })
  creado_en!: Date;

  @UpdatedAt
  @Column({
    field: 'actualizado_en', // Define explícitamente el nombre de la columna
  })
  actualizado_en!: Date;
}
