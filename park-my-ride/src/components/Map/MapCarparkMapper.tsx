"use client";

import type { HDBCarpark, URACarpark, PrivateCarpark } from "@/types/carpark";
import type { MapCarpark } from "@/types/carpark";

export function mapCarparks(
  hdb: HDBCarpark[],
  ura: URACarpark[],
  privateCarparks: PrivateCarpark[]
): MapCarpark[] {
  return [
    ...hdb.map((cp) => ({
      id: cp._id,
      lat: cp.lat ?? 0,
      lng: cp.lng ?? 0,
      location: cp.address,
      rates: null,
      isNoParking: null,
      parking_system: cp.type_of_parking_system,
      car_park_type: cp.car_park_type,
      vehCat: null,
      source: "HDB" as const,
    })),

    ...ura.map((cp) => ({
      id: cp._id,
      lat: cp.lat ?? 0,
      lng: cp.lng ?? 0,
      location: cp.ppName,
      rates: null,
      isNoParking: null,
      parking_system: null,
      car_park_type: null,
      vehCat: cp.vehCat,
      source: "URA" as const,
    })),

    ...privateCarparks.map((cp) => ({
      id: cp._id,
      lat: cp.latitude ?? 0,
      lng: cp.longitude ?? 0,
      location: cp.location_name ?? cp.address ?? "Unknown",
      rates: cp.rates ?? null,
      isNoParking: cp.isNoParking,
      parking_system: null,
      car_park_type: null,
      vehCat: null,
      source: "PRIVATE" as const,
    })),
  ];
}
