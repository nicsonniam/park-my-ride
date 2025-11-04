/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Button,
  Tooltip,
  Drawer,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsRounded from "@mui/icons-material/DirectionsRounded";

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
  location_name?: string;
  address?: string;
  rates?: string;
  distance: number;
  isNoParking: boolean;
  verified: boolean;
  latitude?: number;
  longitude?: number;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const address =
    searchParams.get("address") === "null" ? null : searchParams.get("address");

  const [radius, setRadius] = useState<number>(200);
  const [loading, setLoading] = useState(false);
  const [hdbCarparks, setHdbCarparks] = useState<HDBCarpark[]>([]);
  const [uraCarparks, setUraCarparks] = useState<URACarpark[]>([]);
  const [privateCarparks, setPrivateCarparks] = useState<PrivateCarpark[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedCarpark, setSelectedCarpark] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchCarparks = async (lat: string, lon: string, radius: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/nearestCarparks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon, radius }),
      });
      const data = await res.json();

      setHdbCarparks(data.hdbCarparks || []);
      setUraCarparks(data.uraCarparks || []);
      setPrivateCarparks(
        ((data.privateCarparks as PrivateCarpark[]) || [])
          .map((cp) => ({
            _id: cp._id,
            location_name: cp.location_name || "Unknown",
            address: cp.address || "Unknown",
            rates: cp.rates || "No motorcycle parking",
            distance: cp.distance,
            isNoParking: cp.isNoParking || false,
            verified: cp.verified ?? false,
            latitude: cp.latitude,
            longitude: cp.longitude,
          }))
          .sort((a, b) => Number(a.isNoParking) - Number(b.isNoParking))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to fetch carparks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && lon) fetchCarparks(lat, lon, radius);
  }, [lat, lon, radius]);

  if (!lat || !lon) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Invalid location.</Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const openNavigation = (cp: any) => {
    setSelectedCarpark(cp);
    setDrawerOpen(true);
  };

  const renderCard = (cp: any, type: "HDB" | "URA" | "Private") => (
    <Card key={cp._id} sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h5"
            className={`${cp.isNoParking ? "" : "underline"}`}
            sx={{ cursor: cp.isNoParking ? "default" : "pointer" }}
            onClick={() => cp.isNoParking && type === "Private" ? null : openNavigation(cp)}
            noWrap
          >
            {
              !cp.isNoParking ? (
                <DirectionsRounded
                  fontSize="small"
                  className="mr-1"
                  sx={{ color: "black" }}
                />
              ) : <></>
            }
            {type === "HDB"
              ? `${cp.car_park_no} - ${cp.address}`
              : type === "URA"
              ? `${cp.ppCode} - ${cp.ppName}`
              : cp.location_name}
          </Typography>
          {type === "Private" && (
            <Tooltip title={cp.verified ? "Verified" : "Not Verified"} arrow>
              <CheckCircleIcon
                fontSize="small"
                sx={{ color: cp.verified ? "green" : "gray" }}
              />
            </Tooltip>
          )}
        </Stack>

        {type === "HDB" && (
          <Typography variant="body2" color="text.secondary" noWrap>
            Type: {cp.car_park_type} | Parking: {cp.type_of_parking_system}
          </Typography>
        )}

        {type === "URA" && (
          <Typography variant="body2" color="text.secondary" noWrap>
            Capacity: {cp.parkCapacity} | Category: {cp.vehCat}
          </Typography>
        )}

        {type === "Private" && (
          <>
            <Typography
              variant="body2"
              sx={{ color: cp.isNoParking ? "gray" : "inherit" }}
              noWrap
            >
              Address: {cp.address}
            </Typography>
            {cp.rates && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: cp.isNoParking ? "gray" : "inherit",
                  whiteSpace: "pre-line",
                }}
              >
                Rates: {cp.rates.replace(/\\n/g, "\n")}
              </Typography>
            )}
          </>
        )}

        <Typography variant="body2" color="text.secondary">
          Distance: {Math.round(cp.distance)} m
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" textAlign={{ xs: "center", sm: "left" }}>
          Motorcycle parking near you
        </Typography>
        <Select
          value={radius.toString()}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
          size="small"
          sx={{ width: { xs: "100%", sm: 120 } }}
        >
          <MenuItem value={100}>100m</MenuItem>
          <MenuItem value={200}>200m</MenuItem>
          <MenuItem value={300}>300m</MenuItem>
          <MenuItem value={500}>500m</MenuItem>
          <MenuItem value={700}>700m</MenuItem>
          <MenuItem value={1000}>1km</MenuItem>
        </Select>
        <Button
          variant="outlined"
          onClick={() => router.push("/")}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          Back to Home
        </Button>
      </Stack>

      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          whiteSpace: "pre-line",
          mb: 2,
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {address
          ? `Selected Address: ${address}`
          : `Current approx. location:\nLat:${lat} Long:${lon}`}
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            HDB Motorcycle Parking
          </Typography>
          {hdbCarparks.length
            ? hdbCarparks.map((cp) => renderCard(cp, "HDB"))
            : <Typography>No nearby HDB motorcycle parking</Typography>}

          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            URA Motorcycle Parking
          </Typography>
          {uraCarparks.length
            ? uraCarparks.map((cp) => renderCard(cp, "URA"))
            : <Typography>No nearby URA motorcycle parking</Typography>}

          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
            Other Motorcycle Parking
          </Typography>
          {privateCarparks.length
            ? privateCarparks.map((cp) => renderCard(cp, "Private"))
            : <Typography>No nearby private motorcycle parking</Typography>}
        </>
      )}

      {/* Bottom drawer for mobile */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, p: 2 } }}
      >
        {selectedCarpark && (
          <>
            <Typography variant="h6" gutterBottom>
              {selectedCarpark.location_name ||
                selectedCarpark.ppName ||
                selectedCarpark.car_park_no}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {selectedCarpark.address || selectedCarpark.car_park_type || ""}
            </Typography>
            <div className="flex gap-8">
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  let lat = 0;
                  let lon = 0;
                  if (selectedCarpark.latitude && selectedCarpark.longitude) {
                    lat = selectedCarpark.latitude;
                    lon = selectedCarpark.longitude;
                  } else if (selectedCarpark.location?.coordinates && selectedCarpark.location?.coordinates.length === 2) {
                    lat = selectedCarpark.location.coordinates[1];
                    lon = selectedCarpark.location.coordinates[0];
                  } else if (selectedCarpark.geojson?.coordinates && selectedCarpark.geojson?.coordinates.length === 2) {
                    lat = selectedCarpark.geojson.coordinates[1];
                    lon = selectedCarpark.geojson.coordinates[0];
                  }
                  if (lat === 0 && lon === 0) return;
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
                    "_blank"
                  );
                }}
              >
                Google Maps
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  let lat = 0;
                  let lon = 0;
                  if (selectedCarpark.latitude && selectedCarpark.longitude) {
                    lat = selectedCarpark.latitude;
                    lon = selectedCarpark.longitude;
                  } else if (selectedCarpark.location?.coordinates && selectedCarpark.location?.coordinates.length === 2) {
                    lat = selectedCarpark.location.coordinates[1];
                    lon = selectedCarpark.location.coordinates[0];
                  } else if (selectedCarpark.geojson?.coordinates && selectedCarpark.geojson?.coordinates.length === 2) {
                    lat = selectedCarpark.geojson.coordinates[1];
                    lon = selectedCarpark.geojson.coordinates[0];
                  }
                  if (lat === 0 && lon === 0) return;
                  window.open(
                    `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`,
                    "_blank"
                  );
                }}
              >
                Waze
              </Button>
            </div>
          </>
        )}
      </Drawer>
    </Container>
  );
}
