import { Car, CarCategory } from './types';

// Функция для создания стильной заглушки автомобиля в формате SVG
const generateCarPlaceholder = (name: string, category: string) => {
  const svg = `
  <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad_${name.replace(/\s/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f0f0f;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
      </linearGradient>
      <pattern id="pattern_${name.replace(/\s/g, '')}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 40 L40 0 H20 L0 20 M40 40 V20 L20 40" stroke="#1f1f1f" stroke-width="1" fill="none"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad_${name.replace(/\s/g, '')})" />
    <rect width="100%" height="100%" fill="url(#pattern_${name.replace(/\s/g, '')})" opacity="0.3" />
    
    <!-- Abstract Car Shape Hint -->
    <path d="M100 400 L200 300 H600 L700 400" stroke="#333" stroke-width="2" fill="none" opacity="0.5"/>
    <line x1="100" y1="400" x2="700" y2="400" stroke="#D4AF37" stroke-width="2" opacity="0.8" />
    
    <!-- Text -->
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#222" font-family="sans-serif" font-size="80" font-weight="bold" opacity="0.5" transform="rotate(-5, 400, 300)">${category}</text>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#D4AF37" font-family="serif" font-size="36" font-weight="bold" letter-spacing="2">${name}</text>
    
    <!-- Frame -->
    <rect x="40" y="40" width="720" height="520" fill="none" stroke="#D4AF37" stroke-width="1" opacity="0.2"/>
  </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const DEFAULT_DESCRIPTION = "Испытайте истинное удовольствие от вождения. Этот автомобиль сочетает в себе безупречный стиль, передовые технологии и невероятную мощь. Идеальный выбор для тех, кто не привык к компромиссам. Салон выполнен из премиальных материалов, обеспечивая максимальный комфорт в любой поездке.";

const DEFAULT_DISCOUNTS = [
  { days: 3, discount: 10 },
  { days: 5, discount: 15 },
  { days: 15, discount: 20 }
];

export const CARS: Car[] = [
  {
    id: '1',
    name: 'Lamborghini Huracán Evo',
    category: CarCategory.SPORT,
    pricePerDay: 3500,
    specs: { hp: 640, zeroToSixty: 2.9, maxSpeed: 325 },
    imageUrl: generateCarPlaceholder('Huracán Evo', 'SPORT'),
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
    imageUrl: generateCarPlaceholder('Cullinan', 'SUV'),
    available: true,
    description: "Роскошный внедорожник, который переопределяет понятие комфорта. Rolls-Royce Cullinan — это воплощение элегантности и мощи, способное покорить любые дороги с неизменным достоинством.",
    discountRules: DEFAULT_DISCOUNTS
  },
  {
    id: '3',
    name: 'Mercedes-Benz Maybach',
    category: CarCategory.SEDAN,
    pricePerDay: 2100,
    specs: { hp: 496, zeroToSixty: 4.8, maxSpeed: 250 },
    imageUrl: generateCarPlaceholder('Maybach S-Class', 'SEDAN'),
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
    imageUrl: generateCarPlaceholder('Ferrari F8', 'SPORT'),
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
    imageUrl: generateCarPlaceholder('Continental GT', 'CONVERTIBLE'),
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
    imageUrl: generateCarPlaceholder('911 Turbo S', 'SPORT'),
    available: true,
    description: DEFAULT_DESCRIPTION,
    discountRules: DEFAULT_DISCOUNTS
  }
];