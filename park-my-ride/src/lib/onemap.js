export async function searchOnemap(searchVal, pageNum = 1) {
  const endpoint = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(
    searchVal
  )}&returnGeom=Y&getAddrDetails=Y&pageNum=${pageNum}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`OneMap API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching OneMap data:", err);
    throw err;
  }
}
