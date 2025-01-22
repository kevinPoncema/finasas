<div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <form class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
      <h2 class="text-2xl font-bold text-gray-800 text-center">Iniciar Sesión</h2>
      
      <!-- Correo -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
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
          name="password" 
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
      
      <!-- Enlace de registro -->
      <p class="text-sm text-center text-gray-600">
        ¿No tienes una cuenta? 
        <a href="/register" class="text-blue-500 hover:underline">Regístrate aquí</a>
      </p>
    </form>
  </div>
  