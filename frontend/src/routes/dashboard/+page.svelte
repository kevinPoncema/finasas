<script lang="ts">
  import authValidation from "$lib/helpers/authValidation";
  import { getBalance, getCategorySummary } from "$lib/fetchs/estadisticasFetch";
  import SideMenu from "$lib/components/SideMenu.svelte";
  import CategorySummaryChart from "$lib/components/CategorySummaryChart.svelte";
  import LinearChart from "$lib/components/LinearChart.svelte"
  import BarGraph from "$lib/components/BarGraph.svelte"
  import { onMount } from "svelte";
  import type { UserData, TotalesResponse, CategorySummary } from "$lib/apitypes";

  let userData: UserData | null = null;
  let balance: TotalesResponse | null = null;
  let categorySummary: CategorySummary[] | null = null;
  let loading = true;

  // Función para recargar datos
  const reload = async () => {
    if (!userData?.token) return;

    try {
      balance = await getBalance(userData.token);
      categorySummary = await getCategorySummary(userData.token);
    } catch (error) {
      console.error("Error al cargar datos:", error.message || error);
    } finally {
      loading = false; // Asegura que se desactive incluso en caso de error
    }
  };

  onMount(() => {
    userData = authValidation();
    if (!userData) {
      console.warn("Usuario no autenticado. Redirigiendo a inicio de sesión.");
      window.location.href = "/";
      return;
    }
    console.log("Datos del usuario:", userData);
    reload();
  });
</script>


<main class="flex flex-col min-h-screen bg-gray-50">
  <SideMenu>
    <div class="content p-4 flex-grow">
      {#if loading}
        <div class="loading flex items-center justify-center text-gray-600 text-lg">
          Cargando...
        </div>
      {:else}
        <!-- Card de Resumen de Totales -->
        <div class="flex justify-center">
          <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
            <!-- Encabezado -->
            <h2 class="text-xl font-bold text-gray-800 text-center">
              Resumen de Totales
            </h2>

            <!-- Contenido debajo del encabezado en pantallas pequeñas -->
            <div class="mt-4 flex flex-col gap-4 sm:gap-6 sm:flex-row sm:justify-between sm:items-center">
              <div class="flex justify-between text-sm sm:text-base">
                <span class="text-gray-600">Total General:</span>
                <span class="font-semibold text-gray-900">
                  {balance?.total_general ?? 0}
                </span>
              </div>
              <div class="flex justify-between text-sm sm:text-base">
                <span class="text-gray-600">Ingresos Mensuales:</span>
                <span class="font-semibold text-green-600">
                  {balance?.ingreso_mensual ?? "N/A"}
                </span>
              </div>
              <div class="flex justify-between text-sm sm:text-base">
                <span class="text-gray-600">Egresos Mensuales:</span>
                <span class="font-semibold text-red-600">
                  {balance?.egreso_mensual ?? "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenedor de las gráficas -->
        <div class="charts-container mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Gráfica de barras -->
          <div class="chart-item bg-white shadow-lg rounded-2xl p-4 h-[30rem] flex items-center justify-center">
            <BarGraph totalesResponse={balance} />
          </div>

          <!-- Gráfica de círculo -->
          <div class="chart-item bg-white shadow-lg rounded-2xl p-4 h-[28rem] flex items-center justify-center">
            <CategorySummaryChart {categorySummary} />
          </div>
        </div>

        <!-- Gráfica de línea debajo -->
        <div class="mt-8 bg-white shadow-lg rounded-2xl p-4 h-[25rem] flex items-center justify-center">
          <LinearChart token={userData?.token} />
        </div>
      {/if}
    </div>
  </SideMenu>
</main>

<style>
  canvas {
    max-width: 100%;
    height: auto;
  }
</style>
