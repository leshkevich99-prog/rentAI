
import { Car, CarCategory } from './types';

const DEFAULT_DESCRIPTION = "Испытайте истинное удовольствие от вождения. Этот автомобиль сочетает в себе безупречный стиль, передовые технологии и невероятную мощь. Идеальный выбор для тех, кто не привык к компромиссам. Салон выполнен из премиальных материалов, обеспечивая максимальный комфорт в любой поездке.";

const DEFAULT_DISCOUNTS = [
  { days: 3, discount: 10 },
  { days: 5, discount: 15 },
  { days: 15, discount: 20 }
];

// Используем реальные фото с Unsplash для демо
export const CARS: Car[] = [
  {
    id: '1',
    name: 'Lamborghini Huracán Evo',
    category: CarCategory.SPORT,
    pricePerDay: 3500,
    specs: { hp: 640, zeroToSixty: 2.9, maxSpeed: 325 },
    imageUrl: 'https://images.unsplash.com/photo-1544602356-ac9c5220c57c?q=80&w=2940&auto=format&fit=crop', 
    available: true,
    description: DEFAULT_DESCRIPTION,
    discountRules: DEFAULT_DISCOUNTS
  },
  {
    id: '2',
    name: 'Rolls-Royce Cullinan',
    category: CarCategory.SUV,
    pricePerDay: 4200,
    specs: { hp: 563, zeroToSixty: 5.2, maxSpeed: 250 },
    imageUrl: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=2787&auto=format&fit=crop', 
    available: true,
    description: "Роскошный внедорожник, который переопределяет понятие комфорта. Rolls-Royce Cullinan — это воплощение элегантности и мощи, способное покорить любые дороги с неизменным достоинством.",
    discountRules: DEFAULT_DISCOUNTS
  },
  {
    id: '3',
    name: 'Mercedes-Benz S-Class Maybach',
    category: CarCategory.SEDAN,
    pricePerDay: 2100,
    specs: { hp: 496, zeroToSixty: 4.8, maxSpeed: 250 },
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop', 
    available: true,
    description: DEFAULT_DESCRIPTION,
    discountRules: DEFAULT_DISCOUNTS
  },
  {
    id: '4',
    name: 'Ferrari F8 Tributo',
    category: CarCategory.SPORT,
    pricePerDay: 3800,
    specs: { hp: 710, zeroToSixty: 2.9, maxSpeed: 340 },
    imageUrl: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2940&auto=format&fit=crop', 
    available: true,
    description: DEFAULT_DESCRIPTION,
    discountRules: DEFAULT_DISCOUNTS
  },
  {
    id: '5',
    name: 'Bentley Continental GT',
    category: CarCategory.CONVERTIBLE,
    pricePerDay: 2800,
    specs: { hp: 650, zeroToSixty: 3.6, maxSpeed: 335 },
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2940&auto=format&fit=crop', 
    available: false,
    description: DEFAULT_DESCRIPTION,
    discountRules: DEFAULT_DISCOUNTS
  },
  {
    id: '6',
    name: 'Porsche 911 Turbo S',
    category: CarCategory.SPORT,
    pricePerDay: 2900,
    specs: { hp: 640, zeroToSixty: 2.7, maxSpeed: 330 },
    imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2940&auto=format&fit=crop', 
    available: true,
    description: DEFAULT_DESCRIPTION,
    discountRules: DEFAULT_DISCOUNTS
  }
];
