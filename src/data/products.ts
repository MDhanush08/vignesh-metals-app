export interface SizeOption {
  id?: string;
  label: string;
  price: number;
  HT?: number;
  BT?: number;
  WT?: number;
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  category: string;
  packSize: string;
  description: string;
  sizeOptions?: SizeOption[];
}

export const PRODUCTS: Product[] = [
  // --- Brass Diya / Vilakku ---
  {
    id: 'bd1',
    name: 'BRASS VILAKKU - 1',
    basePrice: 350,
    image: '/assets/products/vilakku-1.png',
    category: 'Brass Diya',
    packSize: '1 PCS',
    description: 'High-quality traditional brass vilakku, crafted for daily spiritual needs and special occasions.',
    sizeOptions: [
      { label: 'Size 0', price: 350 },
      { label: 'Size 1', price: 450 },
      { label: 'Size 2', price: 600 },
      { label: 'Size 3', price: 850 }
    ]
  },

  // --- Pooja Articles ---
  {
    id: 'pa1',
    name: 'BR P PATHIRAM',
    basePrice: 450,
    image: '/assets/products/br-p-pathiram.png',
    category: 'Pooja Articles',
    packSize: '1 PCS',
    description: 'Durable brass vessel (Pathiram) for traditional storage and pooja rituals.',
    sizeOptions: [
      { label: 'Small', price: 450 },
      { label: 'Medium', price: 750 },
      { label: 'Large', price: 1200 }
    ]
  },
  {
    id: 'pa2',
    name: 'COP P PATHIRAM',
    basePrice: 480,
    image: '/assets/products/cop-p-pathiram.png',
    category: 'Pooja Articles',
    packSize: '1 PCS',
    description: 'Pure copper pathiram, specifically made for storing sacred water and offerings.',
    sizeOptions: [
      { label: '4 Inch', price: 480 },
      { label: '6 Inch', price: 650 },
      { label: '8 Inch', price: 950 }
    ]
  },
  {
    id: 'pa3',
    name: 'J SOMBU',
    basePrice: 280,
    image: '/assets/products/j-sombu.png',
    category: 'Pooja Articles',
    packSize: '1 PCS',
    description: 'Elegant brass sombu with a polished finish, used for spiritual ceremonies.',
    sizeOptions: [
      { label: '0.25 Litre', price: 280 },
      { label: '0.5 Litre', price: 450 },
      { label: '1 Litre', price: 800 }
    ]
  },

  // --- Temple Utensils ---
  {
    id: 'tu1',
    name: 'POOJA BELL',
    basePrice: 220,
    image: '/assets/products/pooja-bell.png',
    category: 'Temple Utensils',
    packSize: '1 PCS',
    description: 'Traditional brass hand bell used for resonance during temple and home pooja rituals.',
    sizeOptions: [
      { label: 'Size 1', price: 220 },
      { label: 'Size 2', price: 350 },
      { label: 'Size 3', price: 480 }
    ]
  }
];

export const CATEGORIES = ['Brass Diya', 'Pooja Articles', 'Temple Utensils'];
