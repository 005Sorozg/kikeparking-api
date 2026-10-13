import { ParkingSpot } from "./models/parking-spot.model";

// Datos en memoria: se reemplazarán por la base de datos más adelante
export const parkingSpotData: ParkingSpot[] = [
  {
    id: 1,
    title: "Garaje techado con vigilancia",
    neighborhood: "Laureles",
    address: "Cra. 76 #44-20",
    pricePerHour: 3000,
    available: true,
    rating: 4.9,
  },
  {
    id: 2,
    title: "Celda en unidad cerrada",
    neighborhood: "El Poblado",
    address: "Cl. 9 #37-15",
    pricePerHour: 3500,
    available: true,
    rating: 4.6,
  },
  {
    id: 3,
    title: "Parqueadero descubierto",
    neighborhood: "Belén",
    address: "Cra. 70 #30-08",
    pricePerHour: 2500,
    available: false,
    rating: 4.2,
  },
  {
    id: 4,
    title: "Garaje familiar",
    neighborhood: "Envigado",
    address: "Cl. 38 Sur #43-12",
    pricePerHour: 2800,
    available: true,
    rating: 4.8,
  },
];