/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { POPULAR_DESTINATIONS, BOUTIQUE_HOTELS, AIRLINE_FLIGHTS, TOUR_PACKAGES, CURATED_BLOGS } from './src/data.js';

// Setup Mock In-Memory Database to ensure 100% out-of-the-box functionality without external setup
let USERS = [
  {
    id: 'user-default',
    name: 'Atul Kumar',
    email: 'atulkumar786800@gmail.com',
    role: 'user',
    rewardsPoints: 450,
    referralCode: 'TRAVELAI-ATUL99'
  },
  {
    id: 'user-admin',
    name: 'TravelAI Architect',
    email: 'admin@travelai.com',
    role: 'admin',
    rewardsPoints: 1200,
    referralCode: 'TRAVELAI-VIP'
  }
];

let TRIPS: any[] = [
  {
    id: 'trip-1',
    userId: 'user-default',
    destination: 'Amalfi Coast, Italy',
    days: 3,
    budget: 'Luxury',
    budgetBreakdown: { accommodations: 1800, activities: 750, food: 450, transportation: 400, savings: 100 },
    travelers: 2,
    type: 'Honeymoon',
    activities: ['Sightseeing', 'Luxury Yachting', 'Fine Dining'],
    accommodationPreference: 'Boutique Hotel',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Positano & Cliff Dining',
        activities: [
          { time: '02:00 PM', title: 'Belmond Hotel check-in', description: 'Arrive via private luxury transfer. Welcome champagne with ocean views.', cost: 850 },
          { time: '06:30 PM', title: 'Sunset cliffs tour', description: 'Explore positanos vertical pastel paths and cobblestone lanes.', cost: 50 },
          { time: '08:00 PM', title: 'Al Mare terrace dining', description: 'Traditional lemon seafood pastas overlooking Salerno Bay.', cost: 180 }
        ]
      },
      {
        day: 2,
        title: 'Capri Yacht Charter Excursion',
        activities: [
          { time: '09:00 AM', title: 'Private Riva tour to Capri', description: 'Sail to blue, emerald, and white volcanic seaside caves.', cost: 450 },
          { time: '01:00 PM', title: 'Lunch at Da Paolino restaurant', description: 'Dine in Sorrento inside a massive open-air lemon orchard.', cost: 120 },
          { time: '05:00 PM', title: 'Limonaia spa session', description: 'Luxury bio-detox therapy with essential citrus oils.', cost: 150 }
        ]
      },
      {
        day: 3,
        title: 'Historic Ravello Gardens Walk',
        activities: [
          { time: '10:00 AM', title: 'Villa Rufolo garden walk', description: 'Wander medieval terraces suspended between sky and sea.', cost: 30 },
          { time: '02:00 PM', title: 'Sartorial shopping Positano', description: 'Bespoke hand-crafted custom linen clothing creation.', cost: 200 }
        ]
      }
    ],
    weatherInfo: { temp: '24°C', conditions: 'Clear Sunshine', recommendation: 'Linen blouses, fedora hats, and evening wraps.' },
    totalSpent: 2030,
    createdAt: new Date('2026-05-20').toISOString()
  }
];

let BOOKINGS: any[] = [
  {
    id: 'book-1',
    userId: 'user-default',
    type: 'hotel',
    itemDetails: {
      name: 'Belmond Hotel Caruso Deluxe Room',
      subDetails: 'Amalfi Coast, Italy • 2 Guests • 3 Nights',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300',
      price: 850
    },
    totalPrice: 2550,
    status: 'confirmed',
    bookingDate: '2026-05-21',
    travelDate: '2026-06-15'
  }
];

let BLOGS = [...CURATED_BLOGS];

// Initialize Express
const app = express();
app.use(express.json());

const PORT = 3000;

// Set up Gemini client lazily to prevent crashing on missing key, with required 'aistudio-build' User-Agent attribution
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// ----------------------------------------------------
// AUTH ENDPOINTS (JWT Simulation for Local Flow)
// ----------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  const existing = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: 'user-' + Date.now(),
    name,
    email,
    role: 'user' as const,
    rewardsPoints: 100,
    referralCode: 'TRAVELAI-' + name.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 100)
  };
  USERS.push(newUser);

  res.status(201).json({
    user: newUser,
    token: 'mock-jwt-token-' + newUser.id
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email credentials' });
  }

  res.json({
    user,
    token: 'mock-jwt-token-' + user.id
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized credentials' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.replace('mock-jwt-token-', '');
  const user = USERS.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'Session expired' });
  }

  res.json({ user });
});

