<script lang="ts">
  import authValidation from "$lib/helpers/authValidation";
  import SideMenu from "$lib/components/SideMenu.svelte";
  import { onMount } from "svelte";
  import type { UserData, Presupuesto, Filter, Categoria } from "$lib/apitypes";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import { getCategorias } from "$lib/fetchs/CAtegoriaFetch";
  import {
    getpresupuestos,
    deltePresupuestos,
    createpresupuesto,
    Editepresupuestos,
  } from "$lib/fetchs/presupuestoFetch";

  let userData: UserData | null = null;
  let presupuestosLista: Presupuesto[] = [];
  let categoriaLista: Categoria[] = [];
  let modalOpen = false; // Controla si el modal está abierto o cerrado
  let modalMode = "Crear"; // Puede ser "Crear" o "Editar"
  let nombreCategoria = ""; // Valor del campo de texto
  let costo = 0; // Valor del campo costo
  let descripcion = ""; // Valor del campo descripcion
  let categoriaId = 0; // ID de la categoría seleccionada
  let editeID: number | null = null;
  let filters: Filter[] = [
    { name: "nombre", type: "input", options: null },
    { name: "costo", type: "input", options: null },
    { name: "descripcion", type: "input", options: null },
    { name: "categoria_id", type: "select", options: null },
  ];

  const reloadData = async () => {
    try {
      if (userData?.token) {
        presupuestosLista = await getpresupuestos(userData.token);
        categoriaLista = await getCategorias(userData.token);
        filters[3].options = categoriaLista.map((categoria) => categoria.nombre); // Solo nombres
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  onMount(() => {
    userData = authValidation();
    if (!userData) {
      console.log("Redirigiendo al usuario no autenticado...");
      window.location.href = "/";
    } else {
      reloadData();
    }
  });

  const onEdit = (presupuesto_id: number) => {
    modalMode = "Editar";
    const presupuesto = presupuestosLista.find(
      (pres) => pres.presupuesto_id === presupuesto_id
    );
    if (presupuesto) {
      nombreCategoria = presupuesto.nombre;
      costo = presupuesto.costo;
      descripcion = presupuesto.descripcion as string;
      categoriaId = presupuesto.categoria_id;
      editeID = presupuesto_id;
    }
    modalOpen = true; // Abre el modal
  };

  const onDelete = async (presupuesto_id: number) => {
    if (userData?.token) {
      await deltePresupuestos(userData.token, presupuesto_id);
      reloadData();
    }
  };

  const openCreateModal = () => {
    modalMode = "Crear";
    nombreCategoria = "";
    costo = 0;
    descripcion = "";
    categoriaId = 0;
    modalOpen = true; // Abre el modal
  };

  const modalAction = async () => {
    if (modalMode === "Crear") {
      if (userData?.token) {
        await createpresupuesto(
          userData?.token,
          nombreCategoria,
          costo,
          descripcion,
          categoriaId
        );
        reloadData();
      }
    } else if (modalMode === "Editar") {
      if (userData?.token && editeID) {
        await Editepresupuestos(
          userData?.token,
          nombreCategoria,
          editeID,
          Number(costo),
          descripcion,
          categoriaId
        );
        reloadData();
      }
    }
    modalOpen = false; // Cierra el modal
  };

  const searchCate = async (filterData: any) => {
    if (filterData.length === 0) {
      reloadData();
      return;
    }
    if (filterData[0].name === "nombre" && userData?.token) {
      throw Error("Filtro no soportado");
    }
  };
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
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 400px;
  }
</style>

<main>
  <SideMenu>
    <div class="content">
      <FilterBar
        {filters}
        alignment="right"
        itemName="Categoria"
        crarITem={openCreateModal}
        searchEve={searchCate}
      />
      <br />
      <div class="p-6 bg-gray-50 min-h-screen">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each presupuestosLista as presupuesto (presupuesto.presupuesto_id)}
          <Card
            on:edit={() => onEdit(presupuesto.presupuesto_id)}
            on:delete={() => onDelete(presupuesto.presupuesto_id)}
            cardClasses="w-full"
          >
            <h3 class="text-2xl font-bold">{presupuesto.nombre}</h3>
            <p class="text-lg">
              <span class="font-bold">Costo:</span> {presupuesto.costo}
            </p>
            {#if presupuesto.descripcion}
              <p class="text-lg">
                <span class="font-bold">Descripción:</span> {presupuesto.descripcion}
              </p>
            {/if}
            <p class="text-lg">
              <span class="font-bold">Categoría:</span> 
              {presupuesto.categoria?.nombre || "General"}
            </p>
          </Card>
        {/each}
        
        </div>
      </div>
    </div>
  </SideMenu>

  {#if modalOpen}
    <div class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">{modalMode} Presupuesto</h2>
        <input
          type="text"
          class="w-full p-2 border rounded mb-4"
          placeholder="Nombre del presupuesto"
          bind:value={nombreCategoria}
        />
        <input
          type="number"
          class="w-full p-2 border rounded mb-4"
          placeholder="Costo"
          bind:value={costo}
        />
        <input
          type="text"
          class="w-full p-2 border rounded mb-4"
          placeholder="Descripción"
          bind:value={descripcion}
        />
        <select class="w-full p-2 border rounded mb-4" bind:value={categoriaId}>
          <option value={0} disabled>Seleccionar categoría</option>
          {#each categoriaLista as categoria}
            <option value={categoria.id}>{categoria.nombre}</option>
          {/each}
        </select>
        <button
          class="px-4 py-2 text-white rounded"
          class:bg-green-500={modalMode === "Crear"}
          class:bg-yellow-500={modalMode === "Editar"}
          class:hover:bg-green-600={modalMode === "Crear"}
          class:hover:bg-yellow-600={modalMode === "Editar"}
          on:click={modalAction}
        >
          {modalMode}
        </button>
        <button
          class="px-4 py-2 bg-gray-500 text-white rounded ml-4 hover:bg-gray-600"
          on:click={() => (modalOpen = false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  {/if}
</main>
