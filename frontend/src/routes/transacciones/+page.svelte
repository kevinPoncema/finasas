<script lang="ts">
  import authValidation from "$lib/helpers/authValidation";
  import SideMenu from "$lib/components/SideMenu.svelte";
  import { onMount } from "svelte";
  import type { UserData, Transaccion, Filter, Categoria, option } from "$lib/apitypes";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import { getCategorias } from "$lib/fetchs/CAtegoriaFetch";
  import {
    getTransacciones,
    deleteTransaccion,
    createTransaccion,
    editTransaccion,
    filtrarTransacciones
  } from "$lib/fetchs/transacionesFetch";
  
  let userData: UserData | null = null;
  let transaccionesLista: Transaccion[] = [];
  let categoriaLista: Categoria[] = [];
  let modalOpen = false; // Controla si el modal está abierto o cerrado
  let modalMode = "Crear"; // Puede ser "Crear" o "Editar"
  let descripcion = ""; // Valor del campo descripción
  let monto = 0; // Valor del campo monto
  let categoriaId = 0; // ID de la categoría seleccionada
  let tipo = "Ingreso"; // Tipo de transacción: "Ingreso" o "Egreso"
  let titulo = ""; // Valor del campo título
  let editeID: number | null = null;
  let categoriasFiltradas: option[] = [];
  let loading = true; // Indicador de carga
  // Opciones de tipo
  const tipoOptions = ["Ingreso", "Egreso"];
  let filters: Filter[] = [
    { name: "titulo", type: "input", options: null },
    { name: "descripcion", type: "input", options: null },
    { name: "monto", type: "input", options: null },
    { name: "tipo", type: "select", options:[{nombre:"ingresos",value:"ingreso"},{nombre:"Egresos",value:"egreso"}] },
    { name: "categoria_id", type: "select", options: null }, // Filtro de categoría
  ];

  const reloadData = async () => {
    try {
      if (userData?.token) {
        transaccionesLista = await getTransacciones(userData.token);
        categoriaLista = await getCategorias(userData.token);
        categoriasFiltradas = categoriaLista.map((categoria) => ({
          nombre: categoria.nombre,
          value: categoria.id,
        }));
        filters[4].options = categoriasFiltradas;
        loading = false; // Cambiar el estado a "cargado"
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      loading = false; // Si ocurre un error, cambiamos el estado a "cargado"
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

  const onEdit = (transaccion_id: number) => {
    modalMode = "Editar";
    const transaccion = transaccionesLista.find(
      (tran) => tran.transaccion_id === transaccion_id
    );
    if (transaccion) {
      titulo = transaccion.titulo;
      descripcion = transaccion.descripcion;
      monto = transaccion.monto;
      categoriaId = transaccion.categoria_id;
      tipo = transaccion.tipo;
      editeID = transaccion_id;
    }
    modalOpen = true; // Abre el modal
  };

  const onDelete = async (transaccion_id: number) => {
    if (userData?.token) {
      await deleteTransaccion(userData.token, transaccion_id);
      reloadData();
    }
  };

  const openCreateModal = () => {
    modalMode = "Crear";
    titulo = "";
    descripcion = "";
    monto = 0;
    categoriaId = 0;
    tipo = "Ingreso";
    modalOpen = true; // Abre el modal
  };

  const modalAction = async () => {
    // Validar y corregir los tipos antes de enviar a la API
    const validTipo = tipo.toLowerCase(); // Convertir a minúsculas: "ingreso" o "egreso"
    const validDescripcion = String(descripcion).trim(); // Convertir a string y eliminar espacios extras
    const validMonto = Number(monto); // Convertir a número
    const validTitulo = String(titulo).trim(); // Convertir a string y eliminar espacios extras
  
    // Verificar que los valores sean válidos
    if (!["ingreso", "egreso"].includes(validTipo)) {
      console.error("Error: Tipo debe ser 'ingreso' o 'egreso'");
      return;
    }
    if (isNaN(validMonto) || validMonto <= 0) {
      console.error("Error: Monto debe ser un número positivo");
      return;
    }
    if (validDescripcion.length === 0) {
      console.error("Error: Descripción no puede estar vacía");
      return;
    }
    if (validTitulo.length === 0) {
      console.error("Error: Título no puede estar vacío");
      return;
    }
  
    try {
      if (modalMode === "Crear") {
        if (userData?.token) {
          await createTransaccion(
            userData.token,
            validTitulo, // Pasar el título
            validDescripcion,
            validMonto,
            validTipo,
            categoriaId
          );
          reloadData();
        }
      } else if (modalMode === "Editar") {
        if (userData?.token && editeID) {
          await editTransaccion(
            userData.token,
            editeID,
            validTitulo, // Pasar el título
            validDescripcion,
            validMonto,
            validTipo,
            categoriaId
          );
          reloadData();
        }
      }
      modalOpen = false; // Cierra el modal
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
    }
  };

  // Función para buscar el nombre de la categoría por su ID
  const searchCate = (id: any) => {
    const categoria = categoriasFiltradas.find((categoria) => categoria.value === id);
    if (!categoria) {
      return "General"; // Mensaje si no se encuentra la categoría
    }
    return categoria.nombre;
  };

  const search= async (filterData: any[]) => {
  // Transformar el arreglo en un objeto con las propiedades y valores esperados
  const transformedFilters = filterData.reduce((acc: any, curr: any) => {
    acc[curr.name] = curr.value;
    return acc;
  }, {});

  // Validar si no hay filtros
  if (Object.keys(transformedFilters).length === 0) {
    reloadData();
    return;
  }
if (userData?.token) {
  transaccionesLista= await filtrarTransacciones(userData.token,transformedFilters);
  return
}
}
</script>

<main>
  <SideMenu>
    <div class="content">
      <FilterBar
        {filters}
        alignment="right"
        itemName="Transacción"
        createItem={openCreateModal}
        searchEve={search}
      />
      <br />
      <div class="p-6 bg-gray-50 min-h-screen">
        {#if loading}
          <p>Cargando...</p> <!-- Mensaje de carga -->
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each transaccionesLista as transaccion (transaccion.transaccion_id)}
              <Card
                on:edit={() => onEdit(transaccion.transaccion_id)}
                on:delete={() => onDelete(transaccion.transaccion_id)}
                cardClasses="w-full"
              >
                <h3 class="text-2xl font-bold">{transaccion.titulo}</h3>
                <p class="text-lg">
                  <span class="font-bold">Descripción:</span> {transaccion.descripcion}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Monto:</span> 
                  <span 
                    class={`font-bold 
                      ${transaccion.tipo === 'egreso' ? 'text-red-500' : 'text-green-500'}` 
                  }>
                    {transaccion.tipo === 'egreso' ? '-' : '+'}{transaccion.monto}
                  </span>
                </p>
                <p class="text-lg">
                  <span class="font-bold">Tipo:</span> {transaccion.tipo}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Categoría:</span> 
                  {searchCate(transaccion.categoria_id)}
                </p>
              </Card>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </SideMenu>

  {#if modalOpen}
    <div class="modal">
      <div class="modal-content">
        <h2 class="text-xl font-bold mb-4">{modalMode} Transacción</h2>
        <input
          type="text"
          class="w-full p-2 border rounded mb-4"
          placeholder="Título"
          bind:value={titulo}
        />
        <input
          type="text"
          class="w-full p-2 border rounded mb-4"
          placeholder="Descripción"
          bind:value={descripcion}
        />
        <input
          type="number"
          class="w-full p-2 border rounded mb-4"
          placeholder="Monto"
          bind:value={monto}
        />
        <select
          class="w-full p-2 border rounded mb-4"
          bind:value={tipo}
        >
          {#each tipoOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
        <select
          class="w-full p-2 border rounded mb-4"
          bind:value={categoriaId}
        >
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
          {modalMode} Transacción
        </button>
        <button
          class="px-4 py-2 bg-gray-300 text-black rounded mt-4"
          on:click={() => modalOpen = false}
        >
          Cancelar
        </button>
      </div>
    </div>
  {/if}
</main>

<style>
  .content {
    padding: 20px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
  }
</style>
