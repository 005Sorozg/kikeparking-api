export interface ParkingSpot {
  id: number;
  title: string;
  neighborhood: string;
  address: string;
  pricePerHour: number;
  available: boolean;
  rating: number;
  ownerId: number;
  
}
// Campos que el propietario puede modificar de su parqueadero
export type ParkingSpotChanges = Partial<
  Pick<ParkingSpot, "title" | "neighborhood" | "address" | "pricePerHour">
>;