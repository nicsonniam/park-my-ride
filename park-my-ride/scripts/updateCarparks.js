import fetch from "node-fetch";
import { MongoClient } from "mongodb";
import proj4 from "proj4";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "hdbCarparkData";
const COLLECTION_NAME = "carparkList";

async function updateCarparks() {
  // 1. Fetch dataset
  const url =
    "https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3000";
  const response = await fetch(url);
  const data = await response.json();
  const carparkList = data.result.records;

  // 2. Setup Mongo client
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  // 3. Define projections (SVY21 → WGS84)
  const svy21 =
    "+proj=tmerc +lat_0=1.366666 +lon_0=103.833333 +k=1.0 " +
    "+x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs";
  const wgs84 = proj4.WGS84;

  // 4. Transform carpark data into GeoJSON format
  const transformed = carparkList.map((carpark) => {
    let location = null;

    if (carpark.x_coord && carpark.y_coord) {
      const [lon, lat] = proj4(svy21, wgs84, [
        parseFloat(carpark.x_coord),
        parseFloat(carpark.y_coord),
      ]);
      location = {
        type: "Point",
        coordinates: [lon, lat],
      };
    }

    return {
      ...carpark,
      location,
    };
  });

  // 5. Overwrite collection
  await collection.deleteMany({});
  await collection.insertMany(transformed);

  // 6. Ensure geospatial index
  await collection.createIndex({ location: "2dsphere" });

  console.log("✅ Carpark data updated at", new Date());

  await client.close();
}

// Run if called directly
if (require.main === module) {
  updateCarparks().catch((err) => {
    console.error("❌ Error updating carparks:", err);
    process.exit(1);
  });
}
