"use client";

import dynamic from "next/dynamic";
import type { MapCarpark } from "@/types/carpark";
import { Typography } from "@mui/material";
import { COPY } from "@/app/constants/copy";

type Props = {
  spots: MapCarpark[];
  center: [number, number];
  zoom?: number;
  openNavigation?: (cp: MapCarpark) => void;
};

const ParkingMap = dynamic(() => import("./ParkingMap"), {
  ssr: false,
  loading: () => (
    <Typography variant="body1">{COPY.general.loadingMap}</Typography>
  ),
});

export default function ParkingMapWrapper(props: Props) {
  return <ParkingMap {...props} />;
}
