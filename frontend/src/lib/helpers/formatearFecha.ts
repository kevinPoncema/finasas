export  function formatearFechaDMA(fechaISO:string) { //dia mesaño = DMA
    const [año, mes, día] = fechaISO.split('-');
    return `${día}/${mes}/${año}`;
  }

export  const formatFechaISO = (fecha: Date) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes inicia en 0
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

export function formatDate(dateString:string) {
    // Crear un objeto Date a partir de la cadena de fecha
    const date = new Date(dateString);
  
    // Obtener el día, mes y año
    const day = String(date.getDate()).padStart(2, '0');  // Añadir ceros al inicio si el día es menor que 10
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Los meses empiezan desde 0
    const year = date.getFullYear();
  
    // Devolver la fecha en formato día/mes/año
    return `${day}/${month}/${year}`;
  }
  
  export function handleDateRange(startDate: string, endDate: string) {
    // Si no hay fecha de inicio (startDate), asignamos la fecha final a la fecha de inicio y sumamos 1 día a la fecha final
    if (!startDate && endDate) {
      startDate = endDate; // Asignamos la fecha final a la de inicio
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1); // Sumamos 1 día a la fecha final
      endDate = endDateObj.toISOString().split('T')[0]; // Convertimos la nueva fecha final a formato ISO (YYYY-MM-DD)
    }
  
    // Si no hay fecha final (endDate), asignamos la fecha de inicio + 1 día a la fecha final
    if (!endDate && startDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setDate(startDateObj.getDate() + 1); // Sumamos 1 día a la fecha de inicio
      endDate = startDateObj.toISOString().split('T')[0]; // Convertimos la nueva fecha final a formato ISO (YYYY-MM-DD)
    }
  
    return { startDate, endDate };
  }
  
  