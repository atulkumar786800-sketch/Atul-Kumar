# TravelAI — Premium Full-Stack AI-Powered Travel Planner

TravelAI is a state-of-the-art, production-ready, full-stack travel planner and luxury concierge application designed for modern travelers.

## 🌟 Key Functional Features & Workspaces

1. **AI Travel Planner**:
   - Compiles bespoke, multi-day itineraries on demand using the Google Gemini model.
   - Tailored to customized parameters including length of stay, guest sizing, budget tier (Backpacker, Moderate, Luxury), preferred activities (Wellness Spas, Cultural, Fine Dining), accommodation layout, and transit methods.
   - Automatically provides local weather indexes, packing instructions, and emergency budget safety distributions.
   - Day-by-day staggered summaries can be locked as saved trips or printed out directly as a travel PDF.

2. **Grounded AI Concierge (ChatBot Overlay)**:
   - Floating chat bubble linked in real time to Google Search Grounding.
   - Answers general queries, checks international flight patterns, and suggests local dining.
   - Supports pre-configured guide prompts for rapid execution.

3. **Secure Vacation Booking Hub**:
   - Tab arrays to filter boutique luxury hotels suites, plane tickets, or premium pre-packaged tours.
   - Simulated **Stripe Checkout Overlay** allowing realistic card tokenization and purchase confirmations.
   - Uses the promotion discount code `TRAVELAI30` for a 30% discount.
   - Successfully purchased itineraries are saved to the **My Bookings** ledger where cancellation and refunds are supported.

4. **Odyssey User Dashboard**:
   - Tracking coordinates for loyalty points (credited on each successful Stripe booking).
   - Personal invite code and referral rewards stats.
   - Active spendings budgeting tracker indicating total dollars spent.

5. **Global Operations Admin Console**:
   - Only shown to administrators.
   - Analytical KPI blocks monitoring consolidated revenue, profiles volume, and active itineraries.
   - Interactive monthly sales performance bar graphs.
   - Live user profiles directories and real-time transaction history logs.

---

## 🛠️ Technology Stack & APIs

- **Client App**: React 19, TypeScript, Tailwind 4.0, Lucide icons, Motion layout animations.
- **Microservices Server**: Express.js with tsx in dev; Esbuild bundled `.cjs` in production.
- **Deep Intelligence API**: `@google/genai` TypeScript SDK (utilizing `gemini-2.5-flash`).
- **Database Model**: In-memory schema state trackers with secure fallback adapters.

---

## 🚀 Environment Configurations & Secrets

Please define variables in your secrets panel:
```env
# Required for Generative AI Planner and Live Grounded Support ChatBot
GEMINI_API_KEY="...your_gemini_api_key..."
```

---

## 💡 Quick Start Tips

- **Coupon Code**: Type `TRAVELAI30` in the Stripe checkout voucher field to save **30% off any flight or hotel suite**.
- **Admin Switcher**: Login with email `atulkumar786800@gmail.com` (automatically logged in by default) to unlock the **Admin Switcher** in the top-right header, gaining full access to business metrics and operations tables.
