import { json } from '@sveltejs/kit';

// Función para obtener el token de implementación
async function getImplementationToken(fetch: any): Promise<string | null> {
    const baseUrl = process.env.VITE_API_URL;
    
    try {
        const loginRes = await fetch(`${baseUrl}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: process.env.VITE_API_MAIL,
                contraseña: process.env.VITE_API_PASSWORD,
                // ... otros 20 parámetros
            })
        });

        if (!loginRes.ok) throw new Error('Error al autenticar implementación');

        const { token } = await loginRes.json();
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para registrar el subusuario
async function registerSubuser(fetch: any, token: string, name: string, email: string, password: string): Promise<{ success: boolean, message: string }> {
    const baseUrl = process.env.VITE_API_URL;
    
    try {
        const subuserRes = await fetch(`${baseUrl}/subuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: name,
                correo: email,
                contraseña: password
            })
        });

        if (!subuserRes.ok) throw new Error('Error al registrar el usuario');
        
        const { message } = await subuserRes.json();
        return { success: true, message };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al registrar el usuario' };
    }
}

// Endpoint que maneja la lógica de registro
export const POST = async ({ request, fetch }) => {
    const { name, email, password } = await request.json();

    // Obtener token de implementación
    const token = await getImplementationToken(fetch);
    if (!token) {
        return json({ error: 'No se pudo obtener el token de implementación' }, { status: 500 });
    }

    // Registrar subusuario
    const result = await registerSubuser(fetch, token, name, email, password);
    if (!result.success) {
        return json({ error: result.message }, { status: 500 });
    }

    return json({ success: true, message: result.message });
};
