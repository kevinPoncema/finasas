import type { TotalesResponse, CategorySummary } from "$lib/apitypes";

const baseUrl = process.env.VITE_API_URL;

async function fetchFromApi<T>(url: string, token: string): Promise<T> {
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data: T = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      console.error(`Error en ${url}:`, errorData.message);
      throw new Error(errorData.message || "Error desconocido");
    }
  } catch (error) {
    console.error(`Error al realizar fetch a ${url}:`, error);
    throw error;
  }
}

export async function getTotales(token: string): Promise<TotalesResponse | null> {
  return fetchFromApi<TotalesResponse>("/totales", token);
}

export async function getBalance(token: string): Promise<TotalesResponse | null> {
  return fetchFromApi<TotalesResponse>("/balance-general", token);
}

export async function getCategorySummary(token: string): Promise<CategorySummary[] | null> {
  return fetchFromApi<CategorySummary[]>("/getCategorySummary", token);
}

export async function getGraficaPeriodo(token: string,periodo:string): Promise<CategorySummary[] | null> {
  return fetchFromApi<CategorySummary[]>(`/getGraficaPeriodo/?periodo=${periodo}`, token);
}
