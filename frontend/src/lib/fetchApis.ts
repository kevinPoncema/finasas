import type { LoginResponse } from "./apitypes";
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
