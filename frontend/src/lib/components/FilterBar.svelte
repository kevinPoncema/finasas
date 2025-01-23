<script lang="ts">
    import type { Filter } from "$lib/apitypes"; // Importamos la interfaz
  
    // Definir un prop para manejar el evento en el componente padre
    export let onFilterSelect: (filterName: string) => void;
  
    // Arreglo de filtros predefinidos (esto puede ser dinámico)
    export let filters: Filter[] = [];
  
    // Estado de visibilidad para el menú de filtros
    let isFilterMenuOpen = false;
  
    // Cerrar el menú cuando se haga clic en una opción
    const handleFilterSelect = (filterName: string) => {
      isFilterMenuOpen = false;
      // Emitir el evento hacia el componente padre
      onFilterSelect(filterName);
    };
  </script>
  
  <div class="p-1 space-y-2 bg-white shadow-md rounded-lg">
    <!-- Contenedor para los botones, centrados -->
    <div class="flex justify-center items-center space-x-2">
      <!-- Botón "Agregar parámetro" -->
      <button
        class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
      >
        + Agregar parámetro
      </button>
  
      <!-- Botón "Agregar filtro" y lista desplegable -->
      <div class="relative">
        <button
          on:click={() => (isFilterMenuOpen = !isFilterMenuOpen)}
          class="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
        >
          + Agregar filtro
        </button>
  
        {#if isFilterMenuOpen}
          <div class="absolute left-0 mt-2 bg-white shadow-lg rounded-lg border w-40 p-2">
            <ul>
              {#each filters as filter}
                <li
                  on:click={() => handleFilterSelect(filter.name)}
                  class="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {filter.name}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <style>
    button {
      transition: background-color 0.3s;
    }
  
    button:hover {
      background-color: #2563eb;
    }
  
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
  
    li {
      transition: background-color 0.3s;
    }
  
    li:hover {
      background-color: #f3f4f6;
    }
  </style>
  