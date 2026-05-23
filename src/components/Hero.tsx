/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Compass, Star, Anchor, Shield, Snowflake, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartPlanning: () => void;
  onFilterCategory: (category: string) => void;
}

export default function Hero({ onStartPlanning, onFilterCategory }: HeroProps) {
  const categories = [
    { label: 'Beaches', id: 'beaches', icon: Anchor, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Bespoke Luxury', id: 'luxury', icon: Star, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Alpine Sanctuary', id: 'mountains', icon: Snowflake, color: 'bg-sky-50 text-sky-600 border-sky-100' },
    { label: 'Heritage & Culture', id: 'cultural', icon: Compass, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
  ];

  const stats = [
    { value: '45,000+', label: 'Curated Outings' },
    { value: '99.4%', label: 'Joy Rating' },
    { value: '250+', label: 'Elite Operators' },
    { value: '1M+', label: 'AI Plans Rendered' }
  ];

  return (
    <div className="relative overflow-hidden bg-transparent text-white">
      {/* Background Photography Banner with deep glass styling overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600"
          alt="Luxury Tropical Coastline"
          className="w-full h-full object-cover opacity-15 filter saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-[#020617]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Visual Slogan */}
          <div className="col-span-1 lg:col-span-7 space-y-6 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-sky-405 bg-sky-400 animate-pulse"></span>
              <span>Next-Gen Concierge AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-display">
              Craft Your Next{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-450 to-indigo-405 from-sky-400 to-indigo-400">
                Luxury Odyssey
              </span>{' '}
              with Pure Intelligence
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Dodge generic packages. Experience travel optimized dynamically by our leading AI engine around your personal timing, exact budgets, and bespoke stylistic preferences.
            </p>

            {/* Quick Action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onStartPlanning}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold bg-white text-slate-900 hover:bg-sky-400 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-white/5 active-glow"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Launch AI Planner
              </button>
              <button
                onClick={() => onFilterCategory('all')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                Discover Destinations
              </button>
            </div>

            {/* Elegant Brand Accents */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/5">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-xl sm:text-2xl font-bold tracking-tight font-sans text-sky-400">{stat.value}</div>
                  <div className="text-[11px] font-mono tracking-widest text-[#4285F4] uppercase font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Interactive Portal Dashboard Overlay */}
          <div className="col-span-1 lg:col-span-5 glass-effect rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center space-x-2 font-display">
              <Compass className="w-5 h-5 text-sky-450 text-sky-400" />
              <span>Where to escape next?</span>
            </h3>

            {/* Search Input Widget */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Amalfi Coast, Kyoto, Swiss Alps..."
                onClick={onStartPlanning}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/40 border border-white/10 focus:border-sky-400 focus:outline-none text-white text-sm placeholder-slate-500 transition"
              />
            </div>

            <div className="space-y-3">
              <span className="block text-xs font-mono tracking-wider text-sky-400 uppercase font-semibold">
                Or Browse curated categories
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onFilterCategory(cat.id)}
                      className={`flex items-center space-x-2 p-3 text-left rounded-xl border border-white/5 bg-white/5 text-xs font-medium cursor-pointer transition transform hover:-translate-y-0.5 hover:bg-white/10 text-white`}
                    >
                      <div className="p-1.5 rounded-lg bg-white/5">
                        <Icon className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center"><Shield className="w-3 h-3 text-emerald-450 text-emerald-400 mr-1" /> 100% Secure Checkout</span>
              <span>Stripe Elements API</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
