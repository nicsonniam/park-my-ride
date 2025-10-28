/* eslint-disable @typescript-eslint/no-require-imports */
const { google } = require("googleapis");
const { MongoClient } = require("mongodb");

async function syncSheetsToMongo() {
  try {
    // --- Load environment variables ---
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}");
    const sheetId = process.env.SHEET_ID;
    const range = process.env.RANGE || "Sheet1";
    const mongoUri = process.env.MONGODB_URI;

    if (!sheetId || !mongoUri) {
      throw new Error("Missing required environment variables: SHEET_ID or MONGODB_URI");
    }

    // --- Authorize Google Sheets API ---
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // --- Fetch data ---
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found in sheet.");
      return;
    }

    // --- Convert rows to JSON documents ---
    const [headers, ...data] = rows;
    const documents = data
      .filter(row => row.some(cell => cell && cell.toString().trim() !== ""))
      .map(row => {
        const doc = {};
        headers.forEach((h, i) => {
          doc[h] = row[i] ?? null;
        });

        // --- Add GeoJSON location if lat/lon exist ---
        const lat = parseFloat(doc.latitude || doc.lat || doc.Latitude || 0);
        const lon = parseFloat(doc.longitude || doc.lon || doc.Longitude || 0);
        if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
          doc.location = { type: "Point", coordinates: [lon, lat] };
        }

        return doc;
      });

    if (documents.length === 0) {
      console.log("No valid rows to insert.");
      return;
    }

    // --- Connect to MongoDB ---
    const client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db("privateCarparkData");
    const collection = db.collection("carparkList");

    // Optional: clear old data before inserting
    await collection.deleteMany({});
    await collection.insertMany(documents);

    // --- Create 2dsphere index on location ---
    await collection.createIndex({ location: "2dsphere" });

    console.log(`Inserted ${documents.length} records into MongoDB with 2dsphere index.`);
    await client.close();
  } catch (error) {
    console.error("Error syncing Sheets to MongoDB:", error);
  }
}

// Run immediately if this file is executed directly
if (require.main === module) {
  syncSheetsToMongo().catch(err => {
    console.error("Error running sync:", err);
    process.exit(1);
  });
}
