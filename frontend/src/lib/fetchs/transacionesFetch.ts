import type { Transaccion } from "../apitypes";
import {handleDateRange} from "$lib/helpers/formatearFecha"
const baseUrl = process.env.VITE_API_URL;

// Obtener transacciones
export async function getTransacciones(token: string): Promise<Transaccion[]> {
  try {
    const response = await fetch(`${baseUrl}/transacciones`, {
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
    console.error('Error en getTransacciones:', error);
    return [];
  }
}

// Borrar transacción
export async function deleteTransaccion(token: string, id: number): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/transacciones/${id}`, {
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
    console.error('Error en deleteTransaccion:', error);
    throw error;
  }
}

// Crear transacción
export async function createTransaccion(
  token: string,
  titulo: string,
  descripcion: string,
  monto: number,
  tipo: string,
  categoriaId: number
): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/transacciones`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ titulo, descripcion, monto, tipo, categoriaId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido al crear la transacción.');
    }
  } catch (error) {
    console.error('Error en createTransaccion:', error);
    throw error;
  }
}

// Editar transacción
export async function editTransaccion(
  token: string,
  id: number,
  titulo: string,
  descripcion: string,
  monto: number,
  tipo: string,
  categoriaId: number
): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/transacciones/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ titulo, descripcion, monto, tipo, categoriaId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido al editar la transacción.');
    }
  } catch (error) {
    console.error('Error en editTransaccion:', error);
    throw error;
  }
}

 export async function filtrarTransacciones(token: string,bodyData:any): Promise<Transaccion[]> {
  try {
    if (bodyData.fecha_inicio || bodyData.fecha_fin) {
      const f =handleDateRange(bodyData.fecha_inicio,bodyData.fecha_fin);
      bodyData.fecha_inicio=f.startDate;
      bodyData.fecha_fin = f.endDate
    }
    const response = await fetch(`${baseUrl}/transacciones/filtrar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
    });

    if (response.ok) {
      const data = await response.json();
      //console.log('Categorías obtenidas exitosamente:', data.message);
      return data;
    } else {
      // Si la respuesta no es exitosa, lanzar un error
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido');
    }
  } catch (error) {
    // Captura de errores generales
    console.error('Error en getCategorias:', error);
    return [];  // Retornar un array vacío si hay un error
  }
}