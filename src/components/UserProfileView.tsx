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
  Camera,
  Upload,
  Edit3,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { UserProfile, Badge, AdoptedZone, Report } from '../types';
import { GoogleAuthButton } from './GoogleAuthButton';

interface UserProfileViewProps {
  onSelectReport?: (report: Report) => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

const PRESET_AVATARS = [
  {
    name: 'Civic Sentinel',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Eco Guardian',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Ward Leader',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Public Works Lead',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Community Historian',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Neighborhood Watch',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  },
];

const SUGGESTED_USERNAMES = [
  'clean_street_hero',
  'ward4_sentinel',
  'civic_leader_sf',
  'eco_neighborhood',
  'resident_civic',
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onSelectReport, onProfileUpdate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<(Badge & { userProgress: number; unlockedAt?: string; isUnlocked: boolean })[]>([]);
  const [adoptedZones, setAdoptedZones] = useState<AdoptedZone[]>([]);
  const [resolvedUserReports, setResolvedUserReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<'ALL' | 'UNLOCKED' | 'IN_PROGRESS'>('ALL');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [titleSuccessMsg, setTitleSuccessMsg] = useState(false);

  // Profile & Avatar Editing State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

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
        setEditFullName(pData.profile.fullName || '');
        setEditUsername(pData.profile.username || '');
        setEditAvatarUrl(pData.profile.avatarUrl || '');
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

  const handleOpenEditModal = () => {
    if (profile) {
      setEditFullName(profile.fullName);
      setEditUsername(profile.username);
      setEditAvatarUrl(profile.avatarUrl);
    }
    setIsEditModalOpen(true);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editUsername.trim() || !editFullName.trim()) {
      alert('Please enter both a name and username.');
      return;
    }

    setIsSaving(true);
    try {
      const cleanUsername = editUsername.trim().replace(/^@/, '');
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editFullName.trim(),
          username: cleanUsername,
          avatarUrl: editAvatarUrl.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setIsEditModalOpen(false);
        setUpdateMessage(`Profile updated! Username set to @${data.profile.username}`);
        setTimeout(() => setUpdateMessage(null), 3500);

        if (onProfileUpdate) {
          onProfileUpdate(data.profile);
        }
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
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
        if (onProfileUpdate) {
          onProfileUpdate(data.profile);
        }
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
          if (onProfileUpdate) {
            onProfileUpdate(data.userProfile);
          }
        }
      }
    } catch (err) {
      console.error('Failed to adopt zone:', err);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 animate-pulse font-['Montserrat']">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300 font-['Montserrat']">
      {/* Toast feedback banner */}
      {updateMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg font-extrabold text-xs flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-[#CCFF00]" />
            <span>{updateMessage}</span>
          </div>
          <button onClick={() => setUpdateMessage(null)} className="p-1 text-white/80 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. HERO CIVIC RESIDENT PASSPORT (Official Municipal Civic Identity Card) */}
      <div className="bg-[#0A2540] rounded-2xl p-6 sm:p-8 relative overflow-hidden border-2 border-[#006D5B] text-white shadow-xl">
        {/* Subtle Civic Arch Guilloché & Geometric Watermark */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#006D5B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-[#B45309]/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Top Municipal Header Ribbon */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#006D5B]/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#006D5B] text-amber-300 rounded-xl border border-teal-400/30 shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400">
                Official Municipal Identity Document
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                CITYSCAPE CIVIC RESIDENT PASSPORT
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-300 bg-[#071B2F] px-3 py-1.5 rounded-xl border border-[#CBD5E1]/30">
              DOC ID: #CS-{profile.username ? profile.username.toUpperCase() : 'RESIDENT'}-2026
            </span>
            <span className="px-3 py-1.5 bg-[#006D5B] text-white rounded-xl text-xs font-bold border border-teal-300/40 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Neighbor</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Avatar & Title / Name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group cursor-pointer" onClick={handleOpenEditModal} title="Click to upload picture or edit profile">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl object-cover ring-3 ring-[#006D5B] shadow-2xl transition-transform group-hover:scale-105 border-2 border-white/20"
              />
              <div className="absolute inset-0 bg-[#0A2540]/80 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-amber-300" />
                <span className="text-[10px] font-bold uppercase mt-1">Change</span>
              </div>
              <span className="absolute -bottom-2 -right-2 p-1.5 bg-[#B45309] text-white rounded-xl shadow-md border border-amber-300/40">
                <Award className="w-4 h-4 stroke-[2.5]" />
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.fullName}
                </h1>
                <span className="text-xs font-mono font-bold text-teal-200 bg-[#071B2F] px-3 py-1 rounded-xl border border-[#006D5B]">
                  @{profile.username}
                </span>

                {/* Edit Profile & Upload Picture Button */}
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border border-amber-400/40 min-h-[40px]"
                  title="Upload picture as avatar and change username"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                  <span>Edit Profile & Avatar</span>
                </button>
              </div>

              {/* Title Selector Dropdown */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs text-slate-300 font-bold">Civic Title:</span>
                <select
                  value={selectedTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-[#071B2F] border-1.5 border-[#006D5B] text-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-[#006D5B]"
                >
                  {profile.unlockedTitles.map((t) => (
                    <option key={t} value={t} className="bg-[#0A2540] text-white">
                      🎖️ {t}
                    </option>
                  ))}
                </select>
                {titleSuccessMsg && (
                  <span className="text-[11px] text-emerald-400 font-bold animate-pulse">
                    ✓ Updated!
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 font-semibold">
                <span className="flex items-center gap-1.5 bg-[#071B2F]/80 px-2.5 py-1 rounded-lg border border-[#CBD5E1]/20">
                  <MapPin className="w-3.5 h-3.5 text-teal-300" />
                  <span>{profile.neighborhoodName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 bg-[#071B2F]/80 px-2.5 py-1 rounded-lg border border-[#CBD5E1]/20">
                  <Calendar className="w-3.5 h-3.5 text-teal-300" />
                  <span>Resident since {profile.joinedDate}</span>
                </span>
              </div>

              {/* Google Account Status Badge */}
              <div className="pt-1">
                <GoogleAuthButton
                  currentUserProfile={profile}
                  onAuthChange={(updated) => {
                    setProfile(updated);
                    if (onProfileUpdate) onProfileUpdate(updated);
                  }}
                  variant="profile"
                />
              </div>
            </div>
          </div>

          {/* Civic Karma & Trust Score Module */}
          <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 p-5 bg-[#071B2F] rounded-2xl border-1.5 border-[#006D5B] shadow-inner">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#B45309]/30 border border-amber-400/40 text-amber-400 rounded-2xl">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  {profile.civicKarma}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Civic Karma Points
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <span>Civic Trust Rating:</span>
              <span className="px-3 py-1 bg-[#006D5B] text-white border border-teal-400/40 rounded-full font-mono font-bold text-xs">
                {profile.trustScore}% Verified
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#006D5B]/30 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-200 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next Civic Tier: Civic Sentinel</span>
            </span>
            <span className="font-mono">{profile.civicKarma} / 1200 XP</span>
          </div>
          <div className="w-full h-3 bg-[#071B2F] rounded-full overflow-hidden p-0.5 border border-[#006D5B]/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#006D5B] to-[#B45309] shadow-sm transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((profile.civicKarma / 1200) * 100))}%` }}
            />
          </div>
        </div>

        {/* Impact Statistics Grid (Brand Cohesive 6-Tile Layout) */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-[#071B2F] rounded-xl border-1.5 border-[#006D5B]/50 hover:border-[#006D5B] transition-colors">
            <div className="text-[11px] font-bold text-slate-300">Reports Logged</div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {profile.impactStats.reportsResolved} / {profile.impactStats.reportsSubmitted}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">78% Resolved</div>
          </div>

          <div className="p-3.5 bg-[#071B2F] rounded-xl border-1.5 border-[#006D5B]/50 hover:border-[#006D5B] transition-colors">
            <div className="text-[11px] font-bold text-slate-300">Ground Checks</div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {profile.impactStats.verificationsCount}
            </div>
            <div className="text-[10px] text-teal-300 font-bold mt-0.5">Verified Local</div>
          </div>

          <div className="p-3.5 bg-[#071B2F] rounded-xl border-1.5 border-[#006D5B]/50 hover:border-[#006D5B] transition-colors">
            <div className="text-[11px] font-bold text-slate-300">Upvotes Rec'd</div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {profile.impactStats.upvotesReceived}
            </div>
            <div className="text-[10px] text-amber-300 font-bold mt-0.5">Endorsements</div>
          </div>

          <div className="p-3.5 bg-[#071B2F] rounded-xl border-1.5 border-[#006D5B]/50 hover:border-[#006D5B] transition-colors">
            <div className="text-[11px] font-bold text-slate-300">Upvotes Given</div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {profile.impactStats.upvotesGiven}
            </div>
            <div className="text-[10px] text-teal-200 font-bold mt-0.5">Community</div>
          </div>

          <div className="p-3.5 bg-[#071B2F] rounded-xl border-1.5 border-[#006D5B]/50 hover:border-[#006D5B] transition-colors">
            <div className="text-[11px] font-bold text-slate-300">Hours Saved</div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {profile.impactStats.estHoursSaved} hrs
            </div>
            <div className="text-[10px] text-amber-200 font-bold mt-0.5">Prevention</div>
          </div>

          <div className="p-3.5 bg-[#071B2F] rounded-xl border-1.5 border-[#006D5B]/50 hover:border-[#006D5B] transition-colors">
            <div className="text-[11px] font-bold text-slate-300">Civic Value</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
              ${profile.impactStats.civicValueCreatedUsd.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-300 font-bold mt-0.5">Public Goods</div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE & AVATAR UPLOAD MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto font-['Montserrat']">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#006D5B] text-amber-300 rounded-xl shadow-xs">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Customize Civic Profile
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Upload avatar picture and select username</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col min-h-0 overflow-hidden text-xs">
              <div className="p-5 space-y-5 overflow-y-auto flex-1 max-h-[calc(92vh-130px)]">
                {/* 1. Avatar Picture Upload & Selection */}
                <div className="space-y-3">
                  <label className="font-extrabold text-slate-900 dark:text-white block text-xs uppercase tracking-wider">
                    1. Profile Picture / Avatar
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="relative shrink-0">
                      <img
                        src={editAvatarUrl || profile.avatarUrl}
                        alt="Avatar Preview"
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#006D5B] shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 p-1 bg-[#006D5B] text-amber-300 rounded-lg text-[9px] font-black">
                        PREVIEW
                      </span>
                    </div>

                    <div className="space-y-2 w-full">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#006D5B] hover:bg-[#005244] text-white font-bold rounded-xl cursor-pointer shadow-xs transition-all text-xs min-h-[44px]">
                        <Upload className="w-4 h-4 text-amber-300" />
                        <span>Upload Picture from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="text-[10px] text-slate-500 text-center sm:text-left font-medium">
                        Supports PNG, JPG, WEBP (Max 8MB).
                      </div>
                    </div>
                  </div>

                  {/* Preset Avatar Selection */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      Or Select a Pre-Curated Civic Avatar:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setEditAvatarUrl(preset.url)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer aspect-square ${
                            editAvatarUrl === preset.url
                              ? 'border-[#006D5B] ring-2 ring-[#006D5B]'
                              : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                          }`}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image URL fallback input */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">
                      Direct Image Web Link:
                    </span>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-800" />

                {/* 2. Resident Name & Username Selector */}
                <div className="space-y-4">
                  <label className="font-extrabold text-slate-900 dark:text-white block text-xs uppercase tracking-wider">
                    2. Resident Identity & Username
                  </label>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Full Display Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kaamika Yani"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#006D5B] rounded-xl outline-none font-bold text-slate-900 dark:text-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Civic Username Handle (@)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-black text-[#006D5B] text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="resident_username"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value.replace(/\s+/g, '_'))}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#006D5B] rounded-xl outline-none font-mono font-bold text-slate-900 dark:text-white min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Suggested Usernames */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                      Quick Handle Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_USERNAMES.map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => setEditUsername(handle)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#006D5B] hover:text-white dark:bg-slate-800 dark:hover:bg-[#006D5B] text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-colors"
                        >
                          @{handle}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer - Sticky */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-end space-x-3 shrink-0 sticky bottom-0 z-20">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-soft-tactile px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary-designer px-6 py-2.5 rounded-2xl text-xs font-black cursor-pointer min-h-[44px] flex items-center space-x-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-amber-300" />
                  )}
                  <span>Save Profile & Avatar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ACTIVITY HEATMAP GRID (Soft Tactile Card) */}
      <div className="soft-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-heading font-black text-[#051F20] dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#006D5B]" />
              <span>Civic Action Contribution Grid</span>
            </h3>
            <p className="text-xs text-[#111827] dark:text-slate-200 font-bold">Daily reports, verifications, and discussions logged over the last 6 months.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#051F20] font-bold">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-[#e2dff4]" />
            <span className="w-3 h-3 rounded bg-teal-300" />
            <span className="w-3 h-3 rounded bg-[#006D5B]" />
            <span className="w-3 h-3 rounded bg-[#0A2540]" />
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[650px]">
            {heatmapDays.map((day, idx) => {
              const bgClasses = [
                'bg-[#e2dff4]',
                'bg-teal-300',
                'bg-[#006D5B] text-white',
                'bg-[#0A2540] text-white',
                'bg-emerald-800 text-white',
              ];
              return (
                <div
                  key={idx}
                  title={`${day.date}: ${day.intensity} civic actions`}
                  className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 hover:ring-2 hover:ring-[#006D5B] cursor-pointer ${bgClasses[day.intensity]}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. IMPACT PORTFOLIO GRID ("Before & After" Showcase Cards) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-[#051F20] dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Impact Portfolio: Before & After Proof</span>
          </h3>
          <p className="text-xs text-[#111827] dark:text-slate-200 font-bold">
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
                  <span className="text-[10px] font-mono text-[#006D5B] font-bold uppercase">#{report.id}</span>
                  <h4 className="font-extrabold text-[#051F20] dark:text-white text-sm line-clamp-1">{report.title}</h4>
                  <p className="text-xs text-[#006D5B] font-bold">{report.addressText}</p>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-300">
                  RESOLVED
                </span>
              </div>

              {/* Side-by-side Before & After comparison */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
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
                <p className="text-xs text-[#051F20] italic soft-inset p-3 border border-slate-200 font-medium">
                  "{report.officialNote}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. CIVIC BADGES & MILESTONES DRAWER */}
      <div className="soft-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-black text-[#051F20] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Civic Badges & Quality Milestones</span>
            </h3>
            <p className="text-xs text-[#111827] dark:text-slate-200 font-bold">Earned through quality verifications and constructive follow-through.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedBadgeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[36px] ${
                selectedBadgeFilter === 'ALL'
                  ? 'bg-[#006D5B] text-white font-black shadow-xs'
                  : 'text-[#051F20] dark:text-slate-200 hover:text-[#006D5B]'
              }`}
            >
              All ({badges.length})
            </button>
            <button
              onClick={() => setSelectedBadgeFilter('UNLOCKED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[36px] ${
                selectedBadgeFilter === 'UNLOCKED'
                  ? 'bg-[#006D5B] text-white font-black shadow-xs'
                  : 'text-[#051F20] dark:text-slate-200 hover:text-[#006D5B]'
              }`}
            >
              Unlocked ({badges.filter((b) => b.isUnlocked).length})
            </button>
            <button
              onClick={() => setSelectedBadgeFilter('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[36px] ${
                selectedBadgeFilter === 'IN_PROGRESS'
                  ? 'bg-[#006D5B] text-white font-black shadow-xs'
                  : 'text-[#051F20] dark:text-slate-200 hover:text-[#006D5B]'
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
