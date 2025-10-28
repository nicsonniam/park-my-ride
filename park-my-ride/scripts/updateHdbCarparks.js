/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require("mongodb");
const proj4 = require("proj4");

const MONGODB_URI = process.env.MONGODB_URI;

async function updateHdbCarparks() {
  const fetch = (await import("node-fetch")).default;

  const url =
    "https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3000";
  const response = await fetch(url);
  const data = await response.json();
  const carparkList = data.result.records;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("hdbCarparkData");
  const collection = db.collection("carparkList");

  const svy21 =
    "+proj=tmerc +lat_0=1.366666 +lon_0=103.833333 +k=1.0 " +
    "+x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs";
  const wgs84 = proj4.WGS84;

  const transformed = carparkList.map((carpark) => {
    let location = null;

    if (carpark.x_coord && carpark.y_coord) {
      const [lon, lat] = proj4(svy21, wgs84, [
        parseFloat(carpark.x_coord),
        parseFloat(carpark.y_coord),
      ]);
      location = { type: "Point", coordinates: [lon, lat] };
    }

    let verified = undefined;
    if (carpark.verified !== undefined) {
      const val = String(carpark.verified).trim().toUpperCase();
      verified = val === "TRUE";
    }

    return {
      ...carpark,
      verified,
      location,
    };
  });

  await collection.deleteMany({});
  await collection.insertMany(transformed);
  await collection.createIndex({ location: "2dsphere" });

  console.log("Carpark data updated at", new Date());
  await client.close();
}

if (require.main === module) {
  updateHdbCarparks().catch((err) => {
    console.error("Error updating carparks:", err);
    process.exit(1);
  });
}
