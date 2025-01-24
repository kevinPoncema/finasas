import type { TotalesResponse } from "$lib/apitypes";

const baseUrl = process.env.VITE_API_URL;

export async function getTotales(token: string): Promise<TotalesResponse | null> {
  try {
    const response = await fetch(`${baseUrl}/totales`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data: TotalesResponse = await response.json();
      return data;
    } else {
      // Si la respuesta no es exitosa, lanzar un error
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido');
    }
  } catch (error) {
    // Captura de errores generales
    console.error('Error en getpresupuestos:', error);
    throw error;  // Rethrow error to handle it further up the call stack
  }
}
