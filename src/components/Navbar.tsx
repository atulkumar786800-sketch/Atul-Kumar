/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Compass, User, Sparkles, LogOut, Shield, Heart, FileText, Gift, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentUser: UserType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogout, onOpenAuth }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'ai-planner', label: 'AI Planner', icon: Sparkles },
    { id: 'bookings', label: 'Bookings', icon: Gift },
    { id: 'blogs', label: 'Guides', icon: FileText },
    { id: 'dashboard', label: 'My Hub', icon: User }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-t-0 border-x-0 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-500/10">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-400 rounded-full border border-slate-900 animate-ping" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">
                Travel<span className="text-sky-400">AI</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-sky-400 font-medium uppercase">
                LUXURY CONCIERGE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-450 border border-sky-500/30 shadow-lg shadow-sky-500/5 font-semibold text-sky-400'
                      : 'text-slate-355 hover:bg-white/5 hover:text-white text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action & Authentication */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {/* Rewards Badging */}
                <div 
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 cursor-pointer hover:bg-indigo-500/20 transition-colors"
                >
                  <Gift className="w-4 h-4 text-indigo-450 text-indigo-400 animate-bounce" />
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    {currentUser.rewardsPoints} PTS
                  </span>
                </div>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 transition-colors cursor-pointer text-amber-405 font-medium text-xs text-amber-405 text-amber-400"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin</span>
                  </button>
                )}

                {/* Profile Widget */}
                <div className="flex items-center space-x-2.5 border-l border-white/10 pl-4">
                  <div className="text-right">
                    <span className="block text-xs font-semibold text-white">{currentUser.name}</span>
                    <span className="block text-[10px] font-mono text-slate-400 uppercase">{currentUser.role}</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {currentUser.name.charAt(0)}
                  </div>
                  <button
                    onClick={onLogout}
                    title="Logout Session"
                    className="p-1 px-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-slate-900 bg-white hover:bg-sky-450 hover:bg-sky-400 hover:text-white transition-all shadow-lg active-glow cursor-pointer transform hover:-translate-y-0.5 duration-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {currentUser && (
              <div className="mr-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                <span>{currentUser.rewardsPoints}pts</span>
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-white/5 transition-colors focus:outline-none"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 glass-effect shadow-2xl animate-fade-in">
          <div className="px-2 pt-3 pb-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 font-bold' : 'text-slate-450'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-500/10`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Console</span>
              </button>
            )}

            <div className="pt-4 pb-2 border-t border-white/10">
              {currentUser ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{currentUser.name}</div>
                      <div className="text-xs text-slate-400">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-450 hover:bg-rose-500/10 text-rose-450 text-rose-400 text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Session</span>
                  </button>
                </div>
              ) : (
                <div className="px-4">
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-full bg-white hover:bg-sky-400 hover:text-white text-slate-900 transition-all font-semibold shadow-md text-center"
                  >
                    Login / Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