// ----------------------------------------------------
// BLOGS, HOTELS, FLIGHTS, DESTINATIONS ENDPOINTS
// ----------------------------------------------------
app.get('/api/destinations', (req, res) => {
  res.json(POPULAR_DESTINATIONS);
});

app.get('/api/hotels', (req, res) => {
  res.json(BOUTIQUE_HOTELS);
});

app.get('/api/flights', (req, res) => {
  res.json(AIRLINE_FLIGHTS);
});

app.get('/api/packages', (req, res) => {
  res.json(TOUR_PACKAGES);
});

app.get('/api/blogs', (req, res) => {
  res.json(BLOGS);
});

app.post('/api/blogs/:id/comment', (req, res) => {
  const { author, text } = req.body;
  const blog = BLOGS.find(b => b.id === req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  const newComment = {
    id: 'comment-' + Date.now(),
    author: author || 'Anonymous Explorer',
    text,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
  blog.comments.push(newComment);
  res.status(201).json(blog);
});

// ----------------------------------------------------
// BUDGET & TRIPS ENDPOINTS
// ----------------------------------------------------
app.get('/api/trips', (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = 'user-default';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    userId = authHeader.split(' ')[1].replace('mock-jwt-token-', '');
  }

  const userTrips = TRIPS.filter(t => t.userId === userId);
  res.json(userTrips);
});

app.post('/api/trips', (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = 'user-default';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    userId = authHeader.split(' ')[1].replace('mock-jwt-token-', '');
  }

  const newTrip = {
    ...req.body,
    id: 'trip-' + Date.now(),
    userId,
    createdAt: new Date().toISOString()
  };
  TRIPS.push(newTrip);

  // Credit rewards points
  const user = USERS.find(u => u.id === userId);
  if (user) {
    user.rewardsPoints += 150;
  }

  res.status(201).json(newTrip);
});

app.delete('/api/trips/:id', (req, res) => {
  TRIPS = TRIPS.filter(t => t.id !== req.params.id);
  res.json({ success: true, message: 'Trip itinerary deleted successfully' });
});

// ----------------------------------------------------
// BOOKINGS MANAGEMENT ENDPOINTS
// ----------------------------------------------------
app.get('/api/bookings', (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = 'user-default';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    userId = authHeader.split(' ')[1].replace('mock-jwt-token-', '');
  }

  const userBookings = BOOKINGS.filter(b => b.userId === userId);
  res.json(userBookings);
});

app.post('/api/bookings', (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = 'user-default';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    userId = authHeader.split(' ')[1].replace('mock-jwt-token-', '');
  }

  const { type, itemDetails, totalPrice, travelDate } = req.body;
  if (!type || !itemDetails || !totalPrice) {
    return res.status(400).json({ error: 'Incomplete booking information' });
  }

  const newBooking = {
    id: 'book-' + Date.now(),
    userId,
    type,
    itemDetails,
    totalPrice,
    status: 'confirmed' as const,
    bookingDate: new Date().toISOString().split('T')[0],
    travelDate: travelDate || new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0]
  };
  BOOKINGS.push(newBooking);

  // Credit rewards points
  const user = USERS.find(u => u.id === userId);
  if (user) {
    user.rewardsPoints += Math.floor(totalPrice * 0.1); // 10% cash back in points!
  }

  res.status(201).json(newUserBookingStats(userId, newBooking));
});

function newUserBookingStats(userId: string, addedBooking: any) {
  return {
    booking: addedBooking,
    rewardsPoints: USERS.find(u => u.id === userId)?.rewardsPoints || 0
  };
}

