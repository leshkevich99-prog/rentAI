
export enum CarCategory {
  SPORT = 'SPORT',
  SUV = 'SUV',
  SEDAN = 'SEDAN',
  CONVERTIBLE = 'CONVERTIBLE'
}

export interface DiscountRule {
  days: number;
  discount: number;
}

export interface Car {
  id: string;
  name: string;
  name_en?: string;
  category: CarCategory;
  pricePerDay: number;
  specs: {
    hp: number;
    zeroToSixty: number;
    maxSpeed: number;
  };
  imageUrl: string;
  available: boolean;
  isAvailableToday?: boolean;
  description?: string;
  description_en?: string;
  discountRules?: DiscountRule[];
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
  totalPrice?: number;
  days?: number;
  discountApplied?: number;
}
