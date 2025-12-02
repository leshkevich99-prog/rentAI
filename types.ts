export enum CarCategory {
  SPORT = 'Спорткары',
  SUV = 'Внедорожники',
  SEDAN = 'Представительские',
  CONVERTIBLE = 'Кабриолеты'
}

export interface DiscountRule {
  days: number; // Больше этого количества дней
  discount: number; // Процент скидки (0-100)
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
  description?: string;
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