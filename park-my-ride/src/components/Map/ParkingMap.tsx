"use client";

import { Box, Button, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { MapCarpark } from "@/types/carpark";
import { sentenceCase } from "@/app/constants/helpers";
import { COPY } from "@/app/constants/copy";

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
    console.log(spot);
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
        maxBounds={[
          [1.130475, 103.605011],
          [1.470125, 104.0945],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center} icon={orangeIcon}>
          <Popup>
            <Typography variant="body1">
              {COPY.general.selectedAddress}
            </Typography>
          </Popup>
        </Marker>

        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={getIcon(spot)}
          >
            <Popup className="map-popup">
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "180px",
                  margin: "0 auto",
                  lineHeight: "1.4",
                }}
              >
                <Typography variant="body1" className="med" sx={{ m: 0 }}>
                  {spot.source} - {spot.location}
                </Typography>

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

                {(spot.parking_system) && (
                  <Typography variant="body2">
                    {sentenceCase(spot.parking_system)}
                  </Typography>
                )}

                <br />

                {openNavigation && (
                  <Button
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      p: 2,
                      height: "40px",
                      fontSize: 14,
                    }}
                    onClick={() => openNavigation(spot)}
                  >
                    {COPY.general.openInMaps}
                  </Button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
