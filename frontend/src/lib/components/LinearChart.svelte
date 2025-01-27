<script>
  import { onMount } from "svelte";
  import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
  import { getGraficaPeriodo } from "$lib/fetchs/estadisticasFetch";

  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

  export let token;

  let periodo = "dia"; // Período inicial
  let datosGrafica = [];
  let grafica;

  const obtenerDatos = async () => {
    try {
      const datos = await getGraficaPeriodo(token, periodo);
      datosGrafica = datos;
      actualizarGrafica();
    } catch (error) {
      console.error("Error al obtener datos de la gráfica:", error);
    }
  };

  const actualizarGrafica = () => {
    if (grafica) grafica.destroy();

    const ctx = document.getElementById("line-chart").getContext("2d");
    grafica = new Chart(ctx, {
      type: "line",
      data: {
        labels: datosGrafica.map((dato) => dato.fecha),
        datasets: [
          {
            label: "Ingresos",
            data: datosGrafica.map((dato) => dato.totalMontoIngreso),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            tension: 0.3,
          },
          {
            label: "Egresos",
            data: datosGrafica.map((dato) => dato.totalMontoEgreso),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Esto permite que la gráfica se ajuste a su contenedor
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: `Gráfica de ${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Fecha",
            },
          },
          y: {
            title: {
              display: true,
              text: "Monto",
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  onMount(() => {
    obtenerDatos();
  });

  const cambiarPeriodo = async (nuevoPeriodo) => {
    if (nuevoPeriodo !== periodo) {
      periodo = nuevoPeriodo;
      await obtenerDatos();
    }
  };
</script>

<div class="w-full max-w-4xl mx-auto p-4">
  <!-- Botones de selección de período -->
  <div class="flex justify-center sm:justify-end mb-4 space-x-2">
    <button
      class="px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      on:click={() => cambiarPeriodo("dia")}
    >
      Día
    </button>
    <button
      class="px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      on:click={() => cambiarPeriodo("semana")}
    >
      Semana
    </button>
    <button
      class="px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      on:click={() => cambiarPeriodo("mes")}
    >
      Mes
    </button>
  </div>

  <!-- Contenedor para el canvas -->
  <div class="relative w-full h-80 sm:h-[30rem]">
    <canvas id="line-chart"></canvas>
  </div>
</div>
