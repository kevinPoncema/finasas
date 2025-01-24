const baseUrl = process.env.VITE_API_URL;
import type {Presupuesto} from "../apitypes"
export async function getpresupuestos(token: string): Promise<Presupuesto[]> {
    try {
      const response = await fetch(`${baseUrl}/presupuestos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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

  // Función para borrar categorías
  export async function deltePresupuestos(token: string,id:number): Promise<Presupuesto[]> {
    try {
      const response = await fetch(`${baseUrl}/presupuestos/${id}`, {
        method: 'delete',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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

  // Función para crear una categoría
  export async function createpresupuesto(token: string, nombre: string,costo:number,descripcion:string,categoriaId:number): Promise<void> {
    try {
      
      // Configuración de la solicitud POST
      const response = await fetch(`${baseUrl}/presupuestos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre,costo,descripcion,categoriaId }), // Enviar el nombre en el cuerpo de la solicitud
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

 export async function Editepresupuestos(token: string, nombre: string,id:number,costo:number,descripcion:string,categoriaId:number): Promise<void> {
  try {
     // Validar que el nombre no esté vacío
     if (!nombre || nombre.trim() === "") {
       throw new Error("El nombre de la categoría no puede estar vacío.");
     }
 
     // Configuración de la solicitud POST
     const response = await fetch(`${baseUrl}/presupuestos/${id}`, {
       method: 'PUT',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ nombre,costo,descripcion,categoriaId }), // Enviar el nombre en el cuerpo de la solicitud
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

 export async function Filtrarpresupuestos(token: string,bodyData:any): Promise<Presupuesto[]> {
  try {
    const response = await fetch(`${baseUrl}/presupuestos/filtrar`, {
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