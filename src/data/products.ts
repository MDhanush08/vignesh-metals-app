export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  packSize: string;
  description: string;
  sizes?: string[];
}

export const PRODUCTS: Product[] = [
  // --- Brass Diya / Vilakku ---
  {
    id: 'bd1',
    name: 'BRASS VILAKKU - 1',
    price: 350,
    image: '/assets/products/vilakku-1.png',
    category: 'Brass Diya',
    packSize: '1 PCS',
    description: 'High-quality traditional brass vilakku, crafted for daily spiritual needs and special occasions.',
    sizes: ['Size 000-12', 'Size 1-5']
  },

  // --- Pooja Articles ---
  {
    id: 'pa1',
    name: 'BR P PATHIRAM',
    price: 450,
    image: '/assets/products/br-p-pathiram.png',
    category: 'Pooja Articles',
    packSize: '1 PCS',
    description: 'Durable brass vessel (Pathiram) for traditional storage and pooja rituals.',
    sizes: ['Small', 'Medium', 'Large']
  },
  {
    id: 'pa2',
    name: 'COP P PATHIRAM',
    price: 480,
    image: '/assets/products/cop-p-pathiram.png',
    category: 'Pooja Articles',
    packSize: '1 PCS',
    description: 'Pure copper pathiram, specifically made for storing sacred water and offerings.',
    sizes: ['Standard']
  },
  {
    id: 'pa3',
    name: 'J SOMBU',
    price: 280,
    image: '/assets/products/j-sombu.png',
    category: 'Pooja Articles',
    packSize: '1 PCS',
    description: 'Elegant brass sombu with a polished finish, used for spiritual ceremonies.',
    sizes: ['S', 'M', 'L']
  },

  // --- Temple Utensils ---
  {
    id: 'tu1',
    name: 'POOJA BELL',
    price: 220,
    image: '/assets/products/pooja-bell.png',
    category: 'Temple Utensils',
    packSize: '1 PCS',
    description: 'Traditional brass hand bell used for resonance during temple and home pooja rituals.',
    sizes: ['Size 1, 2, 3']
  }
];

export const CATEGORIES = ['Brass Diya', 'Pooja Articles', 'Temple Utensils'];
