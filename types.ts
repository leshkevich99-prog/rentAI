export enum CarCategory {
  SPORT = 'Спорткары',
  SUV = 'Внедорожники',
  SEDAN = 'Представительские',
  CONVERTIBLE = 'Кабриолеты'
}

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  pricePerDay: number;
  specs: {
    hp: number;
    zeroToSixty: number; // in seconds
    maxSpeed: number; // km/h
  };
  imageUrl: string;
  available: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface BookingDetails {
  carId: string | null;
  startDate: string;
  endDate: string;
  name: string;
  phone: string;
}