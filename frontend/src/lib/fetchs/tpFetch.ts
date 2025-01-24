import type { TransaccionProgramada } from "../apitypes";

const baseUrl = process.env.VITE_API_URL;

// Obtener transacciones programadas
export async function getTransaccionesProgramadas(token: string): Promise<TransaccionProgramada[]> {
  try {
    const response = await fetch(`${baseUrl}/transacciones-programadas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error en getTransaccionesProgramadas:', error);
    return [];
  }
}

// Borrar transacción programada
export async function deleteTransaccionProgramada(token: string, id: number): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/transacciones-programadas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error en deleteTransaccionProgramada:', error);
    throw error;
  }
}

// Crear transacción programada
export async function createTransaccionProgramada(
  token: string,
  tipo: string,
  titulo: string,
  descripcion: string,
  monto: number,
  categoriaId: number,
  recurrente: boolean,
  fecha: string,
  periodo: string,
  cantidadRepeticiones: number
): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/transacciones-programadas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo,
        titulo,
        descripcion,
        monto,
        categoriaId,
        recurrente,
        fecha,
        periodo,
        cantidadRepeticiones,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido al crear la transacción programada.');
    }
  } catch (error) {
    console.error('Error en createTransaccionProgramada:', error);
    throw error;
  }
}

// Editar transacción programada
export async function editTransaccionProgramada(
  token: string,
  id: number,
  tipo: string,
  titulo: string,
  descripcion: string,
  monto: number,
  categoriaId: number,
  recurrente: boolean,
  fecha: string,
  periodo: string,
  cantidadRepeticiones: number
): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/transacciones-programadas/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo,
        titulo,
        descripcion,
        monto,
        categoriaId,
        recurrente,
        fecha,
        periodo,
        cantidadRepeticiones,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido al editar la transacción programada.');
    }
  } catch (error) {
    console.error('Error en editTransaccionProgramada:', error);
    throw error;
  }
}
