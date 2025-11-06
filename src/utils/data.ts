import { Catalogue } from "@models/catalogue";

const DEFAULT_CATALOGUE_PATH = "/assets/sample/service_catalog_en.json";

export async function loadCatalogue(url?: string): Promise<Catalogue> {
  try {
    const targetUrl = url || DEFAULT_CATALOGUE_PATH;
    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to load catalogue: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.trades)) {
      throw new Error("Invalid catalogue format: missing trades array");
    }

    return data as Catalogue;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error loading catalogue: ${error.message}`);
    }
    throw new Error("Unknown error loading catalogue");
  }
}

