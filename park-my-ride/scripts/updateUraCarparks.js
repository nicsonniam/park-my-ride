/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require("mongodb");
const proj4 = require("proj4");

const MONGODB_URI = process.env.MONGODB_URI;
const ACCESS_KEY = process.env.URA_ACCESS_KEY;

const DB_NAME = "uraCarparkData";
const COLLECTION_NAME = "carparkList";

// Define projection systems
const SVY21 =
  "+proj=tmerc +lat_0=1.366666 +lon_0=103.833333 +k=1.0 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs";
const WGS84 = proj4.WGS84;

function svy21ToWgs84(x, y) {
  const [lon, lat] = proj4(SVY21, WGS84, [x, y]);
  return { lon, lat };
}

async function updateUraCarparks() {
  try {
    const tokenResp = await fetch(
      "https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1",
      {
        headers: {
          AccessKey: ACCESS_KEY,
        },
      }
    );
    const tokenData = await tokenResp.json();
    const token = tokenData?.Result;

    if (!token) throw new Error("Failed to get URA token");

    const dataResp = await fetch(
      "https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=Car_Park_Details",
      {
        headers: {
          AccessKey: ACCESS_KEY,
          Token: token,
        },
      }
    );
    const data = await dataResp.json();
    const results = data?.Result || [];

    if (!results.length) {
      console.log("No data received from URA endpoint");
      return;
    }

    const transformed = results.map((item) => {
      let geojson = null;

      if (item.geometries && Array.isArray(item.geometries) && item.geometries.length > 0) {
        const [x, y] = item.geometries[0].coordinates.split(",").map(Number);
        const { lon, lat } = svy21ToWgs84(x, y);
        geojson = {
          type: "Point",
          coordinates: [lon, lat],
        };
      }

      return {
        ...item,
        geojson,
      };
    });

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

    await collection.deleteMany({});
    await collection.insertMany(transformed);

    await collection.createIndex({ geojson: "2dsphere" });

    console.log("URA carparks updated successfully with GeoJSON coordinates!");
    await client.close();
  } catch (err) {
    console.error("Error updating URA carparks:", err);
  }
}

updateUraCarparks();
