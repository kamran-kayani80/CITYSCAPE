import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Flame,
  Globe,
  Heart,
  Layers,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  User,
  Zap,
  Check,
  Building2,
  Calendar,
  Lock,
  Leaf,
  Plus,
} from 'lucide-react';
import { UserProfile, Badge, AdoptedZone, Report } from '../types';
import { GoogleAuthButton } from './GoogleAuthButton';

interface UserProfileViewProps {
  onSelectReport?: (report: Report) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onSelectReport }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<(Badge & { userProgress: number; unlockedAt?: string; isUnlocked: boolean })[]>([]);
  const [adoptedZones, setAdoptedZones] = useState<AdoptedZone[]>([]);
  const [resolvedUserReports, setResolvedUserReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<'ALL' | 'UNLOCKED' | 'IN_PROGRESS'>('ALL');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [titleSuccessMsg, setTitleSuccessMsg] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, zonesRes, reportsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/zones'),
        fetch('/api/reports?status=RESOLVED'),
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setProfile(pData.profile);
        setBadges(pData.badges || []);
        setSelectedTitle(pData.profile.title);
      }

      if (zonesRes.ok) {
        const zData = await zonesRes.json();
        setAdoptedZones(zData.zones || []);
      }

      if (reportsRes.ok) {
        const rData = await reportsRes.json();
        setResolvedUserReports(rData.reports || []);
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    setSelectedTitle(newTitle);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setTitleSuccessMsg(true);
        setTimeout(() => setTitleSuccessMsg(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update title:', err);
    }
  };

  const handleToggleZoneAdopt = async (zoneId: string) => {
    try {
      const res = await fetch(`/api/zones/${zoneId}/adopt`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAdoptedZones((prev) => prev.map((z) => (z.id === zoneId ? data.zone : z)));
        if (data.userProfile) {
          setProfile(data.userProfile);
        }
      }
    } catch (err) {
      console.error('Failed to adopt zone:', err);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 animate-pulse">
        Loading Civic Passport & Profile...
      </div>
    );
  }

  const filteredBadges = badges.filter((b) => {
    if (selectedBadgeFilter === 'UNLOCKED') return b.isUnlocked;
    if (selectedBadgeFilter === 'IN_PROGRESS') return !b.isUnlocked;
    return true;
  });

  // Mock 52-week activity heatmap data generation
  const generateHeatmapDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 180; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const intensity = (i % 7 === 0 || i % 11 === 0 || i % 13 === 0) ? Math.floor(Math.random() * 4) + 1 : 0;
      days.push({ date: date.toISOString().split('T')[0], intensity });
    }
    return days;
  };

  const heatmapDays = generateHeatmapDays();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO CIVIC PASSPORT HEADER (Dark Midnight Indigo Card with Glowing Bar like in prompt image) */}
      <div className="dark-indigo-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Title / Name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-400/30 shadow-xl"
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 rounded-xl shadow-md">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {profile.fullName}
                </h1>
                <span className="text-xs font-mono font-bold text-indigo-200/80">@{profile.username}</span>
              </div>

              {/* Title Selector Dropdown */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs text-indigo-200/70 font-semibold">Active Title:</span>
                <select
                  value={selectedTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-indigo-900/80 border border-indigo-400/40 text-indigo-100 font-extrabold text-xs px-3 py-1 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-indigo-400"
                >
                  {profile.unlockedTitles.map((t) => (
                    <option key={t} value={t} className="bg-slate-900 text-white">
                      🎖️ {t}
                    </option>
                  ))}
                </select>
                {titleSuccessMsg && (
                  <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                    Updated!
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200/80 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.neighborhoodName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Member since {profile.joinedDate}</span>
                </span>
              </div>

              {/* Google Account Status Badge */}
              <div className="pt-2">
                <GoogleAuthButton
                  currentUserProfile={profile}
                  onAuthChange={(updated) => setProfile(updated)}
                  variant="profile"
                />
              </div>
            </div>
          </div>

          {/* Civic Karma & Trust Score Pill */}
          <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 icon-tile-amber rounded-2xl">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {profile.civicKarma}
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                  Civic Karma
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-100">
              <span>Trust Score:</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full font-mono font-black">
                {profile.trustScore}% Verified
              </span>
            </div>
          </div>
        </div>

        {/* Glowing Progress Bar (Matches prompt dark card style) */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs text-indigo-200 font-bold">
            <span>Next Civic Level: Civic Sentinel</span>
            <span>{profile.civicKarma} / 1200 XP</span>
          </div>
          <div className="w-full h-3 bg-indigo-950/80 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div className="h-full glowing-bar rounded-full" style={{ width: '70%' }} />
          </div>
        </div>

        {/* Impact Statistics Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[11px] font-medium text-indigo-200/80">Reports Logged</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {profile.impactStats.reportsResolved} / {profile.impactStats.reportsSubmitted}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">78% Resolved</div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[11px] font-medium text-indigo-200/80">Ground Checks</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {profile.impactStats.verificationsCount}
            </div>
            <div className="text-[10px] text-cyan-400 font-bold">Verified</div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[11px] font-medium text-indigo-200/80">Upvotes Rec'd</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {profile.impactStats.upvotesReceived}
            </div>
            <div className="text-[10px] text-indigo-300 font-bold">Endorsements</div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[11px] font-medium text-indigo-200/80">Upvotes Given</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {profile.impactStats.upvotesGiven}
            </div>
            <div className="text-[10px] text-indigo-300 font-bold">Community</div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[11px] font-medium text-indigo-200/80">Hours Saved</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              {profile.impactStats.estHoursSaved} hrs
            </div>
            <div className="text-[10px] text-purple-300 font-bold">Prevention</div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[11px] font-medium text-indigo-200/80">Value Created</div>
            <div className="text-lg font-black font-mono text-white mt-0.5">
              ${profile.impactStats.civicValueCreatedUsd.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">Public Goods</div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITY HEATMAP GRID (Soft Tactile Card) */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-heading font-black text-[#1c1a3b] dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Civic Action Contribution Grid</span>
            </h3>
            <p className="text-xs text-indigo-950/80 font-bold">Daily reports, verifications, and discussions logged over the last 6 months.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-900 font-semibold">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-[#e2dff4]" />
            <span className="w-3 h-3 rounded bg-indigo-300" />
            <span className="w-3 h-3 rounded bg-indigo-500" />
            <span className="w-3 h-3 rounded bg-indigo-700" />
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[650px]">
            {heatmapDays.map((day, idx) => {
              const bgClasses = [
                'bg-[#e2dff4]',
                'bg-indigo-300',
                'bg-indigo-500 text-white',
                'bg-indigo-600 text-white',
                'bg-purple-600 text-white',
              ];
              return (
                <div
                  key={idx}
                  title={`${day.date}: ${day.intensity} civic actions`}
                  className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 hover:ring-2 hover:ring-indigo-500 cursor-pointer ${bgClasses[day.intensity]}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. IMPACT PORTFOLIO GRID ("Before & After" Showcase Cards) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-[#1c1a3b] dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Impact Portfolio: Before & After Proof</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Real tangible results generated from your reports and community verification on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resolvedUserReports.map((report) => (
            <div
              key={report.id}
              className="soft-card p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">#{report.id}</span>
                  <h4 className="font-extrabold text-[#1c1a3b] dark:text-white text-sm line-clamp-1">{report.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{report.addressText}</p>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-300">
                  RESOLVED
                </span>
              </div>

              {/* Side-by-side Before & After comparison */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-100 border border-white">
                  <img src={report.imageUrls[0]} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-black rounded-lg">
                    BEFORE
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden h-36 bg-emerald-950/20 border-2 border-emerald-400">
                  <img
                    src={report.resolutionImageUrl || report.imageUrls[0]}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-lg shadow-xs">
                    AFTER
                  </span>
                </div>
              </div>

              {report.officialNote && (
                <p className="text-xs text-slate-700 italic soft-inset p-3 border border-white/60 font-medium">
                  "{report.officialNote}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. CIVIC BADGES & MILESTONES DRAWER */}
      <div className="soft-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
          <div>
            <h3 className="text-xl font-black text-[#1c1a3b] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Civic Badges & Quality Milestones</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Earned through quality verifications and constructive follow-through.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 soft-inset text-xs font-bold">
            <button
              onClick={() => setSelectedBadgeFilter('ALL')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedBadgeFilter === 'ALL'
                  ? 'soft-pill text-indigo-700 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              onClick={() => setSelectedBadgeFilter('UNLOCKED')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedBadgeFilter === 'UNLOCKED'
                  ? 'soft-pill text-indigo-700 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unlocked ({badges.filter((b) => b.isUnlocked).length})
            </button>
            <button
              onClick={() => setSelectedBadgeFilter('IN_PROGRESS')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedBadgeFilter === 'IN_PROGRESS'
                  ? 'soft-pill text-indigo-700 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({badges.filter((b) => !b.isUnlocked).length})
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((badge) => {
            const percent = Math.min(100, Math.round((badge.userProgress / badge.maxProgress) * 100));

            return (
              <div
                key={badge.id}
                className={`relative rounded-2xl border p-4 transition-all ${
                  badge.isUnlocked
                    ? 'soft-card shadow-sm border-white/80'
                    : 'bg-white/40 border-white/40 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${
                      badge.isUnlocked ? 'icon-tile-amber' : 'bg-slate-200 text-slate-400'
                    } flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    {badge.isUnlocked ? (
                      <Award className="w-6 h-6 text-amber-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-xs text-[#1c1a3b] dark:text-white truncate">{badge.name}</h4>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {badge.tier}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight mt-1 font-medium">
                      {badge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-extrabold">
                        <span className="text-indigo-400">
                          {badge.isUnlocked ? 'Completed' : `${badge.userProgress} / ${badge.maxProgress}`}
                        </span>
                        <span className="text-indigo-700">{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#e2dff4] rounded-full overflow-hidden p-0.5 border border-white/60">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ADOPT-A-MICRO-ZONE MANAGER */}
      <div className="soft-card p-6 space-y-4">
        <div>
          <h3 className="text-xl font-black text-[#1c1a3b] dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Adopt-a-Micro-Zone</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Stake ownership in specific neighborhoods to earn 2x Karma multipliers and direct maintenance alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adoptedZones.map((zone) => (
            <div
              key={zone.id}
              className={`p-4 rounded-2xl border transition-all ${
                zone.isAdoptedByMe
                  ? 'soft-card border-indigo-400 ring-2 ring-indigo-400/40'
                  : 'bg-white/60 border-white/80'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 font-black uppercase">{zone.ward}</span>
                  <h4 className="font-extrabold text-sm text-[#1c1a3b] dark:text-white">{zone.name}</h4>
                </div>
                <span className="px-2.5 py-0.5 icon-tile-amber text-[10px] font-black rounded-full">
                  {zone.karmaMultiplier}x Karma Boost
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3 font-medium">{zone.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-white/60 text-xs">
                <div className="flex items-center gap-3 text-slate-600 text-[11px] font-bold">
                  <span>Hazards: <strong>{zone.activeReportsCount}</strong></span>
                  <span>Resolved: <strong className="text-emerald-600">{zone.resolvedThisMonth}</strong></span>
                </div>

                <button
                  onClick={() => handleToggleZoneAdopt(zone.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    zone.isAdoptedByMe
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                      : 'soft-pill text-indigo-800 hover:bg-white'
                  }`}
                >
                  {zone.isAdoptedByMe ? 'Adopted ✓' : 'Adopt Zone (+50 Karma)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
