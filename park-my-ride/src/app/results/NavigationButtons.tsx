"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { COPY } from "../constants/copy";

import CloseIcon from "@mui/icons-material/Close";
import { Dispatch, SetStateAction } from "react";

type Coordinates = {
  latitude?: number;
  longitude?: number;
  location?: {
    coordinates?: [number, number];
  };
  geojson?: {
    coordinates?: [number, number];
  };
  location_name?: string;
  address?: string;
  ppCode?: string;
  ppName?: string;
  car_park_no?: string;
  car_park_type?: string;
};

type Props = {
  selectedCarpark: Coordinates;
  isMobile: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

export default function NavigationButtons({
  selectedCarpark,
  isMobile,
  setDrawerOpen,
}: Props) {
  const getCoordinates = () => {
    if (selectedCarpark.latitude && selectedCarpark.longitude) {
      return {
        lat: selectedCarpark.latitude,
        lon: selectedCarpark.longitude,
      };
    }

    if (
      selectedCarpark.location?.coordinates &&
      selectedCarpark.location.coordinates.length === 2
    ) {
      return {
        lat: selectedCarpark.location.coordinates[1],
        lon: selectedCarpark.location.coordinates[0],
      };
    }

    if (
      selectedCarpark.geojson?.coordinates &&
      selectedCarpark.geojson.coordinates.length === 2
    ) {
      return {
        lat: selectedCarpark.geojson.coordinates[1],
        lon: selectedCarpark.geojson.coordinates[0],
      };
    }

    return null;
  };

  const openGoogleMaps = () => {
    const coords = getCoordinates();
    if (!coords) return;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lon}`,
      "_blank",
    );
  };

  const openWaze = () => {
    const coords = getCoordinates();
    if (!coords) return;

    window.open(
      `https://waze.com/ul?ll=${coords.lat},${coords.lon}&navigate=yes`,
      "_blank",
    );
  };

  return (
    <Stack sx={{ position: "relative", width: isMobile ? "unset" : 400 }}>
      <Box
        onClick={() => setDrawerOpen(false)}
        sx={{ cursor: "pointer", position: "absolute", top: 0, right: 0 }}
      >
        <CloseIcon />
      </Box>
      <Typography className="med" variant="h6" gutterBottom>
        {COPY.general.navigatingTo}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {selectedCarpark.location_name ||
          selectedCarpark.ppCode ||
          selectedCarpark.car_park_no}
      </Typography>

      <Typography variant="body2" gutterBottom>
        {selectedCarpark.address ||
          selectedCarpark.car_park_type ||
          selectedCarpark.ppName}
      </Typography>

      <Stack sx={{ pt: 2 }} flexDirection={isMobile ? "row" : "column"} gap={2}>
        <Button variant="contained" fullWidth onClick={openGoogleMaps}>
          {COPY.general.googleMaps}
        </Button>

        <Button variant="contained" fullWidth onClick={openWaze}>
          {COPY.general.waze}
        </Button>
      </Stack>
    </Stack>
  );
}
