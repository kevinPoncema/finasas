export interface Categoria {
    id: number;
    nombre: string;
    subusuario_id: number | null;
    creado_en: Date;
    actualizado_en: Date;
  }
  

  export interface Presupuesto {
    presupuesto_id: number;
    costo: number;
    nombre: string;
    descripcion?: string;
    categoria_id: number;
    categoria?: Categoria;
    creado_en: Date;
  }

  export interface Transaccion {
    transaccion_id: number;
    subusuario_id: number | null;
    tipo: "ingreso" | "egreso";
    monto: number;
    titulo: string;
    descripcion?: string | null;
    categoria_id: number | null;
    categoria?: Categoria;
    creado_en: Date;
}

export interface TransaccionProgramada {
    transacciones_programadas_id: number;
    subusuario_id: number;
    titulo: string;
    descripcion?: string;
    categoria_id?: number;
    categoria?: Categoria;
    monto: number;
    tipo: "ingreso" | "egreso";
    recurrente: boolean;
    fecha: string;
    periodo: "diario" | "semanal" | "mensual" | "anual" | "15enal";
    cantidad_repeticiones?: number;
    repeticiones: number;
    creado_en: Date;
    actualizado_en: Date;
  }


export interface LoginResponse {
    message: string;
    token: string;
  }

export interface UserData {
  nombre: string;
  token: string;
  createdAt: string;
}

export type option ={
  nombre:string,
  value:any
}
export interface Filter {
  name: string;
  type: 'input' | 'select' | 'date' | 'chek';
  options: option[] | null;
}

export interface TotalesResponse {
  total_ingresos: number;
  total_egresos: number;
  total_presupuesto_previsto: number;
  total_general: number;
  egreso_mensual:number | null;
  ingreso_mensual:number | null;
}


export interface CategorySummary {
  categoria: {
    id: number;
    nombre: string;
  };
  totalTransacciones: number;
  totalMonto: number;
  porcentaje: string;
}
