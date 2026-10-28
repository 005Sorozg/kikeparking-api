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