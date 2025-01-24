<script lang="ts">
    import { onMount } from "svelte";
    import authValidation from "$lib/helpers/authValidation";
    import SideMenu from "$lib/components/SideMenu.svelte";
    import type { UserData } from "$lib/apitypes";
    let userData: UserData | null = null;
    let fechaInicio: string = "";
    let fechaFin: string = "";
    const baseUrl = process.env.VITE_API_URL;
    // Validar la autenticación del usuario al montar el componente
    onMount(() => {
      userData = authValidation();
      if (!userData) {
        console.log("Redirigiendo al usuario no autenticado...");
        window.location.href = "/";
      }
    });
  
    // Función para exportar el PDF
    async function exportarPDF() {
      try {
        const token = userData?.token || "";
  
        const response = await fetch(
          `${baseUrl}/export-pdf?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
  
          // Descargar el PDF
          const link = document.createElement("a");
          link.href = url;
          link.download = `Reporte_${fechaInicio}_a_${fechaFin}.pdf`;
          link.click();
  
          // Liberar el objeto URL después de descargar
          URL.revokeObjectURL(url);
        } else {
          const errorData = await response.json();
          console.error("Error al exportar PDF:", errorData.message);
          alert("Error al exportar PDF: " + errorData.message);
        }
      } catch (error) {
        console.error("Error en exportarPDF:", error);
        alert("Ocurrió un error al intentar exportar el PDF.");
      }
    }
  </script>
  
  <SideMenu>
    <!-- Estilo con TailwindCSS -->
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 shadow-md rounded-lg max-w-lg w-full">
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-4">
          Exportar Reporte en PDF
        </h1>
  
        <!-- Formulario -->
        <form
          class="flex flex-col gap-4"
          on:submit|preventDefault={exportarPDF}
        >
          <div>
            <label for="fechaInicio" class="block text-gray-700 font-medium mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="fechaInicio"
              bind:value={fechaInicio}
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
  
          <div>
            <label for="fechaFin" class="block text-gray-700 font-medium mb-1">
              Fecha Final
            </label>
            <input
              type="date"
              id="fechaFin"
              bind:value={fechaFin}
              class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
  
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generar PDF
          </button>
        </form>
      </div>
    </div>
  </SideMenu>
  