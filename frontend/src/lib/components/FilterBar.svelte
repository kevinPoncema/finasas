<script lang="ts">
  import type { Filter } from "$lib/apitypes";

  export let filters: Filter[] = [];
  export let alignment: 'left' | 'right' = 'right'; // Configuración de alineación
  export let itemName = "parametro";
  export let createItem = () => { };
  export let searchEve = (filterData: any) => { };

  let isFilterMenuOpen = false;
  let areFiltersVisible = true; // Control de visibilidad de los filtros
  let addedFilters: { name: string; type: string; field: string; options?: { nombre: string, value: string }[] }[] = [];

  const handleFilterSelect = (filter: Filter) => {
    isFilterMenuOpen = false;
    if (!addedFilters.some((f) => f.name === filter.name)) {
      addedFilters = [
        ...addedFilters,
        {
          name: filter.name,
          type: filter.type,
          field: '',
          options: filter.options || []
        }
      ];
      areFiltersVisible = true; // Mostrar automáticamente los filtros si se agrega uno
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    addedFilters[index].field = value; // Cambia el valor del filtro seleccionado
  };

  const removeFilter = (index: number) => {
    addedFilters = addedFilters.filter((_, i) => i !== index);
  };

  const toggleFilters = () => {
    areFiltersVisible = !areFiltersVisible;
  };

  const handleSearch = () => {
    // Mapear los filtros para crear un nuevo objeto con name y value
    const formattedFilters = addedFilters.map(({ name, field }) => ({
      name,
      value: field.trim(), // Asegurarnos de que no haya espacios en blanco
    }));

    // Verificar si alguno de los filtros está vacío
    const hasEmptyFilters = formattedFilters.some(filter => !filter.value);

    if (hasEmptyFilters) {
      alert("No se puede buscar con filtros vacíos");
      return;
    }

    // Si todos los filtros son válidos, emite el evento o realiza alguna acción
    console.log("Filtros listos para búsqueda:", formattedFilters);
    searchEve(formattedFilters);
  };
</script>

<div class="p-2 bg-white shadow-md rounded-lg">
  <!-- Barra de botones centrados -->
  <div class="flex justify-center items-center space-x-2">
    <button class="bg-blue-500 text-white px-3 py-1 rounded-md text-sm" on:click={createItem}>
      + Agregar {itemName}
    </button>

    <div class="relative">
      <button
        on:click={() => (isFilterMenuOpen = !isFilterMenuOpen)}
        class="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
      >
        + Agregar filtro
      </button>

      {#if isFilterMenuOpen}
        <div class="absolute left-0 mt-2 bg-white shadow-lg rounded-lg border w-40 p-2 z-50">
          <ul>
            {#each filters as filter}
              <li
                on:click={() => handleFilterSelect(filter)}
                class="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {filter.name}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    <!-- Botón de búsqueda -->
    <button
      on:click={handleSearch}
      class="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600"
    >
      Buscar
    </button>
  </div>

  <!-- Contenedor del botón de mostrar/ocultar filtros -->
  {#if addedFilters.length > 0}
    <div class="flex justify-end mt-2">
      <button
        on:click={toggleFilters}
        class="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-transform duration-300"
      >
        {#if areFiltersVisible}
          <span class="mr-1">Ocultar filtros</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform rotate-0" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 15.293a1 1 0 011.414 0L16.707 10.293a1 1 0 10-1.414-1.414L12 12.586 8.707 9.293a1 1 0 00-1.414 1.414l4 4z" clip-rule="evenodd" />
          </svg>
        {:else}
          <span class="mr-1">Mostrar filtros</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform rotate-180" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 15.293a1 1 0 011.414 0L16.707 10.293a1 1 0 10-1.414-1.414L12 12.586 8.707 9.293a1 1 0 00-1.414 1.414l4 4z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
    </div>
  {/if}

  <!-- Contenedor para los filtros agregados -->
  {#if areFiltersVisible}
    <div class={`mt-4 flex flex-wrap lg:${alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-5xl">
        {#each addedFilters as { name, type, field, options }, index}
          <div class="flex items-center space-x-2">
            <div class="w-full">
              <label class="block text-sm font-medium mb-1">{name}</label>

              {#if type === 'input'}
                <input
                  type="text"
                  class="px-3 py-1 border rounded-md w-full"
                  bind:value={addedFilters[index].field}
                  placeholder={`Ingresa ${name}`}
                  on:input={(e) => handleFieldChange(index, e.target.value)}
                />
              {:else if type === 'select'}
                <select
                  class="px-3 py-1 border rounded-md w-full"
                  on:change={(e) => handleFieldChange(index, e.target.value)}
                >
                  <option value="" disabled selected>Seleccionar {name}</option>
                  {#each options as option}
                    <option value={option.value || option.nombre}>{option.nombre}</option>
                  {/each}
                </select>
              {:else if type === 'date'}
                <div class="flex space-x-2">
                  <input
                    type="date"
                    class="px-3 py-1 border rounded-md w-full"
                    bind:value={addedFilters[index].field}
                    on:input={(e) => handleFieldChange(index, e.target.value)}
                  />
                </div>
              {/if}
            </div>

            <!-- Botón de eliminar -->
            <button
              on:click={() => removeFilter(index)}
              class="bg-red-500 text-white px-2 py-1 rounded-md text-sm flex items-center"
            >
              <span>&times;</span>
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  button {
    transition: background-color 0.3s, transform 0.3s;
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

  .bg-red-500:hover {
    background-color: #dc2626;
  }
</style>