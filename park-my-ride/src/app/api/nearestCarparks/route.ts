import clientPromise from "@/lib/db";

interface HDBCarpark {
  _id: string;
  car_park_no: string;
  address: string;
  car_park_type: string;
  type_of_parking_system: string;
  distance: number;
}

interface URACarpark {
  _id: string;
  ppCode: string;
  ppName: string;
  vehCat: string;
  parkCapacity: number;
  distance: number;
}

interface PrivateCarpark {
  _id: string;
  location_name: string;
  address: string;
  rates: string;
  latitude: number;
  longitude: number;
  distance: number;
  verified: boolean;
  isNoParking?: boolean;
}

const COLLECTION_NAME = "carparkList";
const HDB_DB_NAME = "hdbCarparkData";
const URA_DB_NAME = "uraCarparkData";
const PRIVATE_DB_NAME = "privateCarparkData";

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    if (!origin || !allowedOrigins.includes(origin)) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        { status: 403 }
      );
    }
    const body = await req.json();
    const { latitude, longitude, radius } = body;

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: "latitude and longitude are required" }),
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const maxDistance = radius ? parseInt(radius, 10) : 100;

    const client = await clientPromise;

    let hdbCarparks: HDBCarpark[] = [];
    try {
      hdbCarparks = await client
        .db(HDB_DB_NAME)
        .collection(COLLECTION_NAME)
        .aggregate<HDBCarpark>([
          { $geoNear: { near: { type: "Point", coordinates: [lon, lat] }, distanceField: "distance", spherical: true, maxDistance } },
          { $limit: 10 },
        ])
        .toArray();
    } catch (err) {
      console.error(err);
    }

    let uraCarparks: URACarpark[] = [];
    try {
      uraCarparks = await client
        .db(URA_DB_NAME)
        .collection(COLLECTION_NAME)
        .aggregate<URACarpark>([
          { $geoNear: { near: { type: "Point", coordinates: [lon, lat] }, distanceField: "distance", spherical: true, maxDistance } },
          { $match: { vehCat: "Motorcycle", parkCapacity: { $gt: 0 } } },
          { $limit: 10 },
        ])
        .toArray();
    } catch (err) {
      console.error(err);
    }

    let privateCarparks: PrivateCarpark[] = [];
    try {
      privateCarparks = await client
        .db(PRIVATE_DB_NAME)
        .collection(COLLECTION_NAME)
        .aggregate<PrivateCarpark>([
          { $geoNear: { near: { type: "Point", coordinates: [lon, lat] }, distanceField: "distance", spherical: true, maxDistance } },
          { $limit: 50 },
        ])
        .toArray();

      privateCarparks = privateCarparks
        .map((cp) => ({
          ...cp,
          isNoParking: !cp.rates || cp.rates.toLowerCase() === "no motorcycle parking",
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
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
