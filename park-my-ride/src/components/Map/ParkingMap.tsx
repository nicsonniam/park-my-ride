"use client";

import { Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { MapCarpark } from "@/types/carpark";

type Props = {
  spots: MapCarpark[];
  center: [number, number];
  zoom?: number;
  openNavigation?: (cp: MapCarpark) => void;
};

const shadow = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const blueIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const violetIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const yellowIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const orangeIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: shadow,
  iconSize: [30, 50],
  iconAnchor: [15, 50],
});

export default function ParkingMap({
  spots,
  center,
  zoom = 13,
  openNavigation,
}: Props) {
  const getIcon = (spot: MapCarpark) => {
    if (spot.isNoParking) {
      return redIcon;
    }
    if (spot.source === "HDB") {
      return violetIcon;
    }
    if (spot.source === "URA") {
      if (spot.vehCat === "Motorcycle") {
        return greenIcon;
      } else {
        return yellowIcon;
      }
    }
    return blueIcon;
  };
  return (
    <Box
      sx={{
        position: { xs: "relative", md: "absolute" },
        left: { md: 0 },
        width: "100%",
        height: { xs: "70vh", md: "75vh" },
      }}
    >
      <MapContainer
        center={center}
        maxZoom={18}
        minZoom={16}
        style={{ height: "100%", width: "100%" }}
        zoom={zoom}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center} icon={orangeIcon}>
          <Popup>Selected Address</Popup>
        </Marker>

        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={getIcon(spot)}
          >
            <Popup>
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "180px",
                  margin: "0 auto",
                  lineHeight: "1.4",
                }}
              >
                <strong>
                  {spot.source} - {spot.location}
                </strong>

                {spot.rates && (
                  <>
                    <Box
                      component="div"
                      sx={{ mt: 1 }}
                      dangerouslySetInnerHTML={{
                        __html: spot.rates.replace(/\\n/g, "<br/>"),
                      }}
                    />
                  </>
                )}

                {spot.parking_system && (
                  <>
                    <br />
                    System: {spot.parking_system}
                  </>
                )}

                {spot.vehCat && (
                  <>
                    <br />
                    {spot.vehCat === "Motorcycle" ? (
                      "Motorcycle parking available at this location."
                    ) : (
                      <>
                        Motorcycle parking <strong>may not</strong> be available
                        here.
                      </>
                    )}
                  </>
                )}

                <br />

                {openNavigation && (
                  <button
                    style={{
                      marginTop: "10px",
                      padding: "6px 10px",
                      cursor: "pointer",
                      background: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                    onClick={() => openNavigation(spot)}
                  >
                    Open in Maps
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
