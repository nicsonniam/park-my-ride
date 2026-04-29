/* eslint-disable @typescript-eslint/no-explicit-any */
import clientPromise from "@/lib/db";
import { HDBCarpark, URACarpark, PrivateCarpark } from "@/types/carpark";

const COLLECTION_NAME = "carparkList";
const HDB_DB_NAME = "hdbCarparkData";
const URA_DB_NAME = "uraCarparkData";
const PRIVATE_DB_NAME = "privateCarparkData";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    if (!origin || !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    const body = await req.json();
    const { latitude, longitude, radius } = body;

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: "latitude and longitude are required" }),
        { status: 400 },
      );
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const maxDistance = radius ? parseInt(radius, 10) : 100;

    const client = await clientPromise;

    let hdbCarparks: any[] = [];
    try {
      hdbCarparks = await client
        .db(HDB_DB_NAME)
        .collection(COLLECTION_NAME)
        .aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [lon, lat] },
              distanceField: "distance",
              spherical: true,
              maxDistance,
            },
          },
          { $limit: 50 },
          {
            $addFields: {
              lng: { $arrayElemAt: ["$location.coordinates", 0] },
              lat: { $arrayElemAt: ["$location.coordinates", 1] },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.error(err);
    }

    let uraCarparks: any[] = [];
    try {
      uraCarparks = await client
        .db(URA_DB_NAME)
        .collection(COLLECTION_NAME)
        .aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [lon, lat] },
              distanceField: "distance",
              spherical: true,
              maxDistance,
            },
          },
          {
            $match: {
              vehCat: { $ne: "Heavy Vehicle" },
              parkCapacity: { $gt: 0 },
            },
          },
          { $limit: 50 },
          {
            $addFields: {
              lng: { $arrayElemAt: ["$geojson.coordinates", 0] },
              lat: { $arrayElemAt: ["$geojson.coordinates", 1] },
            },
          },
        ])
        .toArray();

      const seen = new Set<string>();
      uraCarparks = uraCarparks.filter((cp) => {
        if (seen.has(cp.ppCode)) return false;
        seen.add(cp.ppCode);
        return true;
      });

      uraCarparks = uraCarparks.slice(0, 10);
    } catch (err) {
      console.error(err);
    }

    let privateCarparks: PrivateCarpark[] = [];
    try {
      privateCarparks = await client
        .db(PRIVATE_DB_NAME)
        .collection(COLLECTION_NAME)
        .aggregate<PrivateCarpark>([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [lon, lat] },
              distanceField: "distance",
              spherical: true,
              maxDistance,
            },
          },
          { $limit: 50 },
        ])
        .toArray();

      privateCarparks = privateCarparks
        .map((cp) => ({
          ...cp,
          isNoParking:
            !cp.rates || cp.rates.toLowerCase() === "no motorcycle parking",
        }))
        .sort((a, b) => {
          if (a.isNoParking && !b.isNoParking) return 1;
          if (!a.isNoParking && b.isNoParking) return -1;
          return 0;
        });
    } catch (err) {
      console.error(err);
    }

    return new Response(
      JSON.stringify({ hdbCarparks, uraCarparks, privateCarparks }),
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
