<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, Title, CategoryScale, LinearScale, BarElement, BarController } from 'chart.js';
  import type { TotalesResponse } from "$lib/apitypes";

  // Registrar los componentes necesarios de Chart.js
  Chart.register(Title, CategoryScale, LinearScale, BarElement, BarController); // Asegúrate de registrar BarController

  // Propiedades que se reciben como parámetro
  export let totalesResponse: TotalesResponse;

  let chartData = {
    labels: ['Egreso Mensual', 'Ingreso Mensual', 'Total Presupuesto Previsto'],
    datasets: [
      {
        label: 'Comparación de Ingresos, Egresos y Presupuesto',
        data: [
          totalesResponse.egreso_mensual,
          totalesResponse.ingreso_mensual,
          totalesResponse.total_presupuesto_previsto
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1
      }
    ]
  };

  let chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Comparación de Ingresos, Egresos y Presupuesto'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  let chart;

  // Crear el gráfico cuando el componente se monta
  onMount(() => {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    chart = new Chart(ctx, {
      type: 'bar', // Tipo de gráfico 'bar'
      data: chartData,
      options: chartOptions
    });
  });
</script>

<canvas id="myChart"></canvas>
