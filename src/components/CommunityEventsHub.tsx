import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CreditCard,
  Plus,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  ExternalLink,
  ShieldCheck,
  Megaphone,
  DollarSign,
  TrendingUp,
  Tag,
  Star,
  Flame,
  ArrowUpRight,
  Share2,
} from 'lucide-react';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  organizerName: string;
  organizerType: 'Local Business' | 'Community Org' | 'City Dept' | 'Resident';
  category: 'Farmers Market' | 'Cleanup Drive' | 'Workshop' | 'Block Party' | 'Townhall' | 'Business Special';
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  isSponsored: boolean;
  sponsorBadgeText?: string;
  adTier?: 'Free' | 'Featured 3-Day' | 'Platinum Banner';
  rsvpsCount: number;
  userHasRsvped?: boolean;
  externalLink?: string;
  price?: string;
  createdAt: string;
}

const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-101',
    title: 'Mission District Saturday Organic Farmers Market & Artisan Craft Fair',
    description: 'Fresh local produce, live acoustic music, local honey, and eco-craft vendors. 15% discount for civic volunteers!',
    organizerName: 'Mission Merchant Alliance',
    organizerType: 'Local Business',
    category: 'Farmers Market',
    date: 'Saturday, Aug 1, 2026',
    time: '9:00 AM - 2:00 PM',
    location: '24th St & Capp St Plaza, San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
    isSponsored: true,
    sponsorBadgeText: 'FEATURED LOCAL BUSINESS SPONSOR',
    adTier: 'Featured 3-Day',
    rsvpsCount: 184,
    price: 'Free Entry',
    externalLink: 'https://example.com/farmers-market',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-102',
    title: 'Golden Gate Park Community Tree Planting & Eco-Mulching Drive',
    description: 'Join 50+ local neighbors to plant 30 native oak saplings and clear invasive ivy. Gloves and tools provided.',
    organizerName: 'SF Urban Forestry Coalition',
    organizerType: 'Community Org',
    category: 'Cleanup Drive',
    date: 'Sunday, Aug 2, 2026',
    time: '10:00 AM - 1:00 PM',
    location: 'GGP Botanical Gardens West Lawn, CA',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    isSponsored: false,
    rsvpsCount: 92,
    price: 'Free Volunteer Event',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-103',
    title: 'Civic Coffee House & Co-Working: Grand Opening & Free Roast Tasting',
    description: 'Celebrating 10 years on 5th Street! Free espresso tasting for all active CITYSCAPE members and local city staff.',
    organizerName: 'Artisan Roastery & Bakery',
    organizerType: 'Local Business',
    category: 'Business Special',
    date: 'Friday, Aug 7, 2026',
    time: '8:00 AM - 12:00 PM',
    location: '542 Howard St, San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    isSponsored: true,
    sponsorBadgeText: 'PLATINUM ADVERTISER',
    adTier: 'Platinum Banner',
    rsvpsCount: 230,
    price: 'Free Coffee with App',
    externalLink: 'https://example.com/artisan-coffee',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'evt-104',
    title: 'District 6 Public Works Townhall: Traffic Calming & Pothole Budget 2027',
    description: 'Direct Q&A session with city engineers regarding speed hump installations, bike lane safety, and road resurfacing.',
    organizerName: 'SF Dept of Transportation',
    organizerType: 'City Dept',
    category: 'Townhall',
    date: 'Wednesday, Aug 12, 2026',
    time: '6:30 PM - 8:30 PM',
    location: 'Civic Auditorium Room B, San Francisco, CA',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    isSponsored: false,
    rsvpsCount: 145,
    price: 'Public Entry',
    createdAt: new Date().toISOString(),
  },
];

interface CommunityEventsHubProps {
  onAwardKarma?: (amount: number, reason: string) => void;
}

