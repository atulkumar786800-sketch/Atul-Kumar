/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  rewardsPoints: number;
  referralCode: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  rating: number;
  image: string;
  bannerImage: string;
  category: 'beaches' | 'cultural' | 'adventure' | 'luxury' | 'mountains';
  weather: string;
  highlights: string[];
  averageCost: number;
  bestTime: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
  rooms: {
    type: string;
    description: string;
    price: number;
    capacity: number;
  }[];
}

export interface Flight {
  id: string;
  airline: string;
  logo: string;
  from: string;
  to: string;
  departure: string;
  duration: string;
  price: number;
  class: string;
  rating: number;
}

export interface Booking {
  id: string;
  userId: string;
  type: 'hotel' | 'flight' | 'package';
  itemDetails: {
    name: string;
    subDetails: string;
    image?: string;
    price: number;
    extra?: string;
  };
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
  travelDate: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  comments: Comment[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    title: string;
    description: string;
    cost: number;
    location?: string;
  }[];
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  days: number;
  budget: string;
  budgetBreakdown: {
    accommodations: number;
    activities: number;
    food: number;
    transportation: number;
    savings: number;
  };
  travelers: number;
  type: string;
  activities: string[];
  accommodationPreference: string;
  itinerary: ItineraryDay[];
  weatherInfo: {
    temp: string;
    conditions: string;
    recommendation: string;
  };
  totalSpent: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  groundingUrls?: { title: string; uri: string }[];
}
