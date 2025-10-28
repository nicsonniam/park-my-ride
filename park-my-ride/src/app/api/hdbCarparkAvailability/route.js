import clientPromise from "@/lib/db";

const DB_NAME = "hdbCarparkData";
const COLLECTION_NAME = "availability";

export async function POST(req) {
  try {
    const { carpark_number } = await req.json();

    if (!carpark_number) {
      return new Response(
        JSON.stringify({ error: "carpark_number is required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const results = await collection.find({ carpark_number }).toArray();

    const motorcycleLots = results
      .flatMap(entry =>
        entry.carpark_info
          .filter(lot => lot.lot_type === "Y")
          .map(lot => ({
            total_lots: lot.total_lots,
            lots_available: lot.lots_available,
            last_updated: entry.update_datetime
          }))
      );

    return new Response(JSON.stringify({ motorcycleLots }), { status: 200 });
  } catch (err) {
    console.error("Error fetching availability:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
