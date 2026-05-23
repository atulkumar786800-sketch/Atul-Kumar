/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Destination, Hotel, Flight, Blog } from './types';

export const POPULAR_DESTINATIONS: Destination[] = [
  {
    id: 'dest-1',
    name: 'Amalfi Coast',
    country: 'Italy',
    description: 'A luxurious vertical landscape of dramatic cliffs, pastel Mediterranean villages, stunning turquoise waters, and classical terraced gardens.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1200',
    category: 'luxury',
    weather: 'Sunny, 24°C',
    highlights: ['Positano Village', 'Villa Rufolo Gardens', 'Capri Boat Excursions', 'Limoncello Tastings'],
    averageCost: 2400,
    bestTime: 'May to October'
  },
  {
    id: 'dest-2',
    name: 'Santorini',
    country: 'Greece',
    description: 'An iconic white-washed volcanic paradise famous for breathtaking sunsets, cobalt-blue domes, premium boutique villas, and infinity pools.',
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200',
    category: 'beaches',
    weather: 'Clear, 26°C',
    highlights: ['Oia Sunset Overlook', 'Red Beach Exploration', 'Akrotiri Archaeological Site', 'Volcanic Hot Springs'],
    averageCost: 1950,
    bestTime: 'April to November'
  },
  {
    id: 'dest-3',
    name: 'Kyoto',
    country: 'Japan',
    description: 'The cultural heart of Japan, featuring serene bamboo groves, vibrant red torii shrine arches, historic wooden machiya, and traditional tea ceremonies.',
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
    category: 'cultural',
    weather: 'Mild, 19°C',
    highlights: ['Fushimi Inari-taisha', 'Arashiyama Bamboo Grove', 'Kinkaku-ji (Golden Pavilion)', 'Gion Hanami-koji District'],
    averageCost: 1600,
    bestTime: 'March to May & October to November'
  },
  {
    id: 'dest-4',
    name: 'Swiss Alps',
    country: 'Switzerland',
    description: 'An alpine sanctuary of majestic peaks, high-end mountain chalets, pristine glacial lakes, and world-class luxury skiing facilities.',
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    category: 'mountains',
    weather: 'Snowing/Chilly, 8°C',
    highlights: ['Matterhorn peak', 'Zermatt eco-village', 'Glacier Express train', 'Chamonix cable car'],
    averageCost: 2800,
    bestTime: 'December to March & June to September'
  },
  {
    id: 'dest-5',
    name: 'Goa',
    country: 'India',
    description: 'Scenic tropical shores line of pure sand, Portuguese-era historical estate architecture, beach-side shacks, and rich warm seafood delicacies.',
    rating: 4.65,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1540200187866-1bc5730420f4?auto=format&fit=crop&q=80&w=1200',
    category: 'beaches',
    weather: 'Humid/Warm, 31°C',
    highlights: ['Anjuna Saturday Night Market', 'Basilica of Bom Jesus', 'Dudhsagar Waterfalls trekking', 'Palolem Beach Kayaking'],
    averageCost: 800,
    bestTime: 'November to February'
  },
  {
    id: 'dest-6',
    name: 'Reykjavik',
    country: 'Iceland',
    description: 'An otherworldly adventure terrain containing geothermal pools, majestic thermal geysers, active volcanic landscapes, and dancing Aurora Borealis.',
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1504893524553-ac55fce69aef?auto=format&fit=crop&q=80&w=600',
    bannerImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
    category: 'adventure',
    weather: 'Cold, 5°C',
    highlights: ['Blue Lagoon Thermal Waters', 'Golden Circle geysers tour', 'Northern Lights sighting', 'Black Sand beach trek'],
    averageCost: 2100,
    bestTime: 'September to March & June to August'
  }
];

