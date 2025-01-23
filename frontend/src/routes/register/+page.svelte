<script lang="ts">
  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let success = '';

  const registerUser = async () => {
    error = '';
    success = '';

    try {
      // Hacemos la solicitud al endpoint del servidor
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      // Si la respuesta es exitosa, mostramos el mensaje de éxito
      if (!res.ok) {
        throw new Error(data.error || 'Error desconocido');
      }

      success = 'Usuario registrado exitosamente';
    } catch (err) {
      // Si ocurre un error, lo mostramos
      error = err.message;
    }
  };
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <form on:submit|preventDefault={registerUser} class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
      <h2 class="text-2xl font-bold text-gray-800 text-center">Registrarse</h2>

      <!-- Nombre -->
      <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input 
              type="text" 
              id="name" 
              bind:value={name} 
              class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              placeholder="Ingresa tu nombre" 
              required 
          />
      </div>

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

      <!-- Botón de registro -->
      <div>
          <button 
              type="submit" 
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Registrarse
          </button>
      </div>

      <!-- Mensajes -->
      {#if error}
          <p class="text-red-500 text-sm text-center">{error}</p>
      {/if}
      {#if success}
          <p class="text-green-500 text-sm text-center">{success}</p>
      {/if}
  </form>
</div>
