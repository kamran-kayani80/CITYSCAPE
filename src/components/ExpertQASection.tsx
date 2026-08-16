import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Wrench,
  FileCheck2,
  HardHat,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
  PlusCircle,
  Layers,
  Clock,
  Calendar,
  Share2,
  Printer,
  ShieldCheck,
  Building2,
  AlertCircle,
  ThumbsUp,
  Check,
  Eye,
  FileText,
  Hammer,
  Truck,
  Droplets,
  Lightbulb,
  TreePine,
  Car,
  Tag,
  ArrowRight,
  ExternalLink,
  Shield,
  Info,
} from 'lucide-react';
import { INITIAL_EXPERT_QA, TechnicalRepairGuide } from '../data/expertQaData';

interface ExpertQASectionProps {
  isAdmin?: boolean;
}

export const ExpertQASection: React.FC<ExpertQASectionProps> = ({ isAdmin = true }) => {
  // Persistence with localStorage
  const [guides, setGuides] = useState<TechnicalRepairGuide[]>(() => {
    try {
      const saved = localStorage.getItem('cityscape_expert_qa_guides');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved expert QA guides', e);
    }
    return INITIAL_EXPERT_QA;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(INITIAL_EXPERT_QA[0]?.id || null);
  const [viewModeMap, setViewModeMap] = useState<Record<string, 'plain' | 'technical'>>({
    'qa-pothole-hotmix': 'plain',
    'qa-cipp-watermain': 'plain',
    'qa-led-photocell-driver': 'plain',
    'qa-tree-root-sidewalk': 'plain',
    'qa-speed-cushion-geometry': 'plain',
  });

  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'pending-questions' | 'standards'>('browse');
  const [printSuccessId, setPrintSuccessId] = useState<string | null>(null);

  // New Guide Draft Form State
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<'roads' | 'water' | 'lighting' | 'concrete' | 'forestry' | 'traffic'>('roads');
  const [draftDepartment, setDraftDepartment] = useState('Bureau of Street Services & Paving');
  const [draftAuthorName, setDraftAuthorName] = useState('Senior Civil Engineer, PE');
  const [draftAuthorRole, setDraftAuthorRole] = useState('Municipal Infrastructure Lead');
  const [draftResidentQuestion, setDraftResidentQuestion] = useState('');
  const [draftShortSummary, setDraftShortSummary] = useState('');
  const [draftPlainLanguage, setDraftPlainLanguage] = useState('');
  const [draftMethodName, setDraftMethodName] = useState('');
  const [draftStandardCode, setDraftStandardCode] = useState('ASTM / AASHTO Certified Standard');
  const [draftSteps, setDraftSteps] = useState('');
  const [draftEquipment, setDraftEquipment] = useState('');
  const [draftCrew, setDraftCrew] = useState('3-person public works crew + 1 safety flagger');
  const [draftCureTime, setDraftCureTime] = useState('2 to 4 hours');
  const [draftServiceLife, setDraftServiceLife] = useState('8 to 10 years');
  const [draftWhyChosen, setDraftWhyChosen] = useState('');
  const [draftFormError, setDraftFormError] = useState('');

  // Sample pending resident technical questions waiting for official engineering response
  const [pendingResidentQuestions, setPendingResidentQuestions] = useState([
    {
      id: 'pen-1',
      question: 'Why does the city replace concrete storm drains with black ribbed plastic (HDPE) pipes in our cul-de-sac?',
      askedBy: 'Neighbor Robert G. (Ward 3 Resident)',
      date: 'Yesterday at 3:15 PM',
      upvotes: 42,
      category: 'water',
      relatedIssue: 'Storm Drainage Improvement',
    },
    {
      id: 'pen-2',
      question: 'How do crews calibrate the induction wire sensors embedded in the asphalt at traffic signals to detect bicycles?',
      askedBy: 'Neighbor Maya L. (Ward 1 Cyclist)',
      date: '2 days ago',
      upvotes: 29,
      category: 'traffic',
      relatedIssue: 'Traffic Light Cycle Timing',
    },
    {
      id: 'pen-3',
      question: 'Why are fire hydrants flushed with high-pressure water every spring, and does that mean the tap water is unsafe?',
      askedBy: 'Neighbor Arthur P. (Senior Community Member)',
      date: '3 days ago',
      upvotes: 56,
      category: 'water',
      relatedIssue: 'Annual Water Main Flushing',
    },
  ]);

  // Save guides to localStorage
  const saveGuidesToStorage = (updated: TechnicalRepairGuide[]) => {
    setGuides(updated);
    try {
      localStorage.setItem('cityscape_expert_qa_guides', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save expert QA guides', e);
    }
  };

  // Toggle View Mode between Plain Language and Technical SOP
  const toggleViewMode = (guideId: string, mode: 'plain' | 'technical') => {
    setViewModeMap((prev) => ({
      ...prev,
      [guideId]: mode,
    }));
  };

  // Upvote / Helpful feedback
  const handleHelpfulVote = (guideId: string) => {
    if (helpfulVoted[guideId]) return;
    const updated = guides.map((g) => {
      if (g.id === guideId) {
        return { ...g, helpfulCount: g.helpfulCount + 1 };
      }
      return g;
    });
    setHelpfulVoted((prev) => ({ ...prev, [guideId]: true }));
    saveGuidesToStorage(updated);
  };

  // Submit new Guide by official
  const handleCreateGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftPlainLanguage.trim() || !draftMethodName.trim()) {
      setDraftFormError('Please fill in the title, plain language explanation, and technical method name.');
      return;
    }

    const newGuide: TechnicalRepairGuide = {
      id: `qa-${Date.now()}`,
      title: draftTitle.trim(),
      category: draftCategory,
      department: draftDepartment.trim() || 'Department of Public Works',
      officialAuthor: {
        name: draftAuthorName.trim() || 'Elena Rostova, PE',
        role: draftAuthorRole.trim() || 'Lead Materials Engineer',
        department: draftDepartment.trim() || 'Dept. of Public Works',
        verifiedSeal: true,
      },
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      commonResidentQuestion: draftResidentQuestion.trim() || `How does the city fix ${draftTitle.trim()}?`,
      shortSummary: draftShortSummary.trim() || draftPlainLanguage.slice(0, 120) + '...',
      plainLanguageExplanation: draftPlainLanguage.trim(),
      technicalSop: {
        methodName: draftMethodName.trim(),
        standardCode: draftStandardCode.trim() || 'ASTM / AASHTO Certified',
        stepByStepProcedure: draftSteps
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        equipmentAndMaterials: draftEquipment
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        crewRequirement: draftCrew.trim() || '3-person public works crew',
        cureAndResolutionTime: draftCureTime.trim() || '2 to 4 hours',
        serviceLifeExpectancy: draftServiceLife.trim() || '5 to 10 years',
        trafficControlProtocol: 'MUTCD Compliant Safety Perimeter & Traffic Cones',
      },
      whyThisMethodChosen: draftWhyChosen.trim() || 'Standardized for optimal durability, safety, and long-term taxpayer value.',
      helpfulCount: 1,
      featuredStatus: true,
      relatedReportTypes: [draftTitle.trim()],
    };

    const updated = [newGuide, ...guides];
    saveGuidesToStorage(updated);
    setExpandedGuideId(newGuide.id);
    setIsDraftModalOpen(false);

    // Reset fields
    setDraftTitle('');
    setDraftResidentQuestion('');
    setDraftShortSummary('');
    setDraftPlainLanguage('');
    setDraftMethodName('');
    setDraftSteps('');
    setDraftEquipment('');
    setDraftWhyChosen('');
    setDraftFormError('');
  };

  // Quick answer for a pending resident question
  const handleAnswerPending = (pending: (typeof pendingResidentQuestions)[0]) => {
    setDraftResidentQuestion(pending.question);
    setDraftTitle(`Repair Method: ${pending.relatedIssue}`);
    setDraftCategory(pending.category as any);
    setIsDraftModalOpen(true);
  };

  // Filtered guides
  const filteredGuides = useMemo(() => {
    return guides.filter((g) => {
      const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        !query ||
        g.title.toLowerCase().includes(query) ||
        g.commonResidentQuestion.toLowerCase().includes(query) ||
        g.plainLanguageExplanation.toLowerCase().includes(query) ||
        g.technicalSop.methodName.toLowerCase().includes(query) ||
        g.department.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });
  }, [guides, selectedCategory, searchQuery]);

  const handlePrintBulletin = (guide: TechnicalRepairGuide) => {
    setPrintSuccessId(guide.id);
    setTimeout(() => setPrintSuccessId(null), 2500);
    window.print();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'roads':
        return <Hammer className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'lighting':
        return <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-300" />;
      case 'concrete':
        return <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'forestry':
        return <TreePine className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'traffic':
        return <Car className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Wrench className="w-4 h-4 text-[#006D5B]" />;
    }
  };

  return (
    <div className="space-y-6 text-left" id="expert-qa-section-root">
      
      {/* Top Banner Header */}
      <div className="p-6 sm:p-7 bg-white dark:bg-[#0A2540] rounded-2xl shadow-sm border-1.5 border-[#CBD5E1] dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#006D5B]/10 dark:bg-teal-950/60 text-[#006D5B] dark:text-teal-300 border border-[#006D5B]/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006D5B] dark:text-teal-300" />
              MUNICIPAL ENGINEERING KNOWLEDGE BASE
            </span>
            <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-md">
              Senior &amp; Plain Language Accessible
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A2540] dark:text-white leading-tight">
            Expert Q&amp;A: Technical Repair Methods &amp; Civic Explanations
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium max-w-3xl leading-relaxed">
            Direct explanations from certified municipal engineers on how city public works crews diagnose, repair, and maintain neighborhood infrastructure—bridging technical engineering standards with transparent resident communication.
          </p>
        </div>

        {/* Action Button for City Officials */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-draft-technical-guide"
            onClick={() => setIsDraftModalOpen(true)}
            className="px-5 py-3.5 bg-[#006D5B] hover:bg-[#005244] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 min-h-[52px]"
          >
            <PlusCircle className="w-5 h-5 text-amber-300" />
            <span>Publish Technical Explanation</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 ${
            activeTab === 'browse'
              ? 'bg-[#0A2540] text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Published Repair Guides ({guides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending-questions')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 ${
            activeTab === 'pending-questions'
              ? 'bg-[#006D5B] text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-teal-300" />
          <span>Resident Inquiries Waiting for Official Answer ({pendingResidentQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('standards')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer min-h-[44px] flex items-center gap-2 ${
            activeTab === 'standards'
              ? 'bg-[#2563EB] text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-blue-300" />
          <span>Engineering Codes &amp; Standards Reference</span>
        </button>
      </div>

      {/* VIEW TAB 1: PUBLISHED REPAIR GUIDES */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          
          {/* Search & Category Filter Bar */}
          <div className="p-4 bg-white dark:bg-[#0A2540] rounded-xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, repair method, pipe type, asphalt standard..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#071829] border-1.5 border-[#CBD5E1] dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#006D5B] transition-colors min-h-[48px]"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'roads', label: 'Roads & Paving' },
                { id: 'water', label: 'Water & Sewer' },
                { id: 'lighting', label: 'Streetlights' },
                { id: 'concrete', label: 'Sidewalks & ADA' },
                { id: 'traffic', label: 'Traffic Calming' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap min-h-[40px] flex items-center gap-1.5 border ${
                    selectedCategory === cat.id
                      ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                  }`}
                >
                  {cat.id !== 'all' && getCategoryIcon(cat.id)}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guides List */}
          <div className="space-y-4">
            {filteredGuides.length === 0 ? (
              <div className="p-10 bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 text-center space-y-3">
                <Info className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  No technical repair guides match your search.
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Try searching for keywords like "asphalt", "CIPP", "sensor", "luminaire", or click "All Categories".
                </p>
              </div>
            ) : (
              filteredGuides.map((guide) => {
                const isExpanded = expandedGuideId === guide.id;
                const currentViewMode = viewModeMap[guide.id] || 'plain';

                return (
                  <article
                    key={guide.id}
                    className={`bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 transition-all shadow-sm ${
                      isExpanded
                        ? 'border-[#006D5B] ring-2 ring-[#006D5B]/20'
                        : 'border-[#CBD5E1] dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* Header Summary Row (Clickable Accordion) */}
                    <div
                      onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                      className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5">
                            {getCategoryIcon(guide.category)}
                            <span className="uppercase text-[11px] tracking-wider">{guide.department}</span>
                          </span>

                          <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-950/60 text-[#006D5B] dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{guide.officialAuthor.name}</span>
                          </span>

                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Updated {guide.lastUpdated}</span>
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white leading-snug">
                          {guide.title}
                        </h3>

                        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-200">
                            <strong>Resident Question:</strong> "{guide.commonResidentQuestion}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#006D5B]" />
                          <span>{guide.helpfulCount} neighbors found helpful</span>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED CONTENT BODY */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-6">
                        
                        {/* View Switcher: Plain Language (Resident Accessible) vs Technical Engineering SOP */}
                        <div className="p-3 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Viewing Format:
                            </span>
                            <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700">
                              <button
                                onClick={() => toggleViewMode(guide.id, 'plain')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  currentViewMode === 'plain'
                                    ? 'bg-white dark:bg-[#0A2540] text-[#0A2540] dark:text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Plain Language (For Residents)</span>
                              </button>

                              <button
                                onClick={() => toggleViewMode(guide.id, 'technical')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  currentViewMode === 'technical'
                                    ? 'bg-[#0A2540] text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                              >
                                <HardHat className="w-3.5 h-3.5 text-teal-400" />
                                <span>Technical Engineering SOP</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handlePrintBulletin(guide)}
                              className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>{printSuccessId === guide.id ? 'Printed / Ready' : 'Print Technical Bulletin'}</span>
                            </button>
                          </div>
                        </div>

                        {/* MODE A: PLAIN LANGUAGE EXPLANATION (Empathetic, clear, accessible to seniors) */}
                        {currentViewMode === 'plain' ? (
                          <div className="space-y-5">
                            <div className="p-5 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/60 space-y-3">
                              <div className="flex items-center gap-2 text-sm font-bold text-[#006D5B] dark:text-teal-300">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>Plain-Language Explanation for Community Members</span>
                              </div>
                              <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                                {guide.plainLanguageExplanation}
                              </p>
                            </div>

                            {/* Why this method was chosen */}
                            <div className="p-4 bg-white dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#006D5B] dark:text-teal-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#006D5B]" />
                                <span>Why the City Uses This Specific Repair Method</span>
                              </h4>
                              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                {guide.whyThisMethodChosen}
                              </p>
                            </div>

                            {/* Common Resident Misconceptions / Fact vs Myth */}
                            {guide.commonResidentMisconceptions && guide.commonResidentMisconceptions.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                  <Info className="w-4 h-4 text-amber-600" />
                                  <span>Common Misconceptions &amp; Facts</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {guide.commonResidentMisconceptions.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3.5 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed"
                                    >
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quick Metrics Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                              <div className="p-3 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Crew Size</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{guide.technicalSop.crewRequirement}</span>
                              </div>

                              <div className="p-3 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Expected Resolution</span>
                                <span className="text-sm font-bold text-[#006D5B] dark:text-teal-300 mt-0.5 block">{guide.technicalSop.cureAndResolutionTime}</span>
                              </div>

                              <div className="p-3 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Service Longevity</span>
                                <span className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-0.5 block">{guide.technicalSop.serviceLifeExpectancy}</span>
                              </div>

                              <div className="p-3 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Standard Code</span>
                                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 mt-0.5 block truncate">{guide.technicalSop.standardCode || 'ASTM Certified'}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* MODE B: TECHNICAL ENGINEERING SOP (Detailed engineering breakdown) */
                          <div className="space-y-6">
                            
                            {/* Method Header & Standard Code */}
                            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                              <div>
                                <span className="text-[10px] text-teal-400 uppercase tracking-wider block">Engineering Method:</span>
                                <span className="text-sm font-bold text-white">{guide.technicalSop.methodName}</span>
                              </div>
                              <div className="sm:text-right">
                                <span className="text-[10px] text-amber-300 uppercase tracking-wider block">Specification Code:</span>
                                <span className="text-xs font-bold text-slate-200">{guide.technicalSop.standardCode}</span>
                              </div>
                            </div>

                            {/* Step-by-Step Procedure */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-bold text-[#0A2540] dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-[#006D5B]" />
                                <span>Standard Operating Procedure (SOP) Sequence</span>
                              </h4>
                              <div className="space-y-2">
                                {guide.technicalSop.stepByStepProcedure.map((step, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3.5 bg-white dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                                  >
                                    <span className="w-6 h-6 rounded-full bg-[#0A2540] text-white dark:bg-teal-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {idx + 1}
                                    </span>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                      {step}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Equipment, Machinery & Materials Required */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                  <Truck className="w-4 h-4 text-blue-600" />
                                  <span>Required Machinery &amp; Materials</span>
                                </h4>
                                <ul className="space-y-1.5">
                                  {guide.technicalSop.equipmentAndMaterials.map((eq, idx) => (
                                    <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      <span>{eq}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                  <Shield className="w-4 h-4 text-amber-600" />
                                  <span>Safety &amp; Traffic Control Perimeter</span>
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                  {guide.technicalSop.trafficControlProtocol || 'MUTCD Compliant Single-Lane Safety Closure with Type II Barricades'}
                                </p>
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                  <div><strong>Crew Composition:</strong> {guide.technicalSop.crewRequirement}</div>
                                  <div><strong>Service Life Expectancy:</strong> {guide.technicalSop.serviceLifeExpectancy}</div>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* Author Bio & Civic Feedback Footer */}
                        <div className="p-4 bg-slate-50 dark:bg-[#071829] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0A2540] dark:bg-[#006D5B] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                              {guide.officialAuthor.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {guide.officialAuthor.name}
                                </span>
                                <span className="px-1.5 py-0.2 text-[10px] bg-teal-100 dark:bg-teal-900 text-[#006D5B] dark:text-teal-200 rounded font-bold">
                                  Verified PE
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {guide.officialAuthor.role} • {guide.officialAuthor.department}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleHelpfulVote(guide.id)}
                              disabled={helpfulVoted[guide.id]}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                helpfulVoted[guide.id]
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                                  : 'bg-[#B45309] hover:bg-[#92400E] text-white shadow-xs'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{helpfulVoted[guide.id] ? 'Thank You for Feedback' : 'Helpful Explanation'}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW TAB 2: RESIDENT INQUIRIES WAITING FOR OFFICIAL ENGINEERING ANSWER */}
      {activeTab === 'pending-questions' && (
        <div className="space-y-4">
          <div className="p-5 bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#B45309]" />
              <span>Pending Community Technical Inquiries</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              These technical questions were submitted by neighborhood residents seeking detailed explanations on upcoming public works projects or repair methods. City engineers can click "Draft Official Technical Answer" to publish a response.
            </p>
          </div>

          <div className="space-y-3">
            {pendingResidentQuestions.map((pen) => (
              <div
                key={pen.id}
                className="p-5 bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-md border border-amber-200 dark:border-amber-800">
                      {pen.relatedIssue}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Submitted by {pen.askedBy} • {pen.date}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    "{pen.question}"
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-[#006D5B] dark:text-teal-300 font-semibold">
                    <span>{pen.upvotes} neighbors asked this same question</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAnswerPending(pen)}
                  className="px-4 py-2.5 bg-[#006D5B] hover:bg-[#005244] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Draft Official Technical Answer</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW TAB 3: ENGINEERING CODES & STANDARDS REFERENCE */}
      {activeTab === 'standards' && (
        <div className="space-y-4">
          <div className="p-5 bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>Municipal Engineering Codes &amp; Quality Assurances</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              All published repair methodologies strictly conform to accredited national engineering specifications to ensure structural longevity, environmental protection, and federal ADA accessibility compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">Roadway &amp; Paving</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">AASHTO &amp; ASTM Standards</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Governs Superpave hot-mix asphalt (HMA) compaction densities (93%–97% TMD), SS-1h cationic emulsion tack coats, and cold-pour joint sealants.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">Underground Utilities</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">ASTM F1216 (CIPP)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Standard practice for rehabilitation of pipes and conduits by the inversion and curing of a resin-impregnated tube with 50-year service life guarantee.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-[#0A2540] rounded-2xl border-1.5 border-[#CBD5E1] dark:border-slate-700 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">Pedestrian Rights-of-Way</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">PROWAG &amp; ADAAG 403</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Mandates vertical displacement limits (&le; 0.25 inch), tactile detectable warning surfaces, and minimum 48-inch unobstructed pedestrian pathways.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DRAFT NEW TECHNICAL GUIDE MODAL (FOR CITY OFFICIALS) */}
      {isDraftModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-3xl bg-white dark:bg-[#0A2540] rounded-2xl shadow-2xl border-2 border-[#0A2540] dark:border-slate-700 max-h-[92vh] flex flex-col overflow-hidden text-left my-auto">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#0A2540] text-white flex items-center justify-between border-b-2 border-amber-400/40 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Publish Official Technical Repair Explanation
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    City Official Knowledge Base • Verified Engineering Standard
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="p-2 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateGuide} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {draftFormError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{draftFormError}</span>
                </div>
              )}

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Repair Guide Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Catch Basin Desilting & Culvert Hydro-Jetting"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Municipal Category *
                  </label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
                  >
                    <option value="roads">Roads &amp; Pavement Paving</option>
                    <option value="water">Water Works &amp; Sewer</option>
                    <option value="lighting">Streetlights &amp; Electrical</option>
                    <option value="concrete">Sidewalks &amp; ADA Ramps</option>
                    <option value="forestry">Urban Forestry &amp; Trees</option>
                    <option value="traffic">Traffic Engineering &amp; Safety</option>
                  </select>
                </div>
              </div>

              {/* Common Resident Question */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Common Resident Question Being Answered
                </label>
                <input
                  type="text"
                  placeholder="e.g. Why is the city using a giant vacuum truck near our storm drain?"
                  value={draftResidentQuestion}
                  onChange={(e) => setDraftResidentQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium"
                />
              </div>

              {/* Plain Language Explanation for Residents (Cityscape Brand Voice) */}
              <div>
                <label className="text-xs font-bold text-[#006D5B] dark:text-teal-300 uppercase tracking-wider block mb-1">
                  Plain-Language Explanation for Community Members * (Senior Accessible)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain clearly in everyday terms why this repair method is used, what neighbors will see, and how it protects their street..."
                  value={draftPlainLanguage}
                  onChange={(e) => setDraftPlainLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-teal-50/30 dark:bg-[#071829] border border-teal-300 dark:border-teal-800 rounded-xl text-sm font-medium"
                />
              </div>

              {/* Technical SOP & Method Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Technical Method Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-Velocity Vacuum Hydraulic Jetting"
                    value={draftMethodName}
                    onChange={(e) => setDraftMethodName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Standard / Code Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ASTM C478 / AASHTO M199"
                    value={draftStandardCode}
                    onChange={(e) => setDraftStandardCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono"
                  />
                </div>
              </div>

              {/* Step-by-Step Procedure */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Step-by-Step Engineering Procedure (1 step per line)
                </label>
                <textarea
                  rows={4}
                  placeholder={`1. Inspect inlet grating and clear surface leaf debris\n2. Insert 3,000 PSI hydro-jetting hose with forward-facing nozzle\n3. Vacuum sediment slurry into sealed debris tank\n4. Perform post-cleaning CCTV camera run to verify 100% flow`}
                  value={draftSteps}
                  onChange={(e) => setDraftSteps(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Machinery & Materials */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Equipment, Machinery &amp; Materials (1 item per line)
                </label>
                <textarea
                  rows={2}
                  placeholder={`Vactor 2100i Combination Vacuum Jetter Truck\n3,000 PSI High-Pressure Water Hose\nRobotic CCTV Pipe Inspection Crawler`}
                  value={draftEquipment}
                  onChange={(e) => setDraftEquipment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
              </div>

              {/* Author & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Official Author Name &amp; Title
                  </label>
                  <input
                    type="text"
                    value={draftAuthorName}
                    onChange={(e) => setDraftAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={draftDepartment}
                    onChange={(e) => setDraftDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#071829] border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#006D5B] hover:bg-[#005244] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Publish to Knowledge Base</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