export const BOUTIQUE_HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Belmond Hotel Caruso',
    location: 'Amalfi Coast, Italy',
    pricePerNight: 850,
    rating: 4.95,
    description: 'A suspended 11th-century palace perched on a rugged cliffside with an infinity pool that merges with the Mediterranean Sea below.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
    amenities: ['Cliffs Edge Infinity Pool', 'Michelin Star Dining', 'Guaranteed Sea Views', 'Wellness Spa', 'Chauffeur Service'],
    rooms: [
      { type: 'Superior Sea View Room', description: 'Graceful Mediterranean decor, spacious private balcony with panoramic garden & ocean vistas.', price: 850, capacity: 2 },
      { type: 'Palazzo Ducale Suite', description: 'Historic master suite, complete private marble terrace, private outdoor heated pool, personal lifestyle butler.', price: 1750, capacity: 3 }
    ]
  },
  {
    id: 'hotel-2',
    name: 'Grace Hotel, Auberge Resorts',
    location: 'Santorini, Greece',
    pricePerNight: 620,
    rating: 4.9,
    description: 'Chic minimalist architecture set into volcanic caldera cliffs, hosting iconic pool structures and signature luxury sunset dining.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
    amenities: ['Caldera Ocean Balcony', 'Champagne Lounge Bar', 'Private Gym', 'Infinity Pool', 'In-room Floating Breakfast'],
    rooms: [
      { type: 'Junior Caldera suite', description: 'White volcanic cave facade, private heated plunge pool, king bedding, panoramic sunset view.', price: 620, capacity: 2 },
      { type: 'The Grace Villa Premium', description: 'Ultra-exclusive 400 sqm villa, private gym, private chef, grand terrace, full private spa.', price: 1400, capacity: 4 }
    ]
  },
  {
    id: 'hotel-3',
    name: 'The Ritz-Carlton Kyoto',
    location: 'Kyoto, Japan',
    pricePerNight: 510,
    rating: 4.88,
    description: 'Luxury modern Ryokan sanctuary built right along the historic shores of the tranquil Kamogawa river, offering sublime cultural classes.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
    amenities: ['Kamogawa River Frontage', 'Zen Rock Garden', 'Subterranean Heated Pool', 'Kyoto Sake Tasting Lounge', 'Yukata Wardrobe'],
    rooms: [
      { type: 'Deluxe Kamogawa View Room', description: 'Expansive river window, cypress soaking bath, traditional tatami mat sitting alcove.', price: 510, capacity: 2 },
      { type: 'Garden Terrace Ryokan Suite', description: 'Private master suite, tatami mats, outdoor traditional dry rock private garden.', price: 950, capacity: 3 }
    ]
  },
  {
    id: 'hotel-4',
    name: 'The Chedi Andermatt',
    location: 'Swiss Alps, Switzerland',
    pricePerNight: 720,
    rating: 4.94,
    description: 'An elegant award-winning alpine chalet that blends traditional Swiss rustic comfort with sleek contemporary Asian design elements.',
    image: 'https://images.unsplash.com/photo-1518733057074-95e5ee1c55be?auto=format&fit=crop&q=80&w=600',
    amenities: ['Gigantic Thermal Glass Pools', 'Alpine Cigar Bar', 'Wine Cave cellar', 'Ski Butler service', 'Michelin Japanese Cuisine'],
    rooms: [
      { type: 'Alpine Chic Double Room', description: 'Grand stone fireplace, private balcony overlooking the village, luxury down-fill bedding.', price: 720, capacity: 2 },
      { type: 'The Furka Suite Luxury', description: 'Extravagant wood timber loft, private indoor thermal sauna, complete glass conservatory views.', price: 1600, capacity: 4 }
    ]
  }
];

export const AIRLINE_FLIGHTS: Flight[] = [
  {
    id: 'fl-1',
    airline: 'Qatar Airways',
    logo: 'QA',
    from: 'Mumbai (BOM)',
    to: 'Milan Malpensa (MXP)',
    departure: '04:15 AM (BOM) - 13:40 PM (MXP)',
    duration: '11h 55m (1 stop DOH)',
    price: 880,
    class: 'Business Class (Qsuite)',
    rating: 4.9
  },
  {
    id: 'fl-2',
    airline: 'Emirates',
    logo: 'EK',
    from: 'Delhi (DEL)',
    to: 'Santorini (JTR)',
    departure: '10:30 AM (DEL) - 19:15 PM (JTR)',
    duration: '10h 45m (1 stop DXB)',
    price: 640,
    class: 'Premium Economy',
    rating: 4.8
  },
  {
    id: 'fl-3',
    airline: 'All Nippon Airways (ANA)',
    logo: 'NH',
    from: 'San Francisco (SFO)',
    to: 'Kyoto (ITM)',
    departure: '11:50 AM (SFO) - 15:10 PM (+1d ITM)',
    duration: '11h 20m (Direct to Tokyo + Train)',
    price: 950,
    class: 'Premium Economy',
    rating: 4.85
  },
  {
    id: 'fl-4',
    airline: 'Swiss International Air Lines',
    logo: 'LX',
    from: 'London Heathrow (LHR)',
    to: 'Zurich Airport (ZRH)',
    departure: '08:40 AM (LHR) - 11:20 AM (ZRH)',
    duration: '1h 40m (Direct)',
    price: 320,
    class: 'Business Class',
    rating: 4.7
  }
];

