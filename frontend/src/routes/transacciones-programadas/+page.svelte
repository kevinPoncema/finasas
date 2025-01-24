<script lang="ts">
    import authValidation from "$lib/helpers/authValidation";
    import SideMenu from "$lib/components/SideMenu.svelte";
    import { onMount } from "svelte";
    import type { UserData, TransaccionProgramada, Filter, Categoria } from "$lib/apitypes";
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
    let modalOpen = false; // Controla si el modal está abierto o cerrado
    let modalMode = "Crear"; // Puede ser "Crear" o "Editar"
    let descripcion = ""; // Valor del campo descripción
    let monto = 0; // Valor del campo monto
    let categoriaId = 0; // ID de la categoría seleccionada
    let tipo = "ingreso"; // Tipo de transacción: "ingreso" o "egreso"
    let titulo = ""; // Valor del campo título
    let fecha = new Date().toISOString(); // Valor del campo fecha
    let periodo = "diario"; // Valor del campo periodo
    let cantidadRepeticiones = 0; // Valor del campo cantidadRepeticiones
    let editeID: number | null = null;
  
    // Opciones de tipo y periodo
    const tipoOptions = ["ingreso", "egreso"];
    const periodoOptions = ["diario", "semanal", "mensual", "anual", "15enal"];
  
    let filters: Filter[] = [
      { name: "descripcion", type: "input", options: null },
      { name: "monto", type: "input", options: null },
      { name: "tipo", type: "select", options: tipoOptions }, // Filtro de tipo
      { name: "categoria_id", type: "select", options: null }, // Filtro de categoría
    ];
  
    const reloadData = async () => {
      try {
        if (userData?.token) {
          transaccionesProgramadasLista = await getTransaccionesProgramadas(userData.token);
          categoriaLista = await getCategorias(userData.token);
          filters[3].options = categoriaLista.map((categoria) => categoria.nombre); // Solo nombres
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
        fecha = transaccionProgramada.fecha.toISOString();
        periodo = transaccionProgramada.periodo;
        cantidadRepeticiones = transaccionProgramada.cantidad_repeticiones || 0;
        editeID = transaccionProgramada_id;
      }
      modalOpen = true; // Abre el modal
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
      fecha = new Date().toISOString();
      periodo = "diario";
      cantidadRepeticiones = 0;
      modalOpen = true; // Abre el modal
    };
  
    const modalAction = async () => {
      // Validar y corregir los tipos antes de enviar a la API
      const validTipo = tipo.toLowerCase(); // Convertir a minúsculas: "ingreso" o "egreso"
      const validDescripcion = String(descripcion).trim(); // Convertir a string y eliminar espacios extras
      const validMonto = Number(monto); // Convertir a número
      const validTitulo = String(titulo).trim(); // Convertir a string y eliminar espacios extras
      const validFecha = new Date(fecha); // Convertir a fecha
      const validPeriodo = periodo.toLowerCase(); // Convertir a minúsculas
      const validCantidadRepeticiones = Number(cantidadRepeticiones); // Convertir a número
  
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
      if (isNaN(validCantidadRepeticiones) || validCantidadRepeticiones < 0) {
        console.error("Error: Cantidad de repeticiones debe ser un número positivo o nulo");
        return;
      }
  
      try {
        if (modalMode === "Crear") {
          if (userData?.token) {
            await createTransaccionProgramada(
              userData.token,
              validTitulo, // Pasar el título
              validDescripcion,
              validMonto,
              validTipo,
              categoriaId,
              validFecha,
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
              validTitulo, // Pasar el título
              validDescripcion,
              validMonto,
              validTipo,
              categoriaId,
              validFecha,
              validPeriodo,
              validCantidadRepeticiones
            );
            reloadData();
          }
        }
        modalOpen = false; // Cierra el modal
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
          crarITem={openCreateModal}
          searchEve={searchTransacciones}
        />
        <br />
        <div class="p-6 bg-gray-50 min-h-screen">
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
                  <span class="font-bold">Monto:</span> {transaccion.monto}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Tipo:</span> {transaccion.tipo}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Categoría:</span> 
                  {transaccion.categoria?.nombre || "General"}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Fecha:</span> {new Date(transaccion.fecha).toLocaleString()}
                </p>
                <p class="text-lg">
                  <span class="font-bold">Periodo:</span> {transaccion.periodo}
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
            type="datetime-local"
            class="w-full p-2 border rounded mb-4"
            bind:value={fecha}
          />
          <select
            class="w-full p-2 border rounded mb-4"
            bind:value={periodo}
          >
            {#each periodoOptions as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
          <input
            type="number"
            class="w-full p-2 border rounded mb-4"
            placeholder="Cantidad de Repeticiones"
            bind:value={cantidadRepeticiones}
          />
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
  