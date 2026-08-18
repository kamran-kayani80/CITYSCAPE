import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  Users,
  Utensils,
  Sparkles,
  Scroll,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Landmark,
  Compass,
  MapPin,
  Clock,
  Quote,
  Flame,
  Layers,
  Heart,
  Palette,
  Coffee,
} from 'lucide-react';
import { CityAttractionGroup, FamousPerson, HistoricalEra } from '../data/attractionTypes';

interface CityHistoryCultureHubProps {
  cityData: CityAttractionGroup;
  className?: string;
}

type CultureTab = 'history' | 'personalities' | 'culture' | 'cuisine' | 'timeline';

export const CityHistoryCultureHub: React.FC<CityHistoryCultureHubProps> = ({
  cityData,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<CultureTab>('history');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedPerson, setSelectedPerson] = useState<FamousPerson | null>(() => {
    return cityData.famousFigures && cityData.famousFigures.length > 0
      ? cityData.famousFigures[0]
      : null;
  });

  const cultureProfile = cityData.cultureProfile;
  const famousFigures = cityData.famousFigures || [];
  const historicalTimeline = cityData.historicalTimeline || [];

  return (
    <section
      id="city-history-culture-dossier"
      className={`bg-white dark:bg-[#0A2540] rounded-3xl border-2 border-[#CBD5E1] dark:border-slate-800 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 to-teal-50/40 dark:from-slate-900/60 dark:to-teal-950/30 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A2540] dark:bg-[#006D5B] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-2xs">
              <Scroll className="w-3.5 h-3.5 text-amber-300" />
              <span>Civic Cultural Archive & History</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-[#B45309] dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-300/40">
              <History className="w-3.5 h-3.5" />
              <span>{cityData.demonym} Heritage</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white tracking-tight">
            {cityData.cityName}: Historical Foundations, Culture & Famous Luminaries
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Explore centuries of civilizational heritage, prominent personalities, living folk arts, and culinary traditions.
          </p>
        </div>

        {/* Expand/Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl border border-slate-300 dark:border-slate-700 shadow-2xs transition-all cursor-pointer shrink-0 min-h-[44px]"
        >
          <span>{isExpanded ? 'Minimize Dossier' : 'Expand Full History'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#006D5B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#006D5B]" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 sm:p-7 space-y-6"
          >
            {/* Perspective Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin border-b border-slate-200 dark:border-slate-800">
              {[
                {
                  id: 'history',
                  label: 'Genesis & Deep History',
                  icon: Landmark,
                  badge: 'Origins',
                },
                {
                  id: 'personalities',
                  label: 'Famous People & Luminaries',
                  icon: Users,
                  badge: `${famousFigures.length}`,
                },
                {
                  id: 'culture',
                  label: 'Living Culture & Folk Arts',
                  icon: Palette,
                  badge: 'Crafts',
                },
                {
                  id: 'cuisine',
                  label: 'Culinary Heritage & Food Bazaars',
                  icon: Utensils,
                  badge: `${cultureProfile?.culinaryHeritage?.length || 0}`,
                },
                {
                  id: 'timeline',
                  label: 'Historical Timeline',
                  icon: Clock,
                  badge: `${historicalTimeline.length} Eras`,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`culture-tab-${tab.id}`}
                    type="button"
                    onClick={() => setActiveTab(tab.id as CultureTab)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 min-h-[44px] border-2 ${
                      isActive
                        ? 'bg-[#0A2540] dark:bg-[#006D5B] text-white border-[#0A2540] dark:border-teal-300 shadow-xs scale-101'
                        : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#006D5B]'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#006D5B]'}`} />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-lg font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: GENESIS & DEEP CITY HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#B45309] text-white">
                      <Landmark className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#B45309] dark:text-amber-300 uppercase tracking-wider">
                        The Genesis & Historical Evolution of {cityData.cityName}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Geographical crossroads, indigenous foundations, and regional influence.
                      </p>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                    {cityData.cityGenesisAndHistory || cityData.description}
                  </p>
                </div>

                {/* Cultural Essence Overview */}
                {cultureProfile?.culturalEssence && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border-2 border-teal-200 dark:border-teal-900/50 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#006D5B] text-white">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#006D5B] dark:text-teal-300 uppercase tracking-wider">
                        The Cultural Soul of {cityData.demonym}s
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                      {cultureProfile.culturalEssence}
                    </p>
                  </div>
                )}

                {/* Languages Matrix */}
                {cultureProfile?.languagesAndDialects && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#006D5B]" />
                      Languages & Dialects of the City:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {cultureProfile.languagesAndDialects.map((lang, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 shadow-2xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: FAMOUS PEOPLE & HISTORICAL LUMINARIES */}
            {activeTab === 'personalities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Celebrated Personalities & Historical Figures
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Visionaries, warriors, poets, humanitarians, and artists who shaped {cityData.cityName}.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#006D5B] bg-teal-50 dark:bg-teal-950/40 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800">
                    {famousFigures.length} Curated Luminaries
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Personalities Selection Grid (Left 5 Cols) */}
                  <div className="md:col-span-5 space-y-3">
                    {famousFigures.map((person) => {
                      const isSelected = selectedPerson?.id === person.id;
                      return (
                        <div
                          key={person.id}
                          id={`famous-person-card-${person.id}`}
                          onClick={() => setSelectedPerson(person)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1.5 ${
                            isSelected
                              ? 'bg-[#0A2540] text-white border-[#0A2540] dark:bg-[#006D5B] dark:border-teal-400 shadow-md scale-101'
                              : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                                isSelected
                                  ? 'bg-amber-400 text-slate-900'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {person.field}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                isSelected ? 'text-teal-200' : 'text-slate-500'
                              }`}
                            >
                              {person.lifespanOrEra}
                            </span>
                          </div>

                          <h4 className="text-base font-extrabold leading-tight">
                            {person.name}
                          </h4>
                          {person.localName && (
                            <p
                              className={`text-xs font-serif ${
                                isSelected ? 'text-amber-200' : 'text-[#006D5B] dark:text-teal-300'
                              }`}
                            >
                              {person.localName}
                            </p>
                          )}
                          <p
                            className={`text-xs font-medium line-clamp-1 ${
                              isSelected ? 'text-slate-200' : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {person.role}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Personality In-Depth Spotlight (Right 7 Cols) */}
                  <div className="md:col-span-7">
                    {selectedPerson ? (
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border-2 border-slate-300 dark:border-slate-700 space-y-4">
                        {/* Person Header */}
                        <div className="space-y-1 pb-4 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-[#006D5B] text-white text-xs font-black rounded-xl">
                              {selectedPerson.field}
                            </span>
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-[#B45309] dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-300/40">
                              {selectedPerson.lifespanOrEra}
                            </span>
                          </div>
                          <h4 className="text-2xl font-black text-[#0A2540] dark:text-white mt-1">
                            {selectedPerson.name}
                          </h4>
                          {selectedPerson.localName && (
                            <p className="text-base font-serif text-[#006D5B] dark:text-teal-300 font-semibold">
                              {selectedPerson.localName}
                            </p>
                          )}
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {selectedPerson.role}
                          </p>
                        </div>

                        {/* Biography */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Historical Biography:
                          </span>
                          <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                            {selectedPerson.biography}
                          </p>
                        </div>

                        {/* Key Historical Contributions */}
                        <div className="space-y-2">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Key Contributions & Achievements:
                          </span>
                          <div className="space-y-1.5">
                            {selectedPerson.famousContributions.map((c, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200"
                              >
                                <span className="w-5 h-5 rounded-full bg-[#006D5B] text-white font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                                  ✓
                                </span>
                                <span className="leading-relaxed">{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Civic Legacy */}
                        <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-[#006D5B] dark:text-teal-300 flex items-center gap-1.5">
                            <Award className="w-4 h-4" />
                            Enduring Civic Legacy:
                          </span>
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                            {selectedPerson.civicLegacy}
                          </p>
                        </div>

                        {/* Famous Quote */}
                        {selectedPerson.famousQuote && (
                          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                            <Quote className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm italic font-serif text-slate-800 dark:text-slate-200 font-medium">
                              "{selectedPerson.famousQuote}"
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                          Select a historical figure on the left to read their detailed civic profile.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVING CULTURE & FOLK CRAFTS */}
            {activeTab === 'culture' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Living Folk Traditions */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#006D5B] text-white">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                      <h3 className="text-base font-black text-[#0A2540] dark:text-white">
                        Living Traditions & Daily Customs
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {cultureProfile?.livingTraditions?.map((trad, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#B45309] text-white font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{trad}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Folk Crafts & Artisanal Heritage */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#B45309] text-white">
                        <Palette className="w-4 h-4 text-amber-200" />
                      </div>
                      <h3 className="text-base font-black text-[#0A2540] dark:text-white">
                        Indigenous Folk Crafts & Guilds
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {cultureProfile?.folkCrafts?.map((craft, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#006D5B] text-white font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                            ✦
                          </span>
                          <span className="leading-relaxed">{craft}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Festivals & Civic Rhythms */}
                {cultureProfile?.festivalsAndCivicRhythms && (
                  <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-[#B45309]" />
                      <h3 className="text-base font-black text-[#B45309] dark:text-amber-300 uppercase tracking-wider">
                        Annual Festivals & Seasonal Civic Rhythms
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cultureProfile.festivalsAndCivicRhythms.map((fest, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                        >
                          <span className="text-[#B45309] font-black">●</span>
                          <span>{fest}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Literary & Musical Heritage */}
                {cultureProfile?.literaryAndMusicalHeritage && (
                  <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#006D5B] dark:text-teal-300 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Literary & Musical Tradition:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      {cultureProfile.literaryAndMusicalHeritage}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CULINARY HERITAGE & FOOD BAZAARS */}
            {activeTab === 'cuisine' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Iconic Culinary Heritage of {cityData.cityName}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Century-old breakfast stews, festive breads, regional teas, and famous street food hubs.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#B45309] bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Food Street Lore</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cultureProfile?.culinaryHeritage?.map((dish, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4 hover:border-[#006D5B] transition-all shadow-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="w-7 h-7 rounded-xl bg-[#006D5B] text-white font-bold flex items-center justify-center text-xs shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] font-bold text-[#B45309] dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/50">
                            Authentic
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-[#0A2540] dark:text-white leading-tight">
                            {dish.dishName}
                          </h4>
                          {dish.localName && (
                            <p className="text-xs font-serif text-[#006D5B] dark:text-teal-300 font-semibold mt-0.5">
                              {dish.localName}
                            </p>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          {dish.description}
                        </p>

                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
                          <strong className="text-[#0A2540] dark:text-white block mb-0.5">
                            Heritage Story:
                          </strong>
                          {dish.heritageStory}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-bold text-[#006D5B] dark:text-teal-300">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{dish.famousHub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: HISTORICAL TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-[#0A2540] dark:text-white">
                      Chronological Heritage Timeline
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Major eras that shaped the architectural and civic fabric of {cityData.cityName}.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#0A2540] dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">
                    {historicalTimeline.length} Chronological Eras
                  </span>
                </div>

                <div className="relative border-l-3 border-[#006D5B] dark:border-teal-500 ml-4 sm:ml-6 space-y-6 pl-5 sm:pl-8 py-2">
                  {historicalTimeline.map((era, index) => (
                    <div key={index} className="relative space-y-2">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] sm:-left-[43px] top-1 w-5 h-5 rounded-full bg-[#006D5B] text-white border-4 border-white dark:border-[#0A2540] flex items-center justify-center text-[10px] font-bold shadow-xs">
                        {index + 1}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-[#B45309] text-white text-xs font-black rounded-xl">
                          {era.period}
                        </span>
                        <h4 className="text-base font-extrabold text-[#0A2540] dark:text-white">
                          {era.eraTitle}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {era.summary}
                      </p>

                      {era.civicMilestones && era.civicMilestones.length > 0 && (
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Key Civic Milestones:
                          </span>
                          {era.civicMilestones.map((m, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs font-medium text-slate-800 dark:text-slate-200"
                            >
                              <span className="text-[#006D5B] font-black">✦</span>
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
