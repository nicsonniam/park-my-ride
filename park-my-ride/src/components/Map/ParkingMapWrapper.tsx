"use client";

import dynamic from "next/dynamic";
import type { MapCarpark } from "@/types/carpark";

type Props = {
  spots: MapCarpark[];
  center: [number, number];
  zoom?: number;
  openNavigation?: (cp: MapCarpark) => void;
};

const ParkingMap = dynamic(() => import("./ParkingMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function ParkingMapWrapper(props: Props) {
  return <ParkingMap {...props} />;
}
