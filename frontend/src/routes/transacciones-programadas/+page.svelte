<script lang="ts">
  import authValidation from "$lib/helpers/authValidation";
  import SideMenu from "$lib/components/SideMenu.svelte";
  import { onMount } from "svelte";
  import type { UserData, TransaccionProgramada, Filter, Categoria, option } from "$lib/apitypes";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import Card from "$lib/components/Card.svelte";
  import { getCategorias } from "$lib/fetchs/CAtegoriaFetch";
  import {
    getTransaccionesProgramadas,
    deleteTransaccionProgramada,
    createTransaccionProgramada,
    editTransaccionProgramada,
  } from "$lib/fetchs/tpFetch";

  let userData: UserData | null = null;
  let transaccionesProgramadasLista: TransaccionProgramada[] = [];
  let categoriaLista: Categoria[] = [];
  let modalOpen = false;
  let modalMode = "Crear"; 
  let descripcion = ""; 
  let monto = 0; 
  let categoriaId = 0; 
  let tipo = "ingreso"; 
  let titulo = ""; 
  let fecha = new Date(); 
  let periodo = "diario"; 
  let cantidadRepeticiones = 0; 
  let recurrente = false;  // Nuevo campo recurrente
  let editeID: number | null = null;

  const tipoOptions = ["ingreso", "egreso"];
  const periodoOptions = ["diario", "semanal", "mensual", "anual", "15enal"];

  let categoriasFiltradas: option[] = [];
  let loading = true; // Indicador de carga
  let filters: Filter[] = [
    { name: "titulo", type: "input", options: null },
    { name: "descripcion", type: "input", options: null },
    { name: "monto", type: "input", options: null },
    { name: "tipo", type: "select", options: [{nombre: "ingresos", value: "ingreso"}, {nombre: "Egresos", value: "egreso"}] },
    { name: "categoria_id", type: "select", options: null }, // Filtro de categoría
  ];

  const reloadData = async () => {
    try {
      if (userData?.token) {
        transaccionesProgramadasLista = await getTransaccionesProgramadas(userData.token);
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

  const onEdit = (transaccionProgramada_id: number) => {
    modalMode = "Editar";
    const transaccionProgramada = transaccionesProgramadasLista.find(
      (tran) => tran.transacciones_programadas_id === transaccionProgramada_id
    );
    if (transaccionProgramada) {
      titulo = transaccionProgramada.titulo;
      descripcion = transaccionProgramada.descripcion || "";
      monto = transaccionProgramada.monto;
      categoriaId = transaccionProgramada.categoria_id || 0;
      tipo = transaccionProgramada.tipo;
      fecha = new Date(transaccionProgramada.fecha);
      console.log(transaccionProgramada.fecha,fecha)
      periodo = transaccionProgramada.periodo;
      cantidadRepeticiones = transaccionProgramada.cantidad_repeticiones || 0;
      recurrente = transaccionProgramada.recurrente;  // Asignar el valor de recurrente
      editeID = transaccionProgramada_id;
    }
    modalOpen = true;
  };

  const onDelete = async (transaccionProgramada_id: number) => {
    if (userData?.token) {
      await deleteTransaccionProgramada(userData.token, transaccionProgramada_id);
      reloadData();
    }
  };

  const openCreateModal = () => {
    modalMode = "Crear";
    titulo = "";
    descripcion = "";
    monto = 0;
    categoriaId = 0;
    tipo = "ingreso";
    fecha = new Date();
    periodo = "diario";
    cantidadRepeticiones = 0;
    recurrente = false;  // Asegurarse de que esté en falso por defecto
    modalOpen = true;
  };

  const modalAction = async () => {
    const validTipo = tipo.toLowerCase(); 
    const validDescripcion = String(descripcion).trim(); 
    const validMonto = Number(monto); 
    const validTitulo = String(titulo).trim(); 
    const validFecha = new Date(fecha); 
    let validPeriodo = periodo.toLowerCase(); 
    let validCantidadRepeticiones = Number(cantidadRepeticiones); 
    if (!["ingreso", "egreso"].includes(validTipo)) {
      alert("Error:EL Tipo debe ser 'ingreso' o 'egreso'");
      return;
    }
    if (isNaN(validMonto) || validMonto <= 0) {
      alert("Error: Monto debe ser un número positivo");
      return;
    }
    if (validDescripcion.length === 0) {
      validDescripcion 
      return;
    }
    if (validTitulo.length === 0) {
      alert("Error: Título no puede estar vacío");
      return;
    }
    if (isNaN(validCantidadRepeticiones) || validCantidadRepeticiones < 0 && recurrente) {
      alert("Error: Cantidad de repeticiones debe ser un número positivo o nulo");
      return;
    }

    if(!recurrente){
      validPeriodo = null
      validCantidadRepeticiones = null
    }

    console.log(validPeriodo)
    try {
      if (modalMode === "Crear") {
        if (userData?.token) {
          console.log("cantidadRepeticiones",cantidadRepeticiones)
          await createTransaccionProgramada(
            userData.token,
            validTipo,
            validTitulo,
            validDescripcion,
            validMonto,
            categoriaId,
            recurrente,
            fecha,
            validPeriodo,
            validCantidadRepeticiones
          );
          reloadData();
        }
      } else if (modalMode === "Editar") {
        if (userData?.token && editeID) {
          await editTransaccionProgramada(
            userData.token,
            editeID,
            tipo,
            titulo,
            descripcion,
            Number(monto),
            categoriaId,
            recurrente,
            fecha,
            periodo,
            cantidadRepeticiones
          );
          reloadData();
        }
      }
      modalOpen = false; 
    } catch (error) {
      console.error("Error al guardar la transacción programada:", error);
    }
  };

  const searchTransacciones = async (filterData: any) => {
    if (filterData.length === 0) {
      reloadData();
      return;
    }
    console.log("Filtros aplicados:", filterData);
  };

  // Función para buscar el nombre de la categoría por su ID
  const searchCate = (id: any) => {
    const categoria = categoriasFiltradas.find((categoria) => categoria.value === id);
    if (!categoria) {
      return "General"; // Mensaje si no se encuentra la categoría
    }
    return categoria.nombre;
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
        itemName="Transacción Programada"
        createItem={openCreateModal}
        searchEve={searchTransacciones}
      />
      <br />
      <div class="p-6 bg-gray-50 min-h-screen">
        {#if loading}
          <p>Cargando...</p> <!-- Mensaje de carga -->
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each transaccionesProgramadasLista as transaccion (transaccion.transacciones_programadas_id)}
              <Card
                on:edit={() => onEdit(transaccion.transacciones_programadas_id)}
                on:delete={() => onDelete(transaccion.transacciones_programadas_id)}
                cardClasses="w-full"
              >
                <h3 class="text-2xl font-bold">{transaccion.titulo}</h3>
                <p class="text-lg">
                  <span class="font-bold">Descripción:</span> {transaccion.descripcion}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Monto:</span> 
                  <span class={`font-bold ${transaccion.tipo === 'egreso' ? 'text-red-500' : 'text-green-500'}`}>
                    {transaccion.tipo === 'egreso' ? '-' : '+'}{transaccion.monto}
                  </span>
                </p>
                <p class="text-lg">
                  <span class="font-bold">Tipo:</span> {transaccion.tipo}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Categoría:</span> {searchCate(transaccion.categoria_id)}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Fecha:</span> {new Date(transaccion.fecha).toLocaleString()}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Recurrente:</span> 
                  <span class={`font-bold ${transaccion.recurrente ? 'text-green-500' : 'text-red-500'}`}>
                    {transaccion.recurrente ? 'Sí' : 'No'}
                  </span>
                </p>

                {#if transaccion.recurrente}
                  <p class="text-lg">
                    <span class="font-bold">Cantidad de repeticiones:</span> {transaccion.cantidad_repeticiones}
                  </p>
                  <p class="text-lg">
                    <span class="font-bold">Repeticiones:</span> {transaccion.repeticiones}
                  </p>
                  <p class="text-lg">
                    <span class="font-bold">Periodo:</span> {transaccion.periodo}
                  </p>
                {/if}
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
        <h2 class="text-xl font-bold mb-4">{modalMode} Transacción Programada</h2>
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
        <input
          type="date"
          class="w-full p-2 border rounded mb-4"
          bind:value={fecha}
        />
        <div class="mb-4">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              class="mr-2"
              bind:checked={recurrente}
            />
            <span>Recurrente</span>
          </label>
        </div>
        {#if recurrente}
          <input
            type="number"
            class="w-full p-2 border rounded mb-4"
            placeholder="Cantidad de Repeticiones"
            bind:value={cantidadRepeticiones}
          />

          <select
          class="w-full p-2 border rounded mb-4"
          bind:value={periodo}
        >
          {#each periodoOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
        {/if}
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
