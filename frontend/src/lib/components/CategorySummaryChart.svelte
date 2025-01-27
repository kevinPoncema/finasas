<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    Chart,
    PieController,
    ArcElement,
    Tooltip,
    Legend,
    Title,
  } from "chart.js";
  import ChartDataLabels from "chartjs-plugin-datalabels"; // Importa el plugin de etiquetas
  import type { CategorySummary } from "$lib/apitypes";

  export let categorySummary: CategorySummary[] = [];

  let chartCanvas: HTMLCanvasElement;
  let chartInstance: Chart | null = null;

  // Registrar los componentes necesarios de Chart.js
  Chart.register(PieController, ArcElement, Tooltip, Legend, Title, ChartDataLabels);

  // Configuración inicial del gráfico
  const chartType = "pie";
  let chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9C27B0", "#FF9800"],
        hoverBackgroundColor: ["#66BB6A", "#42A5F5", "#FFD54F", "#E57373", "#BA68C8", "#FFB74D"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const dataIndex = tooltipItem.dataIndex;
            const label = dataset.labels?.[dataIndex] ?? "General";
            const value = dataset.data?.[dataIndex] ?? 0;
            return `${label}: ${value}%`;
          },
        },
      },
      title: {
        display: true,
        text: "Categorías y su porcentaje en las transacciones",
      },
      datalabels: {
        color: "#fff", // Color de texto
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels?.[context.dataIndex] ?? "";
          return `${label}\n${value}%`; // Muestra el nombre y porcentaje
        },
        anchor: "center",
        align: "center",
      },
    },
  };

  // Función para inicializar o actualizar el gráfico
  function initializeChart() {
    chartData.labels = categorySummary.map((item) =>
      item.categoria?.nombre ?? "General"
    );
    chartData.datasets[0].data = categorySummary.map((item) => {
      const porcentaje = item.estadisticas?.porcentaje;
      if (typeof porcentaje === "string" && porcentaje.includes("%")) {
        return parseFloat(porcentaje.replace("%", ""));
      }
      return 0; // Valor predeterminado si no es válido
    });

    if (chartInstance) {
      chartInstance.destroy(); // Elimina el gráfico anterior si existe
    }

    chartInstance = new Chart(chartCanvas, {
      type: chartType,
      data: chartData,
      options: chartOptions,
    });
  }

  // Inicialización y limpieza del gráfico
  onMount(() => {
    initializeChart();
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
</script>

<canvas bind:this={chartCanvas} class="w-full h-full"></canvas>

<style>
  canvas {
    max-width: 400px;
    max-height: 400px;
    margin: auto;
  }
</style>
