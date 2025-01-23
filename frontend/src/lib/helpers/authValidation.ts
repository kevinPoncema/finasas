import type { UserData } from "$lib/apitypes";
  
  export default function authValidation(): UserData | null {
    try {
      // Verificar si estamos en el cliente
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.warn('authValidation se ejecutó en un entorno donde window o document no están disponibles.');
        return null;
      }
  
      // Obtener la cookie `userData`
      const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);
  
      const userDataString = cookies['userData'];
  
      // Verificar si la cookie existe
      if (!userDataString) {
        if (typeof window !== 'undefined') {
          window.location.href = '/'; // Redirigir a la página raíz
        }
        return null;
      }
  
      // Parsear la cookie
      const userData: UserData = JSON.parse(userDataString);
  
      // Verificar que contenga los campos requeridos
      if (!userData.token || !userData.nombre || !userData.createdAt) {
        if (typeof window !== 'undefined') {
          window.location.href = '/'; // Redirigir si faltan campos
        }
        return null;
      }
  
      // Retornar los datos si son válidos
      return userData;
    } catch (error) {
      console.error('Error en la validación de autenticación:', error);
      if (typeof window !== 'undefined') {
        window.location.href = '/'; // Redirigir en caso de error
      }
      return null;
    }
  }
  