export const TOUR_PACKAGES = [
  {
    id: 'pkg-1',
    title: 'Ultimate Italian Riviera Luxury Romance',
    destination: 'Amalfi Coast, Italy',
    days: 7,
    nights: 6,
    price: 3800,
    rating: 4.96,
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=600',
    description: 'An elite bespoke couples escape guiding you from cliffside dining, private Riva yacht charters to sunset cruises over Sorrento and Ravello pools.',
    itinerarySummary: 'Day 1: Private Airport Transfer & Belmond check-in. Day 2: Positano coastal hike. Day 3: Elite Capri Yacht cruise. Day 4: Cooking Masterclass. Day 5: Ravello Gardens Walk & Amphitheatre Symphony. Day 6: Sunset wine cellar pairings. Day 7: Private Departure.'
  },
  {
    id: 'pkg-2',
    title: 'Historic Japan Cultural Ryokan Journey',
    destination: 'Kyoto, Japan',
    days: 6,
    nights: 5,
    price: 2450,
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
    description: 'Immerse into timeless historic Japan with personal zen garden scholars, private kimono designers, traditional tea ceremonies, and premium kobe tasting menus.',
    itinerarySummary: 'Day 1: Ritz-Carlton arrival & sake introduction. Day 2: Bamboo forest sunrise tour. Day 3: Private temple meditation. Day 4: Gion geisha historic walking. Day 5: Masterclass sushi preparation. Day 6: Departure & green tea ceremony.'
  },
  {
    id: 'pkg-3',
    title: 'Alpine Summit Skiing & Glacier Lodge',
    destination: 'Swiss Alps, Switzerland',
    days: 5,
    nights: 4,
    price: 3100,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
    description: 'An ultimate physical and physical winter adventure with professional mountain ski coaches, Glacier Express luxury cabin, open-air hot spring spa.',
    itinerarySummary: 'Day 1: Helicopter transit to Zermatt village. Day 2: Managed heli-ski run. Day 3: Glacier train dining. Day 4: Thermal thermal spas & massage. Day 5: Scenic departure.'
  }
];

export const CURATED_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'Secret Seaside Estates of the Amalfi Coast',
    slug: 'secret-seaside-estates-amalfi',
    excerpt: 'Dodge the generic tourist crowd with our comprehensive guide to secluded rocky beaches, private cliffside limoncello orchards, and hidden romantic villas.',
    content: 'The Amalfi Coast is one of the most beloved coastal lines in Western Europe, yet finding an intimate spot can feel almost challenging during mid-summer. But if you walk just 40 steps below the historic highway past our favorite orange groves, you will find Fiordo di Furore—a high gorge hosting a microscopic fishing village where vertical waters lap quietly away. In this guide, we reveal five secluded estates that arrange private yacht pick-ups and offer complete organic lemon salad dinners from cliff greenhouses...',
    author: 'Seraphina Vance',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600',
    category: 'Luxury Travel',
    tags: ['Amalfi', 'Italy', 'Romantic', 'Hidden Gems'],
    readTime: '6 min read',
    date: 'May 18, 2026',
    comments: [
      { id: 'c1', author: 'Liam Kingsley', text: 'Fiordo di Furore is indeed incredible! The morning light coming through the high bridge is a photographers paradise.', date: 'May 19, 2026' },
      { id: 'c2', author: 'Elena Moretti', text: 'We used this lemon groove advice on our wedding anniversary - absolutely magical. Thank you!', date: 'May 21, 2026' }
    ]
  },
  {
    id: 'blog-2',
    title: 'The Ultimate Guide to Kyoto Temple Etiquette',
    slug: 'kyoto-temple-etiquette-ryokan',
    excerpt: 'A delicate curation on navigating ancient Shinto shrines, historic bamboo paths, and tasting exquisite multi-course Kaiseki cuisine with pure respect.',
    content: 'When entering the wooden temples of Kyoto, you are stepping back into thousands of years of tranquil contemplation. Take off your premium shoes and step cleanly onto the tatami mats, sensing the quiet cypress architecture. While millions snap photos of the famous orange torii arches, if you arrive at Fushimi Inari by 5:30 AM, you will hear nothing but the wind rustling through the bamboo forest leaves...',
    author: 'Hiroshi Sato',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
    category: 'Cultural Guides',
    tags: ['Kyoto', 'Japan', 'Philosophy', 'Temples'],
    readTime: '8 min read',
    date: 'May 10, 2026',
    comments: [
      { id: 'c3', author: 'Chloe Laurent', text: 'Arriving at Fushimi Inari at 5:30 AM changed my entire Kyoto trip. No crowd, absolute silence, very mystical.', date: 'May 12, 2026' }
    ]
  },
  {
    id: 'blog-3',
    title: 'A Beginners Budget Checklist for Swiss Hikes',
    slug: 'swiss-alps-budget-scenic-hike',
    excerpt: 'Enjoy the world-class peaks without breaking your finances. Travel secrets, free Alpine train hacks, and cozy family chalets detailed.',
    content: 'Switzerland is famous for premium pricing, but the raw grandeur of the snow-clad peaks is entirely free. By utilizing regional transit cards and local farmers markets for organic artisanal cheese and baguettes, you can explore Zermatt and Lauterbrunnen trails on less than $40 a day...',
    author: 'Beat Keller',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600',
    category: 'Adventure',
    tags: ['Switzerland', 'Swiss Alps', 'Hiking', 'Budget Hacks'],
    readTime: '5 min read',
    date: 'May 02, 2026',
    comments: []
  }
];
