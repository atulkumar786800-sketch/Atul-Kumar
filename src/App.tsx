/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Trip, Destination } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AIPositioner from './components/AIPositioner';
import BookingSystem from './components/BookingSystem';
import BlogSystem from './components/BlogSystem';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import { POPULAR_DESTINATIONS } from './data';
import { Star, ShieldCheck, Mail, Sparkles, MapPin, Milestone, SunSnow, Send, CheckCircle2, TicketCheck, MessageSquarePlus } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeBookingCategory, setActiveBookingCategory] = useState<'hotel' | 'flight' | 'pkg'>('hotel');

  // Filter category on home
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<string>('all');

  // Auth Overlay state
  const [authOverlay, setAuthOverlay] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({ isOpen: false, mode: 'login' });
  const [authEmail, setAuthEmail] = useState('atulkumar786800@gmail.com');
  const [authName, setAuthName] = useState('Atul Kumar');
  const [authPassword, setAuthPassword] = useState('••••••••');
  const [authLoading, setAuthLoading] = useState(false);

  // Newsletter email state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSigned, setNewsletterSigned] = useState(false);

  // Persist session locally to prevent flickering on browser refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('travelai_token');
    const savedUser = localStorage.getItem('travelai_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Auto-populate default mock Atul Kumar session for a fully cohesive preview experience!
      const defaultUser: User = {
        id: 'user-default',
        name: 'Atul Kumar',
        email: 'atulkumar786800@gmail.com',
        role: 'user',
        rewardsPoints: 450,
        referralCode: 'TRAVELAI-ATUL99'
      };
      const defaultToken = 'mock-jwt-token-user-default';
      setCurrentUser(defaultUser);
      setToken(defaultToken);
      localStorage.setItem('travelai_token', defaultToken);
      localStorage.setItem('travelai_user', JSON.stringify(defaultUser));
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('travelai_token');
    localStorage.removeItem('travelai_user');
    setActiveTab('home');
  };

  const executeAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const endpoints = authOverlay.mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const payload = authOverlay.mode === 'register' ? { name: authName, email: authEmail } : { email: authEmail };

    try {
      const response = await fetch(endpoints, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setToken(data.token);
        localStorage.setItem('travelai_token', data.token);
        localStorage.setItem('travelai_user', JSON.stringify(data.user));
        setAuthOverlay({ isOpen: false, mode: 'login' });
      } else {
        const error = await response.json();
        alert(error.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveTrip = async (trip: Trip) => {
    if (!token) return;
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trip)
      });
      if (response.ok) {
        await response.json();
        const updatedUser = { ...currentUser!, rewardsPoints: currentUser!.rewardsPoints + 150 };
        setCurrentUser(updatedUser);
        localStorage.setItem('travelai_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToBooking = (category: 'hotel' | 'flight' | 'pkg') => {
    setActiveBookingCategory(category);
    setActiveTab('bookings');
  };

  const filteredDestinations = POPULAR_DESTINATIONS.filter(
    d => selectedHomeCategory === 'all' || d.category === selectedHomeCategory
  );

  return (
    <div className="mesh-gradient min-h-screen flex flex-col font-sans relative text-slate-100 selection:bg-sky-500 selection:text-white">
      
      {/* 1. Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthOverlay({ isOpen: true, mode: 'login' })}
      />

      {/* 2. Page Content Renderers */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in pb-16">
            
            {/* Hero Cover */}
            <Hero
              onStartPlanning={() => setActiveTab('ai-planner')}
              onFilterCategory={(cat) => {
                setSelectedHomeCategory(cat);
                const el = document.getElementById('destinations-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Popular Discover Section */}
            <section id="destinations-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between border-b border-white/5 pb-5 mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-display">
                    <Milestone className="w-6 h-6 text-indigo-400" /> Discover Popular Sanctuaries
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Pre-vetted, exceptionally highly rated luxury destinations catalogued around the globe.
                  </p>
                </div>

                {/* Local filter tabs inside home */}
                <div className="flex items-center space-x-1.5 p-1 glass-effect rounded-xl overflow-x-auto max-w-full">
                  {['all', 'luxury', 'beaches', 'cultural', 'mountains'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedHomeCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition cursor-pointer ${
                        selectedHomeCategory === cat ? 'bg-white text-slate-950 shadow-md active-glow font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destinations Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredDestinations.map(d => (
                  <div
                    key={d.id}
                    className="glass-card rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-52 relative overflow-hidden">
                        <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" />
                        <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#020617]/50 backdrop-blur border border-white/10 shadow rounded-lg flex items-center text-xs font-semibold text-white space-x-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{d.rating}</span>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-sky-400 font-mono">
                          <span className="capitalize">{d.category} Category</span>
                          <span>Expected ${d.averageCost} Spend</span>
                        </div>
                        <h3 className="text-lg font-bold text-white font-display">{d.name}, {d.country}</h3>
                        <p className="text-xs text-slate-355 text-slate-300 leading-relaxed font-normal">{d.description}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 gap-2">
                      <span className="flex items-center gap-1"><SunSnow className="w-3.5 h-3.5 text-slate-400" /> Best: {d.bestTime}</span>
                      <button
                        onClick={() => {
                          setActiveTab('ai-planner');
                          // Inject location name indirectly
                          const el = document.querySelector('input[placeholder*="Kyoto"]') as HTMLInputElement;
                          if (el) {
                            el.value = `${d.name}, ${d.country}`;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                          }
                        }}
                        className="p-2 border border-white/10 hover:border-white/30 rounded-xl transition cursor-pointer text-[10px] text-white hover:bg-white/5 font-semibold uppercase"
                      >
                        Plan AI Itinerary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Assistant Promo showcase banner */}
            <section className="glass-effect border-y border-white/10 py-16 text-white relative overflow-hidden rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div className="inline-flex items-center space-x-1.5 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> Live Grounded Conversational Support
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">Need smart instant answers? Meet TravelAI Bot</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                    Query available flight tickets, compare hotel star ratings, fetch local weather predictions, or design spontaneous 3-day plans in seconds using our integrated chat dock in the bottom corner!
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono text-indigo-400">
                    <span className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">“Cheap international trips from India”</span>
                    <span className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">“3-day Goa Itinerary”</span>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center">
                  <div className="p-6 glass-card rounded-3xl text-center space-y-4 shadow-xl w-full max-w-xs">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
                      <MessageSquarePlus className="w-6 h-6 shrink-0 text-sky-400 animate-bounce" />
                    </div>
                    <span className="block text-xs font-bold text-white uppercase tracking-wider">Launch Chat Dock Widget</span>
                    <button
                      onClick={() => {
                        const botBtn = document.querySelector('button.fixed.bottom-6') as HTMLButtonElement;
                        botBtn?.click();
                      }}
                      className="inline-flex items-center justify-center w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-white hover:bg-sky-400 hover:text-white transition duration-200 cursor-pointer shadow active-glow"
                    >
                      Speak with AI Chef
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-sky-400 font-bold">Trusted by Thousands</span>
                <h4 className="text-xl font-bold text-white tracking-tight font-display">Globes finest explorers recount their journeys</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Sarah Vance', trip: 'Amalfi Odyssey', text: 'TravelAI changed how we vacation. The Positano lunch suggests were michel-tier, and the Stripe integration was flawless!' },
                  { name: 'Hiroshi Sato', trip: 'Kyoto Temple Path', text: 'I was skeptical of AI generated plans, but the 5:30 AM sunrise suggestion for Fushimi Inari was completely spiritual.' },
                  { name: 'Chloe Laurent', trip: 'Zermatt Alps Ski', text: 'The packing recommendation list matched the freezing weather perfectly. Downloading the itinerary as PDF made transit exceptionally simple!' }
                ].map((test, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl shadow-sm space-y-3">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">“{test.text}”</p>
                    <div className="text-xs text-slate-400 font-mono">
                      — {test.name}, <span className="text-sky-400">{test.trip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Newsletter form */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-10">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-2xl mx-auto shadow-md">
                <Mail className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-display">Subscribe for custom AI Travel Deals</h4>
                <p className="text-slate-400 text-xs sm:text-sm">Get secret loyalty discount codes and custom seasonal guide books directly to your inbox.</p>
              </div>

              {newsletterSigned ? (
                <div className="inline-flex items-center space-x-2.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-3.5 px-6 rounded-2xl text-xs font-semibold">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 animate-bounce" />
                  <span>Success! Check your inbox for your 30% Promo Coupon: TRAVELAI30</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) setNewsletterSigned(true);
                  }}
                  className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Wanderer email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400 transition"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-white text-slate-900 border border-transparent hover:bg-sky-400 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer active-glow"
                  >
                    <span>Subscribe</span>
                  </button>
                </form>
              )}
            </section>

          </div>
        )}

        {/* AI Planner Page */}
        {activeTab === 'ai-planner' && (
          <AIPositioner
            onSaveTrip={handleSaveTrip}
            currentUser={currentUser}
            onOpenAuth={() => setAuthOverlay({ isOpen: true, mode: 'login' })}
          />
        )}

        {/* Hotels, Flights, Packages lists tab */}
        {activeTab === 'bookings' && (
          <BookingSystem
            currentUser={currentUser}
            onOpenAuth={() => setAuthOverlay({ isOpen: true, mode: 'login' })}
            token={token}
            activeBookingCategory={activeBookingCategory}
          />
        )}

        {/* Curated Blog guides sitemap content articles */}
        {activeTab === 'blogs' && (
          <BlogSystem />
        )}

        {/* Hub dashboard control panels */}
        {activeTab === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            onLogout={handleLogout}
            token={token}
            onStartBooking={(cat) => navigateToBooking(cat)}
          />
        )}

        {/* Hub dashboard control panels (Admin Tab direct) */}
        {activeTab === 'admin' && (
          <Dashboard
            currentUser={currentUser}
            onLogout={handleLogout}
            token={token}
            onStartBooking={(cat) => navigateToBooking(cat)}
            activeDefaultTab="admin"
          />
        )}
      </main>

      {/* 3. Global Floating ChatBot panel overlay */}
      <ChatBot />

      {/* 4. Interactive Footer */}
      <footer className="glass-effect shadow-xl border-t border-white/10 py-12 mt-16 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-normal">
          <div className="md:col-span-4 space-y-4 pr-6">
            <span className="text-sm font-bold text-white tracking-widest uppercase font-display">TravelAI Platform</span>
            <p className="leading-relaxed text-slate-300">
              Timeless bespoke itineraries optimized dynamically in standard classes. Google Search grounded, secure Stripe payment tunnels, and 100% cloud-native integrity sitemaped on modern full stacks.
            </p>
            <span className="block text-[10px] font-mono uppercase text-sky-450 text-sky-400 font-bold">© 2026 TRAVELAI CONCIERGE S.A.S.</span>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="text-xs uppercase font-mono text-white font-bold block">Reserve Options</span>
            <ul className="space-y-1.5 font-medium transition-all">
              <li className="hover:text-white cursor-pointer" onClick={() => navigateToBooking('hotel')}>Boutique Ocean Hotels</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigateToBooking('flight')}>Premium Economy Flights</li>
              <li className="hover:text-white cursor-pointer" onClick={() => navigateToBooking('pkg')}>Curated Bespoke Packages</li>
              <li className="hover:text-white cursor-pointer" onClick={() => setActiveTab('blogs')}>Sitemapped Guide Blogs</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="text-xs uppercase font-mono text-white font-bold block">Developer Credentials</span>
            <ul className="space-y-1.5 font-medium font-mono text-[10px]">
              <li>API Grounding: Google Search Tool</li>
              <li>LLM Processor: Gemini 3.5 Flash</li>
              <li>Secure Gateway: Stripe Elements API</li>
              <li>Node Frame: Express CJS Core Engine</li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3 text-center md:text-right flex flex-col justify-end">
            <span className="block font-mono text-[10px] text-slate-405">Development Preview Online</span>
            <div className="inline-flex items-center justify-center md:justify-end text-emerald-400 space-x-1">
              <ShieldCheck className="w-4.5 h-4.5" />
              <span className="font-bold uppercase tracking-tight">Active Ingress</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ----------------- SECURE JWT AUTH OVERLAY PANEL ----------------- */}
      {authOverlay.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#020617]/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-effect rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-5 border border-white/10 animate-scale-up text-white">
            
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-550 flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-500/10">
                <Sparkles className="w-5 h-5 animate-spin-slow" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight font-display">
                {authOverlay.mode === 'login' ? 'Welcome Back!' : 'Create Luxury Account'}
              </h3>
              <p className="text-slate-400 text-[11px]">
                Authentication ledger registers, with standard user parameters setup.
              </p>
            </div>

            <form onSubmit={executeAuth} className="space-y-4">
              
              {authOverlay.mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wide uppercase text-slate-400 font-bold">Wanderer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Atul Kumar"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wide uppercase text-slate-400 font-bold">Email registered</label>
                <input
                  type="email"
                  required
                  placeholder="atulkumar786800@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wide uppercase text-slate-400 font-bold">Secure Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-white hover:bg-sky-450 hover:text-white text-slate-950 rounded-xl text-xs font-bold transition duration-250 tracking-tight shadow-md cursor-pointer active-glow"
              >
                {authLoading ? 'Verifying session token...' : authOverlay.mode === 'login' ? 'Confirm Sign In' : 'Confirm Registration'}
              </button>

            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setAuthOverlay(prev => ({ ...prev, mode: prev.mode === 'login' ? 'register' : 'login' }))}
                className="text-[11px] text-sky-400 hover:underline font-semibold font-sans"
              >
                {authOverlay.mode === 'login' ? "Don't have a login? Register now" : 'Already registered? Sign In'}
              </button>
            </div>

            <button
              onClick={() => setAuthOverlay({ isOpen: false, mode: 'login' })}
              className="w-full py-2 border border-white/10 hover:bg-white/5 text-slate-300 rounded-xl text-[10px] font-bold text-center transition cursor-pointer"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
