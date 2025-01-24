<script lang="ts">
  import authValidation from "$lib/helpers/authValidation";
  import SideMenu from "$lib/components/SideMenu.svelte";
  import { onMount } from "svelte";
  import type { UserData, Categoria, Filter } from "$lib/apitypes";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import { getCategorias, delteCategorias,createCategoria,EditeCategoria,getCategoriasPorNombre } from "$lib/fetchs/CAtegoriaFetch";

  let userData: UserData | null = null;
  let categoriaLista: Categoria[] = [];
  let filters: Filter[] = [{ name: "nombre", type: "input", options: null }];
  let modalOpen = false; // Controla si el modal está abierto o cerrado
  let modalMode = "Crear"; // Puede ser "Crear" o "Editar"
  let nombreCategoria = ""; // Valor del campo de texto
  let editeID:number | null = null
  // Función para recargar las categorías
  const reloadData = async () => {
      try {
          if (userData?.token) {
              categoriaLista = await getCategorias(userData.token);
              if (categoriaLista) {
              }
          }
      } catch (error) {
          console.error("Error al obtener categorías:", error);
      }
  };

  onMount(() => {
      // Validar la autenticación del usuario
      userData = authValidation();
      if (!userData) {
          console.log("Redirigiendo al usuario no autenticado...");
          window.location.href = "/";
      } else {
          reloadData();
      }
  });

  const onEdit = (categoriaId: number) => {
      // Modo Editar
      modalMode = "Editar";
      const categoria = categoriaLista.find((cat) => cat.id === categoriaId);
      nombreCategoria = categoria ? categoria.nombre : "";
      editeID = categoriaId
      modalOpen = true; // Abre el modal
  };

  const onDelete = async (categoriaId: number) => {
      if (userData?.token) {
          await delteCategorias(userData.token, categoriaId);
          reloadData();
      }
  };

  const openCreateModal = () => {
      // Modo Crear
      modalMode = "Crear";
      nombreCategoria = "";
      modalOpen = true; // Abre el modal
  };

  const modalAction =async () => {
      if (modalMode === "Crear") {
        if (userData?.token) {
          await createCategoria(userData?.token,nombreCategoria)
          reloadData()
        }
      } else if (modalMode === "Editar") {
        if (userData?.token && editeID) {
          await EditeCategoria(userData?.token,nombreCategoria,editeID)
          reloadData()
        }
      }
      modalOpen = false; // Cierra el modal
  };

  const searchCate = async (filterData:any)=>{

    
   if( filterData.length===0){
    reloadData()
    return
   }
    if (filterData[0].name === "nombre" && userData?.token ) {
      categoriaLista = await getCategoriasPorNombre(userData.token,filterData[0].value)
    }
    throw Error("Filtro no soportado")
  }
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
  <!-- Componente SideMenu -->
  <SideMenu>
      <!-- Contenido principal -->
      <div class="content">
          <!-- Barra de filtros -->
          <FilterBar {filters} alignment="right" itemName="Categoria" crarITem = {openCreateModal} searchEve={searchCate}/>
          <br />
          
          <!-- Contenedor de tarjetas -->
          <div class="p-6 bg-gray-50 min-h-screen">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {#each categoriaLista as categoria (categoria.id)}
                      <Card 
                          on:edit={() => onEdit(categoria.id)}
                          on:delete={() => onDelete(categoria.id)}
                          cardClasses="w-full">
                          <h3 class="text-2xl font-bold">{categoria.nombre}</h3>
                      </Card>
                  {/each}
              </div>
          </div>
      </div>
  </SideMenu>

  <!-- Modal -->
  {#if modalOpen}
    <div class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">{modalMode} Categoría</h2>
        <input 
          type="text" 
          class="w-full p-2 border rounded mb-4" 
          placeholder="Nombre de la categoría"
          bind:value={nombreCategoria}
        />
        <button 
          class="px-4 py-2 text-white rounded"
          class:bg-green-500={modalMode === "Crear"}
          class:bg-yellow-500={modalMode === "Editar"}
          class:hover:bg-green-600={modalMode === "Crear"}
          class:hover:bg-yellow-600={modalMode === "Editar"}
          on:click={modalAction}>
          {modalMode}
        </button>
        <button 
          class="px-4 py-2 bg-gray-500 text-white rounded ml-4 hover:bg-gray-600"
          on:click={() => (modalOpen = false)}>
          Cancelar
        </button>
      </div>
    </div>
  {/if}
</main>
