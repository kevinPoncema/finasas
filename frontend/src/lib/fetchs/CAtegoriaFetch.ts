import type { LoginResponse } from "../apitypes";
import type { Categoria } from "../apitypes";
const baseUrl = process.env.VITE_API_URL;

export async function subuserLogin(correo: string, contraseña: string): Promise<string | null> {
  try {
    const response = await fetch(`${baseUrl}/subuser/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo,
        contraseña,
      }),
    });

    if (response.ok) {
      const data: LoginResponse = await response.json();
      return data.token;  // Retornar el token
    } else {
      // Si la respuesta no es exitosa, lanzar un error
      const errorData = await response.json();
      console.error('Error de API:', errorData.message);
      throw new Error(errorData.message || 'Error desconocido');
    }
  } catch (error) {
    // Captura de errores generales
    console.error('Error en login:', error);
    return null;  // Retornar null si hay un error
  }
}

// Función para obtener categorías
export async function getCategorias(token: string): Promise<Categoria[]> {
  try {
    const response = await fetch(`${baseUrl}/categorias`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      //console.log('Categorías obtenidas exitosamente:', data.message);
      return data.categorias;
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

// Función para crear una categoría
export async function createCategoria(token: string, nombre: string): Promise<void> {
  try {
    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === "") {
      throw new Error("El nombre de la categoría no puede estar vacío.");
    }

    // Configuración de la solicitud POST
    const response = await fetch(`${baseUrl}/categorias`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }), // Enviar el nombre en el cuerpo de la solicitud
    });

    // Manejar la respuesta
    if (response.ok) {
      console.log("Categoría creada exitosamente.");
    } else {
      // Si la respuesta no es exitosa, manejar el error
      const errorData = await response.json();
      console.error("Error de API:", errorData.message);
      throw new Error(errorData.message || "Error desconocido al crear la categoría.");
    }
  } catch (error) {
    // Captura de errores generales
    console.error("Error en createCategoria:", error);
    throw error; // Relanzar el error para que sea manejado externamente
  }
}

// Función para crear una categoría
export async function EditeCategoria(token: string, nombre: string,id:number): Promise<void> {
  try {
    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === "") {
      throw new Error("El nombre de la categoría no puede estar vacío.");
    }

    // Configuración de la solicitud POST
    const response = await fetch(`${baseUrl}/categorias/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }), // Enviar el nombre en el cuerpo de la solicitud
    });

    // Manejar la respuesta
    if (!response.ok) {
     // Si la respuesta no es exitosa, manejar el error
     const errorData = await response.json();
     console.error("Error de API:", errorData.message);
     throw new Error(errorData.message || "Error desconocido al crear la categoría.");
    }
  } catch (error) {
    // Captura de errores generales
    console.error("Error en createCategoria:", error);
    throw error; // Relanzar el error para que sea manejado externamente
  }
}

// Función para borrar categorías
export async function delteCategorias(token: string,id:number): Promise<Categoria[]> {
  try {
    const response = await fetch(`${baseUrl}/categorias/${id}`, {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      //console.log('Categorías obtenidas exitosamente:', data.message);
      return data.categorias;
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

// Función para obtener categorías filtradas por nombre
export async function getCategoriasPorNombre(token: string, nombre: string): Promise<Categoria[]> {
  try {
    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === "") {
      throw new Error("El nombre para filtrar categorías no puede estar vacío.");
    }

    // Configuración de la solicitud POST
    const response = await fetch(`${baseUrl}/categorias/filtrar-por-nombre`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }), // Pasar el nombre en el cuerpo de la solicitud
    });

    // Manejar la respuesta
    if (response.ok) {
      const data = await response.json();
      console.log("Categorías filtradas obtenidas exitosamente:", data);
      return data; // Devolver las categorías obtenidas
    } else {
      // Si la respuesta no es exitosa, manejar el error
      const errorData = await response.json();
      console.error("Error de API:", errorData.message);
      throw new Error(errorData.message || "Error desconocido al obtener categorías.");
    }
  } catch (error) {
    // Captura de errores generales
    console.error("Error en getCategoriasPorNombre:", error);
    return []; // Retornar un array vacío si hay un error
  }
}