export const CommunityEventsHub: React.FC<CommunityEventsHubProps> = ({ onAwardKarma }) => {
  const [events, setEvents] = useState<CommunityEvent[]>(INITIAL_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHireAdModalOpen, setIsHireAdModalOpen] = useState(false);

  // Hire Event Ad Form State
  const [adTitle, setAdTitle] = useState('');
  const [adOrganizerName, setAdOrganizerName] = useState('');
  const [adOrganizerType, setAdOrganizerType] = useState<CommunityEvent['organizerType']>('Local Business');
  const [adCategory, setAdCategory] = useState<CommunityEvent['category']>('Business Special');
  const [adDate, setAdDate] = useState('Saturday, Aug 15, 2026');
  const [adTime, setAdTime] = useState('11:00 AM - 4:00 PM');
  const [adLocation, setAdLocation] = useState('780 Market St, San Francisco, CA');
  const [adDescription, setAdDescription] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adExternalLink, setAdExternalLink] = useState('https://');
  const [adPrice, setAdPrice] = useState('Free Admission');

  // Ad Tier & Payment State
  const [selectedAdTier, setSelectedAdTier] = useState<'Free' | 'Featured 3-Day' | 'Platinum Banner'>('Featured 3-Day');
  const [cardName, setCardName] = useState('Main Street Cafe & Bakery');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [adSuccessMsg, setAdSuccessMsg] = useState('');

  const categories = ['ALL', 'Sponsored Ads', 'Farmers Market', 'Cleanup Drive', 'Business Special', 'Workshop', 'Townhall'];

  // Filter Events
  const filteredEvents = events.filter((evt) => {
    if (selectedCategory === 'Sponsored Ads') {
      return evt.isSponsored;
    }
    const matchesCat = selectedCategory === 'ALL' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sponsoredEvents = events.filter((e) => e.isSponsored);

  const handleToggleRsvp = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const newRsvp = !targetEvent.userHasRsvped;

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            userHasRsvped: newRsvp,
            rsvpsCount: newRsvp ? evt.rsvpsCount + 1 : evt.rsvpsCount - 1,
          };
        }
        return evt;
      })
    );

    if (newRsvp && onAwardKarma) {
      onAwardKarma(15, 'RSVPing to Community Event');
    }
  };

  const handleHireAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adOrganizerName || !adDescription) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const isSponsoredTier = selectedAdTier !== 'Free';
      const newEvent: CommunityEvent = {
        id: `evt-${Date.now()}`,
        title: adTitle,
        description: adDescription,
        organizerName: adOrganizerName,
        organizerType: adOrganizerType,
        category: adCategory,
        date: adDate,
        time: adTime,
        location: adLocation,
        imageUrl:
          adImageUrl ||
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        isSponsored: isSponsoredTier,
        sponsorBadgeText:
          selectedAdTier === 'Platinum Banner'
            ? 'PLATINUM ADVERTISER'
            : selectedAdTier === 'Featured 3-Day'
            ? 'FEATURED LOCAL SPONSOR'
            : undefined,
        adTier: selectedAdTier,
        rsvpsCount: 1,
        userHasRsvped: true,
        price: adPrice,
        externalLink: adExternalLink,
        createdAt: new Date().toISOString(),
      };

      setEvents([newEvent, ...events]);
      setAdSuccessMsg(`🎉 Event Ad Published Successfully! (${selectedAdTier} Active)`);

      setTimeout(() => {
        setIsHireAdModalOpen(false);
        setAdSuccessMsg('');

        // Reset form
        setAdTitle('');
        setAdDescription('');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#004d4d] to-slate-900 text-white rounded-3xl shadow-xl border border-[#008080]/60 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-['Montserrat']">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Megaphone className="w-3 h-3 text-amber-300" />
              LOCAL EVENT HUB & BUSINESS MARKETPLACE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            Community Events & Local Business Ads
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover neighborhood cleanups, farmers markets, and local merchant specials. Local businesses can hire featured ad space to promote community events!
          </p>
        </div>

        <button
          onClick={() => setIsHireAdModalOpen(true)}
          className="relative z-10 px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer shrink-0 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post Event / Hire Ad Space</span>
        </button>

        {/* Background Ambient Light */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* SPONSORED EVENT AD SHOWCASE CAROUSEL */}
      {sponsoredEvents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-sm font-heading font-black uppercase tracking-wider text-[#1c1a3b] dark:text-white">
                Featured Sponsored Events & Local Merchant Ads
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">Promoted by Local Businesses</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sponsoredEvents.map((evt) => (
              <div
                key={evt.id}
                className="relative rounded-3xl p-5 bg-gradient-to-br from-[#003333] via-[#004d4d] to-slate-900 text-white shadow-xl border-2 border-amber-400/80 space-y-4 overflow-hidden"
              >
                {/* Sponsor Ribbon */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    {evt.sponsorBadgeText || 'SPONSORED EVENT'}
                  </span>

                  <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {evt.price}
                  </span>
                </div>

                {/* Event Image & Info */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 h-36 rounded-2xl overflow-hidden bg-slate-800">
                    <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="sm:col-span-7 space-y-2">
                    <h3 className="font-heading font-black text-base text-white leading-snug line-clamp-2">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="text-[11px] text-amber-200/90 space-y-0.5 font-medium">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{evt.date} • {evt.time}</span>
                      </p>
                      <p className="flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{evt.location}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                    <Users className="w-3.5 h-3.5 text-amber-300" />
                    <span><strong>{evt.rsvpsCount}</strong> Attending</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {evt.externalLink && (
                      <a
                        href={evt.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>Visit Website</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleRsvp(evt.id)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        evt.userHasRsvped
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                      }`}
                    >
                      {evt.userHasRsvped ? '✓ Going' : 'RSVP Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & SEARCH ROW */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#008080] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Community Events' : cat}
            </button>
          ))}
        </div>

        <div className="relative shrink-0 sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events & venues..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008080]"
          />
        </div>
      </div>

      {/* MAIN EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className={`soft-card p-4 space-y-4 flex flex-col justify-between hover:shadow-xl transition-all border ${
              evt.isSponsored
                ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20'
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="space-y-3">
              {/* Event Image */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />

                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-1 bg-slate-900/80 text-white backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider">
                    {evt.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 text-[#008080] dark:text-[#CCFF00] backdrop-blur-md rounded-xl text-[10px] font-extrabold shadow-md">
                  {evt.price}
                </div>
              </div>

              {/* Event Meta */}
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-[#008080] dark:text-[#CCFF00] mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{evt.date} • {evt.time}</span>
                </div>

                <h3 className="font-['Montserrat'] font-extrabold text-base text-[#1A1A1A] dark:text-white line-clamp-2">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5">
                  {evt.description}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-2 line-clamp-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{evt.location}</span>
                </p>
              </div>
            </div>

            {/* Organizer & RSVP */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-[#1A1A1A] dark:text-white line-clamp-1">
                  {evt.organizerName}
                </p>
                <p className="text-[9px] font-semibold text-slate-400">{evt.organizerType}</p>
              </div>

              <button
                onClick={() => handleToggleRsvp(evt.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  evt.userHasRsvped
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#008080] hover:bg-[#006666] text-[#CCFF00] shadow-xs'
                }`}
              >
                {evt.userHasRsvped ? '✓ Going' : 'RSVP'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POST EVENT / HIRE AD SPACE MODAL */}
      {isHireAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto font-['Montserrat']">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-[#008080]/30 dark:border-slate-800 overflow-hidden my-auto p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#008080] text-white flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5 text-[#CCFF00]" />
                </div>
                <div>
                  <h3 className="font-['Montserrat'] font-black text-base text-[#1A1A1A] dark:text-white">
                    Post Community Event & Hire Ad Space
                  </h3>
                  <p className="text-[11px] text-slate-500">Promote local business specials or community cleanups</p>
                </div>
              </div>

              <button
                onClick={() => setIsHireAdModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Select Ad Tier */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Choose Promotion Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAdTier('Free')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedAdTier === 'Free'
                      ? 'bg-[#008080]/10 dark:bg-[#008080]/20 border-[#008080] ring-2 ring-[#008080]/30'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block text-[10px] font-black uppercase text-slate-500">Basic</span>
                  <span className="block font-['Montserrat'] font-extrabold text-sm text-[#1A1A1A] dark:text-white">Free</span>
                  <span className="block text-[10px] text-slate-500">Standard feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAdTier('Featured 3-Day')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedAdTier === 'Featured 3-Day'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-400/40'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block text-[10px] font-black uppercase text-amber-600">Popular</span>
                  <span className="block font-['Montserrat'] font-extrabold text-sm text-[#1A1A1A] dark:text-white">$15.00</span>
                  <span className="block text-[10px] text-slate-500">3-Day Highlight</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAdTier('Platinum Banner')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedAdTier === 'Platinum Banner'
                      ? 'bg-[#003333] text-white border-[#008080] ring-2 ring-[#CCFF00]'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="block text-[10px] font-black uppercase text-[#CCFF00]">Platinum</span>
                  <span className="block font-['Montserrat'] font-extrabold text-sm">$49.00</span>
                  <span className="block text-[10px] opacity-80">Top Banner Ad</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleHireAdSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Event / Special Offer Title
                </label>
                <input
                  type="text"
                  required
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="e.g. Saturday Artisan Bakery Tasting & Local Craft Fair"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Business / Organizer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={adOrganizerName}
                    onChange={(e) => setAdOrganizerName(e.target.value)}
                    placeholder="e.g. Mission Street Bakery"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={adCategory}
                    onChange={(e) => setAdCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="Business Special">Business Special</option>
                    <option value="Farmers Market">Farmers Market</option>
                    <option value="Cleanup Drive">Cleanup Drive</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Townhall">Townhall</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Event Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    value={adDate}
                    onChange={(e) => setAdDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Venue Address / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={adLocation}
                    onChange={(e) => setAdLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Event Description & Offer Details
                </label>
                <textarea
                  required
                  rows={3}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="Describe your event, discount for civic app users, or special activities..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-sans"
                />
              </div>

              {/* Payment Info if Hiring Ad Space */}
              {selectedAdTier !== 'Free' && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>Hire Ad Space Payment ({selectedAdTier})</span>
                    </span>
                    <span className="text-sm font-black">
                      {selectedAdTier === 'Featured 3-Day' ? '$15.00' : '$49.00'} USD
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Business Name on Card"
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              {adSuccessMsg && (
                <p className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black text-center border border-emerald-300">
                  {adSuccessMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-[#008080] hover:bg-[#006666] text-[#CCFF00] rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                <span>
                  {selectedAdTier === 'Free'
                    ? 'Publish Free Event'
                    : `Authorize ${selectedAdTier === 'Featured 3-Day' ? '$15.00' : '$49.00'} & Publish Ad`}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
