import type { Category, Listing, TradeCategory } from '../types';
import tradeData from '../data/trades.json';

// Temporary mock data until API is ready
const mockCategories: Category[] = [
  {
    id: 'construction',
    name: 'Construction',
    icon: '🏗️',
    count: 245
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    count: 189
  }
];

const mockListings: Listing[] = [
  {
    id: '1',
    name: 'BuildRight Solutions',
    category: 'construction',
    description: 'Professional construction services',
    location: 'Dublin',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/400/300'
  }
];

export async function getCategories(): Promise<Category[]> {
  // TODO: Replace with actual API call
  return mockCategories;
}

export async function getFeaturedListings(): Promise<Listing[]> {
  // TODO: Replace with actual API call
  return mockListings;
}

export async function getTradeCategories(): Promise<TradeCategory[]> {
  // TODO: Replace with actual API call
  return tradeData.categories;
}