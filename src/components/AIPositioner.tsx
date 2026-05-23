/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Users, DollarSign, MapPin, Compass, ShieldCheck, Heart, Share2, FileDown, SunSnow, Plane, Info, ArrowRight } from 'lucide-react';
import { Trip } from '../types';

interface AIPositionerProps {
  onSaveTrip: (trip: Trip) => void;
  currentUser: any;
  onOpenAuth: () => void;
}

export default function AIPositioner({ onSaveTrip, currentUser, onOpenAuth }: AIPositionerProps) {
  // Input fields state
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('Luxury');
  const [travelType, setTravelType] = useState('Honeymoon');
  const [accommodation, setAccommodation] = useState('Boutique Hotel');
  const [transportation, setTransportation] = useState('Private Chauffeur');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['Fine Dining', 'Sightseeing']);

  // Loading and result states
  const [loading, setLoading] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState<Trip | null>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [itinerarySaved, setItinerarySaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const budgetOptions = ['Backpacker', 'Moderate', 'Luxury'];
  const travelTypes = ['Solo', 'Family', 'Honeymoon', 'Adventure', 'Luxury', 'Backpacking', 'Business'];
  const accommodationOptions = ['Hostel', 'Boutique Hotel', 'Airbnb', '5-Star Resort'];
  const transportationOptions = ['Self Drive', 'Private Chauffeur', 'Luxury Trains', 'Walking / Public Transit'];
  
  const activitiesList = [
    'Sightseeing',
    'Fine Dining',
    'Luxury Yachting',
    'Cultural Workshops',
    'Extreme Hiking',
    'Shopping',
    'Wellness Spas & Massage',
    'Photography'
  ];

  const toggleActivity = (activity: string) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setGeneratedTrip(null);
    setItinerarySaved(false);

    try {
      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          budget,
          travelers,
          days,
          type: travelType,
          activities: selectedActivities,
          accommodationPreference: accommodation,
          transportationPreference: transportation
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate trip');
      }

      const tripData = await response.json();
      setGeneratedTrip(tripData);
      setActiveDay(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerSave = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!generatedTrip) return;

    onSaveTrip(generatedTrip);
    setItinerarySaved(true);
  };

  const simulateDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Success! "${generatedTrip?.destination} Daily Itinerary Plan" has been downloaded securely as a PDF!`);
    }, 1800);
  };

  const shareItinerary = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Bespoke sharing URL copied to clipboard! Share it with friends and family.');
  };

  // Helper colors for budget pie representation
  const colors = {
    accommodations: 'bg-sky-500',
    activities: 'bg-indigo-550 bg-indigo-505 bg-indigo-500',
    food: 'bg-amber-550 bg-amber-500',
    transportation: 'bg-rose-500',
    savings: 'bg-emerald-450 bg-emerald-500'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center space-x-2 font-display">
          <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
          <span>Bespoke AI Travel Architect</span>
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
          Specify your dreams below. Our generative artificial intelligence models synthesize daily attractions, dining sequences, real time weather indicators and budget matrices in 4 seconds flat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Planner Settings Form */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-white/10">
          <form onSubmit={handleGenerate} className="space-y-6">
            
            {/* Destination Search */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                Destination Target
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Parallel Parameters Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                  Duration (Days)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-sky-400 focus:bg-white/10 transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                  Travelers Group
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                    className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-sky-400 focus:bg-white/10 transition"
                  />
                </div>
              </div>
            </div>

            {/* Custom Multi options selects */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                Budget Standard
              </label>
              <div className="grid grid-cols-3 gap-2">
                {budgetOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBudget(opt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      budget === opt
                        ? 'bg-white text-slate-950 border-white shadow-md active-glow font-bold'
                        : 'bg-white/5 text-slate-305 text-slate-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                Group Dynamic Style
              </label>
              <div className="flex flex-wrap gap-1.5">
                {travelTypes.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTravelType(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      travelType === opt
                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 font-semibold'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                  Stay Preference
                </label>
                <select
                  value={accommodation}
                  onChange={(e) => setAccommodation(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-medium focus:outline-none"
                >
                  {accommodationOptions.map(opt => (
                    <option key={opt} value={opt} className="text-slate-900 bg-slate-950">{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                  Transit Preference
                </label>
                <select
                  value={transportation}
                  onChange={(e) => setTransportation(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-medium focus:outline-none"
                >
                  {transportationOptions.map(opt => (
                    <option key={opt} value={opt} className="text-slate-900 bg-slate-950">{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom activity tags list selection */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-300 font-bold">
                Preferred Activities ({selectedActivities.length})
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-white/5 p-2.5 rounded-xl bg-white/5">
                {activitiesList.map(act => {
                  const isSel = selectedActivities.includes(act);
                  return (
                    <button
                      key={act}
                      type="button"
                      onClick={() => toggleActivity(act)}
                      className={`flex items-center space-x-1.5 p-2 rounded-lg text-left text-[11px] font-medium transition cursor-pointer ${
                        isSel ? 'bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isSel ? 'bg-sky-500 border-sky-400 text-white' : 'border-white/20 bg-white/5'}`}>
                        {isSel && <span className="text-[9px]">✓</span>}
                      </div>
                      <span className="truncate">{act}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white hover:bg-sky-400 text-slate-950 hover:text-white font-bold tracking-tight shadow-md flex items-center justify-center space-x-2 cursor-pointer transition transform active-glow active:translate-y-0.5 description:duration-250"
            >
              <Sparkles className="w-5 h-5 text-sky-550 text-indigo-500 animate-spin-slow" />
              <span>{loading ? 'Synthesizing bespoke plan...' : 'Synthesize bespoke plan'}</span>
            </button>

          </form>
        </div>

        {/* Output Screen */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading state skeleton screen styling */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              >
                <div className="flex items-center space-x-4 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded-md w-1/3" />
                    <div className="h-3 bg-white/10 rounded-md w-1/4" />
                  </div>
                </div>

                <div className="space-y-3 pt-4 font-normal">
                  <div className="h-3 bg-white/10 rounded-md w-11/12 animate-pulse" />
                  <div className="h-3 bg-white/10 rounded-md w-10/12 animate-pulse" />
                  <div className="h-3 bg-white/10 rounded-md w-12/12 animate-pulse" />
                </div>

                {/* Simulated staggered load indicators */}
                <div className="border border-white/5 bg-white/5 rounded-2xl p-4 sm:p-6 space-y-4">
                  <span className="text-xs font-mono tracking-widest text-[#4285F4] uppercase font-bold animate-pulse inline-block">
                    ● Initializing Google Maps Geocoders
                  </span>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 w-2/3 rounded-full animate-progress" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Compiling travel cost metrics under standard classes ...
                  </p>
                </div>
              </motion.div>
            )}

            {/* 2. Blank instructions screen when no plan is generated */}
            {!loading && !generatedTrip && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card border border-dashed border-white/10 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center h-full min-h-[460px] space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md">
                  <Compass className="w-8 h-8 text-indigo-400 animate-spin-slow" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white font-display">Your bespoke itinerary canvas is empty</h4>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed font-normal">
                    Apply target location coordinates, custom days, transit modes, and budget scales on the left. Press "Synthesize" to generate a complete layout of tours.
                  </p>
                </div>
                <div className="inline-flex items-center text-xs font-mono text-sky-400 space-x-1 font-bold">
                  <span>Powered by Gemini 3.5 Flash</span>
                  <Sparkles className="w-3 h-3" />
                </div>
              </motion.div>
            )}

            {/* 3. Fully styled premium itinerary displays */}
            {!loading && generatedTrip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Header branding info */}
                <div className="glass-card border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center space-x-1 bg-sky-505 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-1 rounded-full text-xs font-semibold mb-1">
                        <Plane className="w-3.5 h-3.5" />
                        <span>{generatedTrip.type} Odyssey</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight font-display">
                        {generatedTrip.destination}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {generatedTrip.days} Days • {generatedTrip.travelers} Guests • Expected Spend: ${generatedTrip.totalSpent} USD
                      </p>
                    </div>

                    {/* Header operations buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={triggerSave}
                        disabled={itinerarySaved}
                        className={`p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-semibold cursor-pointer transition ${
                          itinerarySaved
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${itinerarySaved ? 'fill-emerald-500 text-emerald-400 animate-bounce' : ''}`} />
                        <span>{itinerarySaved ? 'Saved to Hub' : 'Save Itinerary'}</span>
                      </button>

                      <button
                        onClick={shareItinerary}
                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                        title="Share Tour"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        disabled={isDownloading}
                        onClick={simulateDownloadPDF}
                        className="p-2.5 rounded-xl bg-white hover:bg-sky-400 text-slate-950 hover:text-white transition cursor-pointer flex items-center space-x-1 text-xs font-bold active-glow"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>{isDownloading ? 'Working...' : 'PDF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Weather and Packing Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-white/5 animate-fade-in font-normal">
                    <div className="md:col-span-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl p-4 flex items-center space-x-3">
                      <SunSnow className="w-8 h-8 text-sky-400 animate-spin-slow" />
                      <div>
                        <span className="block text-xs font-bold text-white font-sans">Expect {generatedTrip.weatherInfo?.temp || 'Pleasant'}</span>
                        <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">{generatedTrip.weatherInfo?.conditions || 'Clear sky'}</span>
                      </div>
                    </div>
                    <div className="md:col-span-8 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4">
                      <span className="block text-xs font-semibold text-indigo-300 flex items-center space-x-1"><Info className="w-3.5 h-3.5" /> Packing & Wardrobe tips</span>
                      <span className="block text-[11px] text-slate-300 leading-relaxed mt-0.5">{generatedTrip.weatherInfo?.recommendation}</span>
                    </div>
                  </div>
                </div>

                {/* Day Selectors list */}
                <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-thin">
                  {generatedTrip.itinerary.map(dayPlan => (
                    <button
                      key={dayPlan.day}
                      onClick={() => setActiveDay(dayPlan.day)}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        activeDay === dayPlan.day
                          ? 'bg-white text-slate-955 text-slate-950 font-bold active-glow shadow-md'
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      Day {dayPlan.day}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveDay(99)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      activeDay === 99
                        ? 'bg-white text-slate-955 text-slate-950 font-bold active-glow shadow-md'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Budget & Flights
                  </button>
                </div>

                {/* Displaying Itinerary list or metrics representation */}
                <AnimatePresence mode="wait">
                  {activeDay !== 99 ? (
                    <motion.div
                      key={activeDay}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      {generatedTrip.itinerary.find(d => d.day === activeDay)?.activities.map((act, index) => (
                        <div key={index} className="glass-card border border-white/5 rounded-2xl p-5 shadow-lg hover:shadow-xl transition grid grid-cols-1 md:grid-cols-12 gap-4">
                          
                          {/* Time tag */}
                          <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-1 pb-2 md:pb-0 md:border-r border-white/5 pr-4 animate-fade-in">
                            <span className="text-xs font-mono font-extrabold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-1 rounded-lg">
                              {act.time}
                            </span>
                            {act.location && (
                              <span className="text-[10px] text-slate-400 truncate mt-1">
                                {act.location}
                              </span>
                            )}
                          </div>

                          {/* Content Detail */}
                          <div className="md:col-span-7 space-y-1">
                            <h4 className="text-sm font-bold text-white font-display">{act.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">{act.description}</p>
                          </div>

                          {/* Cost */}
                          <div className="md:col-span-2 flex items-center justify-end md:justify-center border-t md:border-t-0 border-white/5 pt-2.5 md:pt-0">
                            <div className="text-right md:text-center">
                              <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase">Est Cost</span>
                              <span className="block text-sm font-extrabold text-white px-2 py-1 bg-white/5 border border-white/5 rounded-lg">
                                ${act.cost}
                              </span>
                            </div>
                          </div>

                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    /* Elegant Budget and flight recommendation list */
                    <motion.div
                      key="budget"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
                    >
                      <h4 className="text-sm font-bold tracking-tight text-white font-display">
                        Financial Budget Distribution & Advice
                      </h4>

                      {/* Custom styled meters for data visualization */}
                      <div className="space-y-4">
                        {Object.entries(generatedTrip.budgetBreakdown).map(([category, value]) => {
                          const val = value as number;
                          const pct = Math.round((val / generatedTrip.totalSpent) * 100) || 20;
                          const color = colors[category as keyof typeof colors] || 'bg-slate-400';
                          return (
                            <div key={category} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="capitalize font-semibold text-slate-300">{category}</span>
                                <span className="font-mono text-white">${val} ({pct}%)</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-indigo-500/5 rounded-2xl border border-indigo-500/10 p-4 font-normal text-xs text-indigo-305 text-indigo-300 leading-relaxed flex items-start space-x-2.5">
                        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                        <div>
                          <span className="font-bold block text-white">Smart Savings recommendation:</span>
                          We allocated ${generatedTrip.budgetBreakdown.savings} USD as a custom traveler emergency cushion. We advocate using organic public transportation where possible in {generatedTrip.destination} to drop your spendings significantly!
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
