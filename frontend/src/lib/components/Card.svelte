<script>
    import { createEventDispatcher } from "svelte";
  
    export let cardClasses = ""; // Permite añadir clases extra si es necesario
    export let submenuPosition = "right"; // Posición del submenú (left o right)
  
    let isMenuOpen = false;
    const dispatch = createEventDispatcher();
  
    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
    };
  
    const handleEdit = () => {
      dispatch("edit");
      isMenuOpen = false;
    };
  
    const handleDelete = () => {
      dispatch("delete");
      isMenuOpen = false;
    };
  </script>
  
  <div class={`relative p-4 rounded-lg shadow-md bg-white ${cardClasses}`}>
    <!-- Contenido de la card -->
    <slot />
  
    <!-- Botón de opciones -->
    <button
      class="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-200"
      on:click={toggleMenu}
    >
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
          d="M6 12h.01M12 12h.01M18 12h.01"
        />
      </svg>
    </button>
  
    <!-- Submenú -->
    {#if isMenuOpen}
      <ul
        class={`absolute top-10 ${
          submenuPosition === "right" ? "right-2" : "left-2"
        } bg-white shadow-lg rounded-md border border-gray-200 py-1 z-50 w-36`}
      >
        <li>
          <button
            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            on:click={handleEdit}
          >
            Editar
          </button>
        </li>
        <li>
          <button
            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
            on:click={handleDelete}
          >
            Borrar
          </button>
        </li>
      </ul>
    {/if}
  </div>
  
  <style>
    /* Si quieres agregar animaciones personalizadas al menú */
    ul {
      transition: opacity 0.2s ease-in-out;
    }
  </style>
  