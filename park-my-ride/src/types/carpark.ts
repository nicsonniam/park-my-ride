export interface HDBCarpark {
  _id: string;
  car_park_no: string;
  address: string;
  car_park_type: string;
  type_of_parking_system: string;
  distance: number;
  lat: number;
  lng: number;
}

export interface URACarpark {
  _id: string;
  ppCode: string;
  ppName: string;
  vehCat: string;
  parkCapacity: number;
  distance: number;
  lat: number;
  lng: number;
}

export interface PrivateCarpark {
  _id: string;
  location_name?: string;
  address?: string;
  rates?: string;
  distance: number;
  isNoParking: boolean;
  verified: boolean;
  latitude: number;
  longitude: number;
}

export type MapCarpark = {
  id: string;
  lat: number;
  lng: number;
  location: string;
  rates: string | null;
  isNoParking: boolean | null;
  parking_system: string | null;
  car_park_type: string | null;
  vehCat: string | null,
  source: "HDB" | "URA" | "PRIVATE";
};
