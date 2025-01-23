<script lang="ts">
    import authValidation from "$lib/helpers/authValidation";
    import SideMenu from "$lib/components/SideMenu.svelte";
    import { onMount } from "svelte";
    import type { UserData } from "$lib/apitypes";
    import FilterBar from '$lib/components/FilterBar.svelte';
    import type { Filter } from "$lib/apitypes"

  
    let userData: UserData | null = null;
    let filters: Filter[] = [
    { name: "Fecha", type: "input", options: null },
    { name: "Categoría", type: "select", options: ["Comida", "Transporte", "Salud"] }
  ];

    onMount(() => {
      userData = authValidation();
      if (!userData) {
        console.log("Redirigiendo al usuario no autenticado...");
        window.location.href = "/";
      } else {
        console.log("Datos del usuario:", userData);
      }
    });
  </script>
  
  <style>
    main {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .content {
      padding: 1rem;
      flex-grow: 1;
    }
  </style>
  
  <main>
    <!-- Componente SideMenu -->
    <SideMenu>
      <!-- Contenido principal -->
      <div class="content">
     <FilterBar filters={filters} />
      </div>
    </SideMenu>
  </main>
  