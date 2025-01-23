<script lang="ts">
  export let position: 'left' | 'right' = 'left'; // Define si el menú aparece a la izquierda o derecha
  let isMenuOpen = false;
  let isExportSubmenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    isExportSubmenuOpen = false; // Cierra el submenú al cerrar el menú principal
  };

  const toggleExportSubmenu = () => {
    isExportSubmenuOpen = !isExportSubmenuOpen;
  };
</script>

<style>
  .backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    inset: 0;
    z-index: 40;
  }
</style>

<div class="relative flex h-screen">
  <!-- Botón hamburguesa (siempre visible) -->
  <button
    class="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-400"
    on:click={toggleMenu}
  >
    <div class="space-y-1">
      <span class="block w-6 h-0.5 bg-white"></span>
      <span class="block w-6 h-0.5 bg-white"></span>
      <span class="block w-6 h-0.5 bg-white"></span>
    </div>
  </button>

  <!-- Fondo oscuro (para móviles) -->
  {#if isMenuOpen}
    <div class="backdrop" on:click={toggleMenu}></div>
  {/if}

  <!-- Menú lateral -->
  <div
    class={`fixed top-0 ${position}-0 md:relative md:w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
      !isMenuOpen && position === 'left' ? 'translate-x-[-100%]' : ''
    } ${
      !isMenuOpen && position === 'right' ? 'translate-x-[100%]' : ''
    }`}
  >
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-bold">Menú</h2>
    </div>
    <ul class="space-y-2 p-4">
      <li>
        <a href="/dashboard" class="block px-4 py-2 rounded-md hover:bg-gray-100">Dashboard</a>
      </li>
      <li>
        <a href="/categorias" class="block px-4 py-2 rounded-md hover:bg-gray-100">Categorías</a>
      </li>
      <li>
        <a href="/presupuesto" class="block px-4 py-2 rounded-md hover:bg-gray-100">Presupuesto</a>
      </li>
      <li>
        <a href="/transacciones" class="block px-4 py-2 rounded-md hover:bg-gray-100">Transacciones</a>
      </li>
      <li>
        <a
          href="/transacciones-programadas"
          class="block px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Transacciones Programadas
        </a>
      </li>
      <li>
        <!-- Submenú para "Exportar" -->
        <div>
          <button
            class="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-gray-100"
            on:click={toggleExportSubmenu}
          >
            Exportar
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {#if isExportSubmenuOpen}
            <ul class="ml-4 space-y-2 mt-2">
              <li>
                <a
                  href="/export/pdf"
                  class="block px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                >
                  PDF
                </a>
              </li>
              <li>
                <a
                  href="/export/excel"
                  class="block px-4 py-2 text-sm rounded-md hover:bg-gray-100"
                >
                  Excel
                </a>
              </li>
            </ul>
          {/if}
        </div>
      </li>
    </ul>
  </div>

  <!-- Contenido principal -->
  <main
    class={`flex-1 p-4 transform transition-transform duration-300 ease-in-out ${
      isMenuOpen && position === 'left' ? 'md:ml-64' : ''
    } ${
      isMenuOpen && position === 'right' ? 'md:mr-64' : ''
    }`}
  >
    <slot />
  </main>
</div>
