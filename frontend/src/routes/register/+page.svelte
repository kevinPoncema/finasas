<div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <form class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
      <h2 class="text-2xl font-bold text-gray-800 text-center">Registro</h2>
      
      <!-- Nombre -->
      <div>
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
          placeholder="Ingresa tu nombre" 
          required
        />
      </div>
      
      <!-- Correo -->
      <div>
        <label for="correo" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
        <input 
          type="email" 
          id="correo" 
          name="correo" 
          class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
          placeholder="Ingresa tu correo" 
          required
        />
      </div>
      
      <!-- Contraseña -->
      <div>
        <label for="contraseña" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input 
          type="password" 
          id="contraseña" 
          name="contraseña" 
          class="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
          placeholder="Crea una contraseña" 
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

        <!-- Enlace de loging -->
        <p class="text-sm text-center text-gray-600">
          ¿ya tienes una cuenta? 
          <a href="/" class="text-blue-500 hover:underline">Incia secion aquí</a>
        </p>
    </form>
  </div>
  