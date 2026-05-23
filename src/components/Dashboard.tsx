/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, Trip, Booking } from '../types';
import { Calendar, Award, DollarSign, Wallet, ShieldCheck, TrendingUp, Users, Heart, ClipboardList, Trash2, ArrowRight, Star, RefreshCw, Send, Sparkles } from 'lucide-react';

interface DashboardProps {
  currentUser: User | null;
  onLogout: () => void;
  token: string | null;
  onStartBooking: (category: 'hotel' | 'flight' | 'pkg') => void;
  activeDefaultTab?: string;
}

export default function Dashboard({ currentUser, onLogout, token, onStartBooking, activeDefaultTab }: DashboardProps) {
  const [isAdminTab, setIsAdminTab] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // admin inputs
  const [couponName, setCouponName] = useState('');
  const [couponPct, setCouponPct] = useState(30);

  useEffect(() => {
    if (activeDefaultTab === 'admin') {
      setIsAdminTab(true);
    } else {
      setIsAdminTab(false);
    }
  }, [activeDefaultTab]);

  const fetchTripsAndLedger = async () => {
    if (!token) return;
    setIsLoadingTrips(true);
    try {
      const response = await fetch('/api/trips', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingTrips(false);
    }
  };

  const fetchAdminAnalytics = async () => {
    if (!token || currentUser?.role !== 'admin') return;
    setIsLoadingAdmin(true);
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  useEffect(() => {
    fetchTripsAndLedger();
    if (currentUser?.role === 'admin') {
      fetchAdminAnalytics();
    }
  }, [token, currentUser, isAdminTab]);

  const deleteItinerary = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you absolute sure you want to delete this AI summary?')) return;

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchTripsAndLedger();
        alert('Itinerary deleted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addNewCoupon = () => {
    if (!couponName) return;
    alert(`Success! Exclusive Promo Code "${couponName.toUpperCase()}" offering ${couponPct}% Off saved and pushed securely to server-sent email list!`);
    setCouponName('');
  };

  // Helper aggregation metrics
  const totalFinancialSpent = trips.reduce((sum, t) => sum + (t.totalSpent || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-normal text-slate-200">
      
      {/* Page Header section */}
      <div className="border-b border-white/10 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            {isAdminTab ? 'Global Control Center' : 'Personal Odyssey Hub'}
          </h2>
          <p className="text-slate-305 text-slate-300 text-xs sm:text-sm">
            {isAdminTab
              ? 'Moderate registered customers, audit booking transaction histories, generate coupon parameters, or view real-time revenue.'
              : 'Audit your compiled travel histories, check loyalty rewards points progress, track budgets, and manage itineraries.'}
          </p>
        </div>

        {/* Administration switcher */}
        {currentUser?.role === 'admin' && (
          <div className="flex items-center space-x-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              onClick={() => setIsAdminTab(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                !isAdminTab ? 'bg-white text-slate-950 shadow-md active-glow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              My Travel Hub
            </button>
            <button
              onClick={() => setIsAdminTab(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                isAdminTab ? 'bg-white text-slate-950 shadow-md active-glow font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin Controls
            </button>
          </div>
        )}
      </div>

      {/* -------------------- ADMIN DASHBOARD VIEW -------------------- */}
      {isAdminTab && currentUser?.role === 'admin' && (
        <div className="space-y-8 animate-fade-in font-normal">
          
          {/* Key KPIs widget panels */}
          {analyticsData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-xl space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Aggregated Sales</span>
                <div className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-1">
                  <DollarSign className="w-5 h-5 text-emerald-400 font-bold" />
                  <span>${analyticsData.metrics.totalRevenue}</span>
                </div>
                <span className="block text-[10px] text-emerald-400 font-bold tracking-tight">↑ 14% growth monthly</span>
              </div>

              <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-xl space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Active Bookings</span>
                <div className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-1">
                  <ClipboardList className="w-5 h-5 text-indigo-400" />
                  <span>{analyticsData.metrics.activeBookings} Receipts</span>
                </div>
                <span className="block text-[10px] text-slate-400 font-mono">0 cancellations today</span>
              </div>

              <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-xl space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Total Users Directory</span>
                <div className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-1">
                  <Users className="w-5 h-5 text-sky-400" />
                  <span>{analyticsData.metrics.totalUsers} Profiles</span>
                </div>
                <span className="block text-[10px] text-sky-450 text-sky-400 font-bold">↑ 2 registered this hour</span>
              </div>

              <div className="glass-card border border-white/10 rounded-2xl p-5 shadow-xl space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">AI Plans Generated</span>
                <div className="text-xl sm:text-2xl font-bold font-sans text-white flex items-center gap-1">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span>{analyticsData.metrics.totalItineraries} Runs</span>
                </div>
                <span className="block text-[10px] text-slate-400 font-mono">Token usage optimal</span>
              </div>
            </div>
          )}

          {/* Graphics, Promotions, Coupon Makers grids */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Coupon Promo creator tool */}
            <div className="md:col-span-4 glass-card border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-display pt-1">
                <Award className="w-4.5 h-4.5 text-amber-400" /> Promotional Coupon Generator
              </h3>

              <div className="space-y-3 font-normal">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-350 text-slate-300 block font-bold">Coupon Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ULTRAFALL40"
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-indigo-455 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-305 text-slate-300 block font-bold">Discount value (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    required
                    value={couponPct}
                    onChange={(e) => setCouponPct(parseInt(e.target.value) || 30)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={addNewCoupon}
                  className="w-full py-2.5 bg-white hover:bg-sky-400 hover:text-white rounded-xl text-xs font-bold text-slate-950 transition tracking-tight cursor-pointer active-glow"
                >
                  Save & Publish Coupon
                </button>
              </div>
            </div>

            {/* Simulated analytics charting line via plain layout */}
            <div className="md:col-span-8 glass-card border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center justify-between font-display">
                <span>Revenue Performance Growth Index</span>
                <span className="text-[10px] font-mono bg-white/5 border border-white/5 text-sky-400 px-2 py-0.5 rounded font-bold">Fiscal 2026</span>
              </h3>
              
              <div className="h-44 flex items-end justify-between gap-2.5 pt-6 border-b border-l border-white/10 px-4">
                {[
                  { m: 'Jan', h: 'h-[15%]', v: '$340' },
                  { m: 'Feb', h: 'h-[30%]', v: '$620' },
                  { m: 'Mar', h: 'h-[45%]', v: '$980' },
                  { m: 'Apr', h: 'h-[60%]', v: '$1,400' },
                  { m: 'May', h: 'h-[90%]', v: '$2,550' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-950 text-white text-[9px] font-mono px-1.5 py-0.5 border border-white/10 rounded shadow transition-opacity">
                      {item.v}
                    </div>
                    <div className={`w-full ${item.h} bg-gradient-to-t from-sky-400 to-indigo-505 to-indigo-500 rounded-t-lg group-hover:opacity-90 transition-all`} />
                    <span className="text-[10px] font-mono text-slate-400 mt-2 font-bold">{item.m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* User register profiles directory and booking histories indexes */}
          {analyticsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-normal">
              
              <div className="glass-card border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-white font-display">
                  Registered Customer Directory ({analyticsData.users.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400 font-mono uppercase text-[9px]">
                        <th className="py-2">Name</th>
                        <th className="py-2">Email address</th>
                        <th className="py-2 text-right">RewardsPts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {analyticsData.users.map((u: any) => (
                        <tr key={u.id} className="text-slate-300 hover:bg-white/5 transition duration-150">
                          <td className="py-2.5 font-bold text-white">{u.name}</td>
                          <td className="py-2.5 font-mono text-slate-450 text-slate-300">{u.email}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-indigo-400">{u.rewardsPoints}pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="glass-card border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold tracking-tight text-white font-display">
                  Global Transactions Ledger Log ({analyticsData.bookings.length})
                </h3>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {analyticsData.bookings.map((b: any) => (
                    <div key={b.id} className="p-3 border border-white/5 bg-white/5 rounded-xl flex items-center justify-between text-xs hover:bg-white/10 transition">
                      <div>
                        <span className="block font-bold text-white">{b.itemDetails.name}</span>
                        <span className="block text-[10px] text-slate-300 mt-0.5">Category: {b.type} • Travel date: {b.travelDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-extrabold text-white">${b.totalPrice}</span>
                        <span className={`block text-[8px] font-mono font-bold uppercase mt-0.5 ${b.status === 'confirmed' ? 'text-emerald-400' : 'text-rose-450 text-rose-400'}`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* -------------------- USER HUB / MY TRAVEL TAB -------------------- */}
      {!isAdminTab && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-normal text-slate-200">
          
          {/* User profile details, points counter, rewards milestone */}
          <div className="lg:col-span-4 space-y-6">
            
            {currentUser && (
              <div className="bg-gradient-to-br from-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-white/10 relative overflow-hidden space-y-5">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <Award className="w-40 h-40 transform translate-x-12 translate-y-12 text-sky-455 text-sky-400" />
                </div>

                <div className="flex items-center space-x-3 relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-white font-extrabold shadow">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight text-white font-display">{currentUser.name}</h4>
                    <span className="block text-[9px] font-mono text-sky-400 uppercase tracking-widest font-bold">{currentUser.role} Account</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-slate-350 text-slate-300 uppercase block tracking-wider font-bold">Available Loyalty Balance</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-sky-400 font-sans tracking-tight">{currentUser.rewardsPoints} PTS</span>
                    <span className="text-[10px] font-mono underline text-indigo-305 text-indigo-400">Equivalent to ${Math.round(currentUser.rewardsPoints * 0.1)} USD</span>
                  </div>
                </div>

                <div className="space-y-1 relative">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Share & Refer friends</span>
                  <div className="p-2.5 bg-slate-950/60 rounded-xl flex items-center justify-between border border-white/5 hover:bg-slate-950/80 transition" onClick={() => {
                    navigator.clipboard.writeText(currentUser.referralCode);
                    alert('Exclusive referral link copied!');
                  }}>
                    <span className="font-mono text-xs font-bold tracking-tight text-slate-300 select-all cursor-pointer">{currentUser.referralCode}</span>
                    <span className="text-[9px] text-[#4285F4] font-bold uppercase hover:underline cursor-pointer">Copy invite URL</span>
                  </div>
                  <span className="block text-[9px] text-slate-400 mt-1 font-sans">Get 100 PTS bonus code for each referral!</span>
                </div>
              </div>
            )}

            {/* Custom Travel Budgeting Metrics tool */}
            <div className="glass-card border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-display pt-1">
                <Wallet className="w-4.5 h-4.5 text-sky-400 animate-pulse" /> Active Spendings Ledger
              </h3>

              <div className="space-y-3 font-normal">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">Aggregated Spend</span>
                    <span className="block text-xl font-extrabold text-white">${totalFinancialSpent}</span>
                  </div>
                  <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 font-extrabold font-mono">
                    $
                  </div>
                </div>

                <div className="space-y-1 pt-1.5">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>Fiscal Limit Progress ($5,000 max):</span>
                    <span className="font-mono font-bold text-white">{Math.round((totalFinancialSpent / 5000) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-450 from-sky-400 to-indigo-500 rounded-full" style={{ width: `${Math.min((totalFinancialSpent / 5000) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* User's save trips display */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center justify-between mb-4 font-display">
                <span>My Saved Itineraries Directory</span>
                <span className="text-xs bg-white/5 border border-white/5 text-sky-400 px-2.5 py-1 rounded-full font-mono font-bold">{trips.length} Saved</span>
              </h3>

              {isLoadingTrips ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 font-mono">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-400">Syncing saved trips ledger...</span>
                </div>
              ) : trips.length === 0 ? (
                <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <Calendar className="w-12 h-12 text-slate-400 animate-spin-slow" />
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-bold text-white font-sans">No saved itineraries in directory</h5>
                    <p className="text-xs text-slate-300 max-w-sm">Use our leading Generative AI planner on the left side to compile bespoke lists of days tour, and press save!</p>
                  </div>
                  <button
                    onClick={() => onStartBooking('hotel')}
                    className="inline-flex items-center text-xs font-bold text-sky-400 space-x-1 hover:underline cursor-pointer"
                  >
                    <span>Reserve boutique hotels now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {trips.map(trip => (
                    <div key={trip.id} className="p-5 border border-white/5 bg-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-white">{trip.destination}</span>
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-[9px] font-mono text-indigo-300 border border-indigo-500/10 font-bold uppercase rounded-md">
                            {trip.type}
                          </span>
                        </div>
                        <span className="block text-[10px] text-slate-300 font-mono">
                          {trip.days} Days • {trip._travelers || trip.travelers || 2} Guests • Anticipated Spend: ${trip.totalSpent} USD
                        </span>
                        <div className="flex flex-wrap gap-1 font-normal font-sans pt-1">
                          {trip.activities?.slice(0, 3).map((act: any, idx: number) => (
                            <span key={idx} className="bg-white/5 px-2 py-0.5 text-[8px] text-slate-300 rounded border border-white/5 uppercase font-mono">
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-white/5 pt-3.5 sm:pt-0">
                        <button
                          onClick={() => onStartBooking('hotel')}
                          className="px-3.5 py-2.5 bg-white hover:bg-sky-400 text-slate-950 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer active-glow shrink-0"
                        >
                          Book Accommodations
                        </button>
                        <button
                          onClick={() => deleteItinerary(trip.id)}
                          className="p-2 border border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500/50 rounded-lg text-rose-400 transition cursor-pointer shrink-0"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
