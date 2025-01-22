import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Subusuario } from "./Subusuario";

@Table({
  tableName: "control_totales",
  timestamps: true, // Sequelize manejará automáticamente createdAt y updatedAt
  underscored: true, // Convierte camelCase a snake_case en columnas
})
export class ControlTotales extends Model {
  // Asegúrate de definir las propiedades como columnas usando los decoradores adecuados

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number; // ID auto-incremental

  // Total de ingresos
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  total_ingresos!: number;

  // Total de egresos
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  total_egresos!: number;

    // Total de egresos
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    })
    total_presupuesto_previsto!: number;

  // Clave foránea a Subusuario
  @ForeignKey(() => Subusuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  subusuario_id!: number;

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
