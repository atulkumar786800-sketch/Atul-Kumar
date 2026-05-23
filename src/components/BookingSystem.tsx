/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calendar, Users, Building, Plane, Briefcase, Star, MapPin, Sparkles, Receipt, Trash2, ShieldCheck, TicketCheck, ArrowRight, Loader } from 'lucide-react';
import { Hotel, Flight, Booking } from '../types';
import { BOUTIQUE_HOTELS, AIRLINE_FLIGHTS, TOUR_PACKAGES } from '../data';

interface BookingSystemProps {
  currentUser: any;
  onOpenAuth: () => void;
  token: string | null;
  activeBookingCategory: string;
}

export default function BookingSystem({ currentUser, onOpenAuth, token, activeBookingCategory }: BookingSystemProps) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'packages' | 'active'>('hotels');
  const [hotels, setHotels] = useState<Hotel[]>(BOUTIQUE_HOTELS);
  const [flights, setFlights] = useState<Flight[]>(AIRLINE_FLIGHTS);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Stripe Mock Checkout states
  const [stripeOverlay, setStripeOverlay] = useState<{
    isOpen: boolean;
    itemName: string;
    amount: number;
    type: 'hotel' | 'flight' | 'package';
    details: any;
  } | null>(null);

  const [paying, setPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Atul Kumar');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmt, setDiscountAmt] = useState(0);

  useEffect(() => {
    if (activeBookingCategory) {
      if (activeBookingCategory === 'flight') setActiveTab('flights');
      else if (activeBookingCategory === 'pkg') setActiveTab('packages');
      else setActiveTab('hotels');
    }
  }, [activeBookingCategory]);

  const loadActiveBookings = async () => {
    if (!token) return;
    setIsLoadingBookings(true);
    try {
      const response = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadActiveBookings();
  }, [token]);

  const triggerStripePayment = (itemName: string, amount: number, type: 'hotel' | 'flight' | 'package', details: any) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setCouponApplied(false);
    setDiscountAmt(0);
    setCouponCode('');
    setStripeOverlay({
      isOpen: true,
      itemName,
      amount,
      type,
      details
    });
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'TRAVELAI30') {
      setCouponApplied(true);
      const discount = Math.round((stripeOverlay?.amount || 0) * 0.3);
      setDiscountAmt(discount);
    } else {
      alert('Invalid coupon. Try TRAVELAI30 for a massive 30% discount!');
    }
  };

  const executeStripePayment = async () => {
    if (!token || !stripeOverlay) return;
    setPaying(true);

    try {
      // Post booking to backend API endpoint
      const finalAmt = stripeOverlay.amount - discountAmt;
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: stripeOverlay.type,
          itemDetails: stripeOverlay.details,
          totalPrice: finalAmt,
          travelDate: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const stats = await response.json();
        // Credit Atul's points dynamically physically in standard React root hooks wrapper
        currentUser.rewardsPoints = stats.rewardsPoints;
        await loadActiveBookings();
        alert(`Secured! Invoice of $${finalAmt} paid via Stripe. Your rewards points were updated!`);
        setActiveTab('active');
        setStripeOverlay(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  const cancelReservation = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you absolute sure to cancel this luxurious booking? Cancellations are fully refundable under premium tiers.')) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await loadActiveBookings();
        alert('Booking cancelled successfully.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Category Navigation Ribbon */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-display">
            <Briefcase className="w-6 h-6 text-indigo-400" /> Vacation Reservations Hub
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-normal">
            Reserve premium verified transportation, boutique stays, or absolute bespoke packages below.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'hotels' ? 'bg-white text-slate-950 shadow-md active-glow' : 'text-slate-350 text-slate-300 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Hotels</span>
          </button>
          <button
            onClick={() => setActiveTab('flights')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'flights' ? 'bg-white text-slate-955 text-slate-950 shadow-md active-glow' : 'text-slate-350 text-slate-300 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Flights</span>
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer whitespace-nowrap ${
              activeTab === 'packages' ? 'bg-white text-slate-955 text-slate-950 shadow-md active-glow' : 'text-slate-350 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Packages</span>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer relative whitespace-nowrap ${
              activeTab === 'active' ? 'bg-white text-slate-955 text-slate-950 shadow-md active-glow' : 'text-slate-350 text-slate-300 hover:text-white'
            }`}
          >
            <TicketCheck className="w-3.5 h-3.5" />
            <span>My Bookings</span>
            {activeBookings.filter(b => b.status === 'confirmed').length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center rounded-full animate-pulse">
                {activeBookings.filter(b => b.status === 'confirmed').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ----------------- HOTELS DISPLAY ----------------- */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hotels.map(h => (
            <div key={h.id} className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:shadow-2xl hover:border-white/20 transition transform duration-250">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-slate-950/80 backdrop-blur border border-white/10 shadow rounded-lg flex items-center text-xs font-semibold text-white space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{h.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 inline-flex items-center space-x-1 bg-slate-950/70 backdrop-blur border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-mono">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 font-bold" />
                    <span>{h.location}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white font-display leading-tight">{h.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{h.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {h.amenities.map((a, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/5 text-[10px] font-medium text-slate-300 rounded-lg font-mono">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Room select option panels */}
              <div className="p-6 pt-0 border-t border-white/5 space-y-4">
                <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">
                  Suite Variations Options:
                </span>
                <div className="space-y-3 font-normal">
                  {h.rooms.map((room, idx) => (
                    <div key={idx} className="p-3 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-between gap-4 hover:bg-white/10 transition">
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-white truncate">{room.type}</span>
                        <span className="block text-[10px] text-slate-350 text-slate-300 truncate mt-0.5">{room.description}</span>
                      </div>
                      <button
                        onClick={() => triggerStripePayment(
                          `${h.name} - ${room.type}`,
                          room.price,
                          'hotel',
                          { name: room.type, subDetails: `${h.name} • Max Capacity: ${room.capacity}`, price: room.price, image: h.image }
                        )}
                        className="px-4 py-2 border border-sky-400 font-bold text-xs text-sky-400 hover:text-white hover:bg-sky-505 hover:bg-sky-500 rounded-xl transition shrink-0 cursor-pointer active-glow"
                      >
                        Book ${room.price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ----------------- FLIGHTS DISPLAY ----------------- */}
      {activeTab === 'flights' && (
        <div className="space-y-4 font-normal text-slate-200">
          {flights.map(fl => (
            <div key={fl.id} className="glass-card border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Airline details */}
              <div className="col-span-12 md:col-span-3 flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-white font-extrabold flex items-center justify-center rounded-2xl text-md shadow">
                  {fl.logo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">{fl.airline}</h4>
                  <span className="block text-[10px] font-mono text-indigo-400 font-bold uppercase">{fl.class}</span>
                </div>
              </div>

              {/* Routings and dep/arrive */}
              <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Routing Link</span>
                  <span className="block text-xs font-semibold text-slate-300">{fl.from} → {fl.to}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Duration</span>
                  <span className="block text-xs font-semibold text-slate-300">{fl.duration}</span>
                </div>
              </div>

              {/* Time slots info */}
              <div className="col-span-12 md:col-span-2">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Departure Schedule</span>
                <span className="block text-[11px] font-medium text-slate-300 truncate mt-0.5">{fl.departure}</span>
              </div>

              {/* Cost checkout action */}
              <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Tariff ticket</span>
                  <span className="block text-lg font-extrabold text-white">${fl.price}</span>
                </div>
                <button
                  onClick={() => triggerStripePayment(
                    `${fl.airline} Flight to ${fl.to}`,
                    fl.price,
                    'flight',
                    { name: `${fl.airline} ticket to ${fl.to}`, subDetails: `Class: ${fl.class} • Depart: ${fl.departure}`, price: fl.price }
                  )}
                  className="px-5.5 py-3 rounded-xl bg-white hover:bg-indigo-500 text-slate-950 hover:text-white text-xs font-bold shadow-md transition cursor-pointer active-glow"
                >
                  Pay Secure
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ----------------- PACKAGES DISPLAY ----------------- */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TOUR_PACKAGES.map(pkg => (
            <div key={pkg.id} className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-250">
              
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-slate-950/85 border border-white/5 rounded text-[10px] font-mono text-white">
                    {pkg.days} Days / {pkg.nights} Nights
                  </div>
                </div>

                <div className="p-5.5 space-y-3">
                  <span className="block text-[10px] text-sky-400 font-mono font-bold uppercase flex items-center gap-1"><Sparkles className="w-3 h-3 text-sky-405 text-sky-400 animate-spin-slow" /> {pkg.destination} BESPOKE TOUR</span>
                  <h3 className="text-sm font-bold text-white font-display leading-snug">{pkg.title}</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{pkg.description}</p>
                  
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                    <span className="block text-[9px] font-mono uppercase text-slate-400 font-bold">Planned Route outline</span>
                    <span className="block text-[10px] text-slate-300 line-clamp-2 leading-relaxed font-normal font-sans">{pkg.itinerarySummary}</span>
                  </div>
                </div>
              </div>

              <div className="p-5.5 pt-0 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">Per traveler</span>
                  <span className="block text-md font-extrabold text-white">${pkg.price}</span>
                </div>
                <button
                  onClick={() => triggerStripePayment(
                    pkg.title,
                    pkg.price,
                    'package',
                    { name: pkg.title, subDetails: `${pkg.destination} • Bespoke Guide Tour`, price: pkg.price, image: pkg.image }
                  )}
                  className="px-4.5 py-2.5 rounded-xl bg-white hover:bg-sky-400 text-slate-950 hover:text-white text-xs font-bold cursor-pointer transition shadow-md active-glow"
                >
                  Pay Securely
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ----------------- BOOKINGS HISTORY DISPLAY ----------------- */}
      {activeTab === 'active' && (
        <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {isLoadingBookings ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader className="w-8 h-8 text-sky-400 animate-spin" />
              <span className="text-xs text-slate-400 font-mono">Syncing active ledger records ...</span>
            </div>
          ) : !token ? (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              Sign In to manage saved booking receipts ledger structures.
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-300 text-xs font-medium font-sans">
              No active reservations saved in your ledger yet! Grab some flights or hotels options above.
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map(b => (
                <div key={b.id} className="p-5 border border-white/5 bg-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/10 transition duration-200">
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-sky-400 shrink-0">
                      {b.type === 'flight' ? <Plane className="w-5 h-5" /> : b.type === 'hotel' ? <Building className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-white">{b.itemDetails.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {b.status}
                        </span>
                      </div>
                      <span className="block text-[10px] text-slate-300 font-normal mt-0.5">{b.itemDetails.subDetails}</span>
                      <span className="block text-[10px] text-slate-400 font-mono text-[9px] uppercase mt-0.5">Booking ID: {b.id} • Registered Travel Date: {b.travelDate}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="block text-[9px] font-mono tracking-widest text-slate-400 uppercase">Aggregate Fee</span>
                      <span className="block text-md font-extrabold text-white">${b.totalPrice}</span>
                    </div>

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => cancelReservation(b.id)}
                        className="px-3.5 py-2 rounded-lg border border-rose-500/30 hover:bg-rose-500/15 text-rose-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- STRIPE MOCK OVERLAY MODAL ----------------- */}
      {stripeOverlay?.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/15 animate-fade-in animate-scale-up">
            
            {/* Modal header */}
            <div className="bg-white/5 border-b border-white/5 p-5 text-white">
              <span className="text-xs font-mono tracking-wider text-sky-400 uppercase font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-sky-400" /> SECURE STRIPE CHECKOUT
              </span>
              <h3 className="text-sm font-bold text-white mt-1 truncate">
                {stripeOverlay.itemName}
              </h3>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">
              
              {/* Receipts parameters */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Booking Subtotal:</span>
                  <span className="font-mono text-white">${stripeOverlay.amount}</span>
                </div>
                {couponApplied && (
                  <div className="flex items-center justify-between text-xs text-rose-400">
                    <span>Loyalty 30% Coupon Discount:</span>
                    <span className="font-mono">-${discountAmt}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-white/15 font-extrabold text-white">
                  <span>Grand Total (USD):</span>
                  <span>${stripeOverlay.amount - discountAmt}</span>
                </div>
              </div>

              {/* Coupon inputs */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-wide text-slate-300 uppercase font-mono">
                  Rewards Coupon Code
                </label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    placeholder="Type TRAVELAI30 (for 30% off)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold hover:bg-sky-400 hover:text-white cursor-pointer active-glow"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Credit card inputs */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold tracking-wide text-slate-300 uppercase font-mono">
                    Credit Card Number (Secure Stripe tokenised)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wide text-slate-300 uppercase font-mono">
                      Expiration Code
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      defaultValue="08 / 31"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wide text-slate-300 uppercase font-mono">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      defaultValue="123"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Stripe Trust Disclaimer info */}
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Stripe Payments Certified. TLS 1.3 encryption. Your financial key handles are tokenised on Stripe servers and are 100% hidden.
              </p>

              {/* Modal footer button operations */}
              <div className="flex items-center space-x-2 pt-3">
                <button
                  onClick={() => setStripeOverlay(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={paying}
                  onClick={executeStripePayment}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-sky-400 text-slate-950 hover:text-white text-xs font-xl font-extrabold text-center cursor-pointer shadow hover:shadow-lg flex items-center justify-center space-x-1 active-glow"
                >
                  {paying ? (
                    <>
                      <Loader className="w-3.5 h-3.5 animate-spin mr-1 text-sky-450" />
                      <span>Paying...</span>
                    </>
                  ) : (
                    <span>Pay ${stripeOverlay.amount - discountAmt} Securely</span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
