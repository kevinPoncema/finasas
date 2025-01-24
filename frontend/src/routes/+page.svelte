<script lang="ts">
  import { subuserLogin } from '$lib/fetchs/CAtegoriaFetch'; // Asegúrate de que la ruta sea correcta
  import { onMount } from 'svelte';

  let email: string = '';
  let password: string = '';
  let errorMessage: string | null = null;

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    errorMessage = null;

    try {
      // Llamar a la función subuserLogin
      const token = await subuserLogin(email, password);
      if (token) {
        // Si la autenticación es exitosa, guardar la cookie con los datos
        const userData = {
          nombre: email.split('@')[0], // Usar el nombre del correo como nombre del usuario (puedes ajustarlo si es necesario)
          token: token,
          createdAt: new Date().toISOString(),
        };

        // Crear una cookie con nombre 'userData' y duración de 3 horas
        const expires = new Date();
        expires.setHours(expires.getHours() + 3); // Establecer expiración en 3 horas
        document.cookie = `userData=${JSON.stringify(userData)}; expires=${expires.toUTCString()}; path=/;`;

        // Redirigir o hacer alguna acción después de la autenticación exitosa
        window.location.href = '/dashboard'; // Redirige al dashboard u otra página de la aplicación
      } else {
        errorMessage = 'Credenciales incorrectas';
      }
    } catch (error) {
      errorMessage = 'Hubo un problema al iniciar sesión. Inténtalo de nuevo.';
    }
  };
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <form class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4" on:submit={handleLogin}>
    <h2 class="text-2xl font-bold text-gray-800 text-center">Iniciar Sesión</h2>
    
    <!-- Correo -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
      <input 
        type="email" 
        id="email" 
        bind:value={email} 
        class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
        placeholder="Ingresa tu correo" 
        required 
      />
    </div>
    
    <!-- Contraseña -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
      <input 
        type="password" 
        id="password" 
        bind:value={password} 
        class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
        placeholder="Ingresa tu contraseña" 
        required 
      />
    </div>
    
    <!-- Botón de inicio de sesión -->
    <div>
      <button 
        type="submit" 
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Iniciar Sesión
      </button>
    </div>
    
    <!-- Error message -->
    {#if errorMessage}
      <p class="text-red-500 text-sm text-center">{errorMessage}</p>
    {/if}

    <!-- Enlace de registro -->
    <p class="text-sm text-center text-gray-600">
      ¿No tienes una cuenta? 
      <a href="/register" class="text-blue-500 hover:underline">Regístrate aquí</a>
    </p>
  </form>
</div>