app.delete('/api/bookings/:id', (req, res) => {
  const bookingIndex = BOOKINGS.findIndex(b => b.id === req.params.id);
  if (bookingIndex !== -1) {
    BOOKINGS[bookingIndex].status = 'cancelled';
    res.json({ success: true, booking: BOOKINGS[bookingIndex] });
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// ----------------------------------------------------
// PAYMENT (Simulate Stripe Secure Sessions)
// ----------------------------------------------------
app.post('/api/payment/session', (req, res) => {
  const { amount, itemName } = req.body;
  if (!amount) {
    return res.status(400).json({ error: 'Payment amount is required' });
  }

  // Return simulated Stripe checkout parameters
  res.json({
    id: 'cs_test_' + Math.random().toString(36).substr(2, 9),
    url: '#stripe-checkout-overlay',
    clientSecret: 'seti_test_' + Math.random().toString(36).substr(2, 12),
    amount,
    itemName
  });
});

// ----------------------------------------------------
// ADMIN ANALYTICS ENDPOINT
// ----------------------------------------------------
app.get('/api/admin/analytics', (req, res) => {
  // Simple validation
  const totalRevenue = BOOKINGS.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0);
  const activeBookings = BOOKINGS.filter(b => b.status === 'confirmed').length;
  const userCount = USERS.length;
  const tripCount = TRIPS.length;

  // Let's create an elegant revenue distribution index
  const monthlyRevenue = [
    { month: 'Jan', revenue: Math.floor(totalRevenue * 0.15) },
    { month: 'Feb', revenue: Math.floor(totalRevenue * 0.2) },
    { month: 'Mar', revenue: Math.floor(totalRevenue * 0.25) },
    { month: 'Apr', revenue: Math.floor(totalRevenue * 0.15) },
    { month: 'May', revenue: totalRevenue }
  ];

  res.json({
    metrics: {
      totalRevenue,
      activeBookings,
      totalUsers: userCount,
      totalItineraries: tripCount,
      avgBookingValue: activeBookings > 0 ? Math.round(totalRevenue / activeBookings) : 0
    },
    monthlyRevenue,
    bookings: BOOKINGS,
    users: USERS.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, rewardsPoints: u.rewardsPoints })),
    destinationsCount: POPULAR_DESTINATIONS.length
  });
});

// Helper for live fallback forecast
const getCuratedWeatherForecast = (dest: string) => {
  const d = dest.toLowerCase();
  if (d.includes('goa')) {
    return { temp: '31°C', conditions: 'Humid Sunny shores', recommendation: 'Flip flops, sunscreen lotion, and organic open cotton shirts.' };
  } else if (d.includes('swiss') || d.includes('alp') || d.includes('zermatt')) {
    return { temp: '7°C', conditions: 'Chilly powder snow peaks', recommendation: 'Thermal ski jackets, mountain gloves, and wool-lined boots.' };
  } else if (d.includes('kyoto') || d.includes('tokyo') || d.includes('japan')) {
    return { temp: '19°C', conditions: 'Windy blossom weather', recommendation: 'Lightweight trench jackets, comfortable sneakers, and a camera.' };
  } else if (d.includes('amalfi') || d.includes('italy') || d.includes('rome')) {
    return { temp: '24°C', conditions: 'Breezy coastal blue sky', recommendation: 'Sunglasses, premium straw hat, and light linen trousers.' };
  } else if (d.includes('dubai')) {
    return { temp: '36°C', conditions: 'Desert hot sun', recommendation: 'Breezy light clothing, high-grade UPF lotion, sunglasses.' };
  }
  return { temp: '22°C', conditions: 'Pleasant clear sky', recommendation: 'Comfortable casual layering and sensible walking shoes.' };
};

