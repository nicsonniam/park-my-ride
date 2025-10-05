export interface OneMapResult {
  SEARCHVAL: string;
  ADDRESS: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapResponse {
  totalNumPages: number;
  results: OneMapResult[];
}

export async function searchOnemap(
  searchVal: string,
  pageNum: number = 1
): Promise<OneMapResponse> {
  const endpoint = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
    searchVal
  )}&returnGeom=Y&getAddrDetails=Y&pageNum=${pageNum}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`OneMap API error: ${res.status}`);
    }

    const data: OneMapResponse = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching OneMap data:", err);
    throw err;
  }
}
