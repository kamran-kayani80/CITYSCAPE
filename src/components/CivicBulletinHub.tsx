import React, { useState } from 'react';
import {
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  Building,
  Calendar,
  Search,
  Filter,
  Share2,
  Volume2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CivicAnnouncement } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../lib/constants';
import { useAccessibility } from '../context/AccessibilityContext';

export const CivicBulletinHub: React.FC = () => {
  const { speakText } = useAccessibility();
  const [announcements, setAnnouncements] = useState<CivicAnnouncement[]>(MOCK_ANNOUNCEMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredAnnouncements = announcements.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        (item.wardZone && item.wardZone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="dark-indigo-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg">
                Municipal Official Feed
              </span>
              <span className="text-xs font-bold text-indigo-300">Live Updates & Advisories</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Civic Bulletin & Municipal Announcements
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl">
              Stay informed with verified alerts, road closures, public utility notices, senior community programs, and municipal town halls directly from city departments.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-4 bg-indigo-900/60 border border-indigo-700/80 rounded-2xl text-center">
              <span className="block text-2xl font-black text-yellow-400">{announcements.length}</span>
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Active Bulletins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="soft-card p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search advisories, roadworks, wards, or departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-extrabold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[44px]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Notices' },
            { id: 'EMERGENCY', label: '🚨 Emergencies' },
            { id: 'ROADWORK', label: '🚧 Roadworks' },
            { id: 'UTILITY', label: '💧 Utilities' },
            { id: 'SENIOR_SERVICES', label: '👵 Senior Services' },
            { id: 'PUBLIC_HEARING', label: '🏛️ Town Halls' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer min-h-[40px] ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulletins Feed List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="soft-card p-12 text-center space-y-3">
            <Megaphone className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">No Bulletins Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No municipal advisories match your current search query or filter selection.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const isCritical = item.priority === 'CRITICAL';
            const isUrgent = item.priority === 'URGENT';
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-3xl border transition-all ${
                  isCritical
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 shadow-md ring-1 ring-rose-300'
                    : isUrgent
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 shadow-xs'
                    : 'soft-card'
                } p-5 sm:p-6 space-y-3`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-3 rounded-2xl shrink-0 font-black ${
                        isCritical
                          ? 'bg-rose-600 text-white shadow-xs'
                          : isUrgent
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {isCritical ? (
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      ) : isUrgent ? (
                        <Bell className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                          {item.department}
                        </span>
                        {item.wardZone && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                            📍 {item.wardZone}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                          • {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white mt-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => speakText(`${item.title}. Published by ${item.department}. ${item.description}`)}
                    className="p-2 bg-indigo-100 dark:bg-indigo-900/60 hover:bg-indigo-200 text-indigo-800 dark:text-indigo-200 rounded-xl transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
                    title="Read bulletin aloud"
                  >
                    <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                  </button>
                </div>

                {/* Description Body */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {item.description}
                </p>

                {/* Impact details / dates bar */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800 flex-wrap gap-2">
                  {item.effectiveDates && (
                    <span className="font-extrabold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{item.effectiveDates}</span>
                    </span>
                  )}

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: item.title, text: item.description });
                      } else {
                        navigator.clipboard.writeText(`${item.title}: ${item.description}`);
                        alert('Bulletin link copied to clipboard!');
                      }
                    }}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer min-h-[38px] flex items-center space-x-1"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Share Advisory</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