// ----------------------------------------------------
// AI TRIP ITINERARY GENERATOR (Gemini 3.5 Flash)
// ----------------------------------------------------
app.post('/api/trips/generate', async (req, res) => {
  const {
    destination,
    budget,
    travelers,
    days,
    type,
    activities,
    accommodationPreference,
    transportationPreference
  } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: 'Destination and Days are required parameters.' });
  }

  const aiClient = getGeminiClient();

  if (!aiClient) {
    // Elegant Resilient Mock Fallback so the app works beautifully offline or if Gemini key is loading
    const w = getCuratedWeatherForecast(destination);
    const costFactor = budget === 'Backpacker' ? 80 : budget === 'Moderate' ? 180 : 450;
    const estCost = Math.round(costFactor * days * travelers * 0.9);

    const generatedItinerary = Array.from({ length: Math.min(days, 7) }, (_, idx) => {
      const dNum = idx + 1;
      return {
        day: dNum,
        title: `Day ${dNum}: Discovering the Beauty of ${destination}`,
        activities: [
          {
            time: '09:00 AM',
            title: `Explorer tour around ${destination}`,
            secondTitle: `Attraction visit`,
            description: `Bespoke curated trekking through historically prime high-points of ${destination} matching the ${type} style.`,
            cost: Math.round(costFactor * 0.1),
            location: `${destination} City Center`
          },
          {
            time: '01:00 PM',
            title: 'Artisanal local dining session',
            description: `Dine under locally renowned taverns, tasting authentic organic regional specialties matching ${budget} budget.`,
            cost: Math.round(costFactor * 0.15)
          },
          {
            time: '06:00 PM',
            title: 'Scenic terrace sunset experience',
            description: `A peaceful view of sunset in ${destination} overlooking key sights, tailored for your interest in ${activities?.slice(0,2).join(', ') || 'sightseeing'}.`,
            cost: Math.round(costFactor * 0.05),
            location: `${destination} Sunset Point`
          }
        ]
      };
    });

    const fallbackTrip = {
      destination,
      days: parseInt(days),
      budget,
      budgetBreakdown: {
        accommodations: Math.round(estCost * 0.5),
        activities: Math.round(estCost * 0.25),
        food: Math.round(estCost * 0.15),
        transportation: Math.round(estCost * 0.08),
        savings: Math.round(estCost * 0.02)
      },
      travelers: parseInt(travelers) || 1,
      type,
      itinerary: generatedItinerary,
      weatherInfo: w,
      totalSpent: estCost
    };

    return res.json(fallbackTrip);
  }

  try {
    const prompt = `Generate a detailed luxury-curated daily travel planner for:
    Destination: ${destination}
    Duration: ${days} days
    Budget standard: ${budget}
    Travelers count: ${travelers}
    Traveler group dynamic: ${type}
    Interests & custom preferences: ${activities?.join(', ') || 'Exploration, sightseeing, food'}
    Preferred Stay style: ${accommodationPreference}
    Preferred transit style: ${transportationPreference}

    Provide the response exactly aligned to the requested JSON schema. Write immersive, highly engaging, premium descriptions. Keep values as numbers with no currency characters. Provide detailed coordinates or landmarks where appropriate.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an elite, Michelin-tier luxury concierge trip designer. You curate itineraries that match the selected travel class, incorporating bespoke suggestions, gourmet meals, elite transportations, or practical local alternatives when dealing with backpackers. Provide a precise JSON object matching the requested schema. Provide realistic costs (numbers only) representing estimated total expenses in USD. Provide realistic temperatures and recommendations too!`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['destination', 'days', 'budgetBreakdown', 'itinerary', 'weatherInfo', 'totalSpent'],
          properties: {
            destination: { type: Type.STRING },
            days: { type: Type.INTEGER },
            budgetBreakdown: {
              type: Type.OBJECT,
              required: ['accommodations', 'activities', 'food', 'transportation', 'savings'],
              properties: {
                accommodations: { type: Type.INTEGER, description: 'Stay costs in USD' },
                activities: { type: Type.INTEGER, description: 'Adventures fees in USD' },
                food: { type: Type.INTEGER, description: 'Dining expenses in USD' },
                transportation: { type: Type.INTEGER, description: 'Transit budget in USD' },
                savings: { type: Type.INTEGER, description: 'Emergency buffer in USD' }
              }
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['day', 'title', 'activities'],
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: 'Main theme for the day' },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ['time', 'title', 'description', 'cost'],
                      properties: {
                        time: { type: Type.STRING, description: 'e.g. 09:00 AM' },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING, description: 'Polished attractive overview of the activity' },
                        cost: { type: Type.INTEGER, description: 'Estimated cost per tourist in USD' },
                        location: { type: Type.STRING, description: 'Specific landmark name or street' }
                      }
                    }
                  }
                }
              }
            },
            weatherInfo: {
              type: Type.OBJECT,
              required: ['temp', 'conditions', 'recommendation'],
              properties: {
                temp: { type: Type.STRING, description: 'Current temperature, e.g. 24°C' },
                conditions: { type: Type.STRING, description: 'Current sky conditions, e.g. Breezy Sunny' },
                recommendation: { type: Type.STRING, description: 'Aesthetic packing advice' }
              }
            },
            totalSpent: { type: Type.INTEGER, description: 'Estimated total aggregate budget of the entire tour in USD' }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini Itinerary Generation failed:', error);
    res.status(500).json({ error: 'AI Trip generation failed. Please try again.', details: error.message });
  }
});

// ----------------------------------------------------
// AI TRAVEL CHATBOT (Gemini 3.5 Flash with Google Search Grounding)
// ----------------------------------------------------
app.post('/api/chatbot', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message parameter is empty' });
  }

  const aiClient = getGeminiClient();

  if (!aiClient) {
    // Fluent Intelligent Fallback when API Key is missing, matches standard travel inquiries
    let reply = `Greeting from TravelAI! I am currently operating on premium local travel intelligence. 

Here are some tailored premium ideas to consider:
1. **Best Honeymoon under $1,200**: Consider **Goa, India** or **Bali, Indonesia**. Goa offers breathtaking sunset walks past centuries-old Portuguese estates and private cruises under $400.
2. **Kyoto 3-Day Highlight**: Spend Day 1 in the classic bamboo trails of Arashiyama, Day 2 walking through 10,000 torii gates at Fushimi Inari at dawn, and Day 3 experiencing a tea ceremony in Gion.
3. **Cheap International Gateway**: Experience **Reykjavik, Iceland** or the historic sights of the Amalfi Coast off-season (October/November) to book boutique villas at 60% discounts.

How can I help you customize your next journey? Feel free to ask about hotels, flights, or budgeting!`;

    const lower = message.toLowerCase();
    if (lower.includes('goa')) {
      reply = `**3-Day Goa, India Bespoke Curated Route**:
- **Day 1**: Arrive at Dabolim Airport. Private sedan to a luxury resort in South Goa. Spend the late afternoon walking on the quiet sands of Varca Beach. Dinner under lantern lights at *The Fisherman's Wharf*.
- **Day 2**: Historic exploration. Visit the dramatic *Basilica of Bom Jesus* in Old Goa, followed by a guided spice plantation walkthrough with traditional Goan lunch. Enjoy a luxury yacht sunset catamaran cruise.
- **Day 3**: Beach kayaking at Palolem beach, shopping for high-end linen and local spices at Margao, and private departure transfer.

Would you like me to add this directly to your travel dashboard as an itinerary?`;
    } else if (lower.includes('dubai')) {
      reply = `**Top Curations for your visit to Dubai, UAE**:
1. **Burj Khalifa Skyline Dining**: Experience ultra-fine gastronomy on level 122 at *At.mosphere*, taking in panoramic cloud-scraped views of the Persian Gulf.
2. **Private Desert Safari**: Cruise absolute massive golden sand dunes in a classic vintage Land Rover, ending with gourmet Emirati charcoal dining in an oasis sanctuary.
3. **Aesthetic Water Canal Walk**: Take a luxury wooden boat tour through the historic creeks to see old souks, smelling exquisite frankincense and local gold displays.

Are you looking for premium class flights or luxury skyscraper suites in Downtown Dubai?`;
    }

    return res.json({ text: reply });
  }

  try {
    // Format conversation history for Gemini chat structure
    const chatConfig = {
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction: `You are 'TravelAI Agent', a premium, courteous, and exceptionally helpful personal luxury tour concierge and travel scholar.
Your responses are formatted in clean, elegant Markdown. You help with:
- Suggesting destinations matching a given budget (e.g. ₹80,000 or $1,000)
- Outlining custom 3-day or weekly travel sequences (e.g. Goa, Kyoto, Amalfi)
- Explaining weather characteristics and optimal times to travel
- Recommending fine dining, local boutique stays, and transit parameters
Speak clearly, with sophisticated travel charm. Highlight attractions with precise landmark names.`,
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding to provide live dynamic search results for flights, weather and places
      }
    };

    const response = await aiClient.models.generateContent({
      model: chatConfig.model,
      contents: message,
      config: chatConfig.config
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls = groundingChunks ? groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Source',
        uri: chunk.web.uri
      })) : undefined;

    res.json({
      text: response.text,
      groundingUrls
    });
  } catch (error: any) {
    console.error('Gemini chatbot error:', error);
    res.status(500).json({ error: 'Chatbot communication failed.', details: error.message });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP / STATIC FILE SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TravelAI Premium full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
