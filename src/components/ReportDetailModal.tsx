import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ThumbsUp,
  MapPin,
  Clock,
  MessageSquare,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Send,
  Copy,
  Check,
  ExternalLink,
  User,
  Building2,
  AlertCircle,
  Siren,
  ShieldAlert,
  Scan,
  Download,
  Navigation,
  MessageCircle,
  Twitter,
  Facebook,
  Mail,
  Link2,
  Image as ImageIcon,
} from 'lucide-react';
import { Report, Comment } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { formatTimeAgo, formatFullDate } from '../lib/utils';
import { downloadReportPDF } from '../lib/pdfExporter';
import { AiForensicModal } from './AiForensicModal';
import { ReportMapDirections } from './ReportMapDirections';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceKm, formatDistanceTag } from '../lib/geoUtils';
import { ShareModal } from './ShareModal';
import { getShareableUrl, ShareDataPayload, getSocialShareLinks } from '../lib/shareUtils';

interface ReportDetailModalProps {
  report: Report | null;
  comments: Comment[];
  onClose: () => void;
  onUpvote: (reportId: string, e: React.MouseEvent) => void;
  onAddComment: (reportId: string, content: string, isOfficial: boolean) => Promise<void>;
  isAdminMode: boolean;
  onOpenVerificationModal?: (report: Report) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  comments,
  onClose,
  onUpvote,
  onAddComment,
  isAdminMode,
  onOpenVerificationModal,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [isOfficialUpdate, setIsOfficialUpdate] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showResolvedPhoto, setShowResolvedPhoto] = useState(false);
  const [isForensicsOpen, setIsForensicsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { userCoords } = useUserLocation();

  // Dynamically update Open Graph and Twitter card meta tags for deep-link social media previews
  useEffect(() => {
    if (!report) return;

    const title = `${report.title} | Cityscape Civic Request #${report.id.slice(-6)}`;
    const description = `${report.description?.slice(0, 180)} | Status: ${report.status} | Location: ${report.addressText || 'Local Ward'}`;
    const previewImage = report.imageUrls?.[0] || report.resolutionImageUrl || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80';
    const reportDeepLink = getShareableUrl('report', report.id);

    const setMetaTag = (nameAttr: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Set page title for current browser tab / web scrapers
    document.title = title;

    // Set Open Graph Meta Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', previewImage);
    setMetaTag('property', 'og:image:alt', report.title);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:url', reportDeepLink);
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('property', 'og:site_name', 'Cityscape Civic Platform');

    // Set Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', previewImage);
    setMetaTag('name', 'twitter:image:alt', report.title);
  }, [report]);

  if (!report) return null;

  const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
  const catConf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.OTHER;
  const sevConf = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.MEDIUM;

  const isHighSeverity = report.severity === 'HIGH' || report.severity === 'CRITICAL' || report.category === 'EMERGENCY';

  let distanceTag: string | null = null;
  if (userCoords && report.latitude && report.longitude) {
    const distKm = calculateDistanceKm(
      userCoords.latitude,
      userCoords.longitude,
      report.latitude,
      report.longitude
    );
    distanceTag = formatDistanceTag(distKm);
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsPosting(true);
    try {
      await onAddComment(report.id, newCommentText.trim(), isOfficialUpdate);
      setNewCommentText('');
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsPosting(false);
    }
  };

  const sharePayload: ShareDataPayload = {
    type: 'report',
    title: report.title,
    text: report.description || `Civic infrastructure report filed in ${report.addressText}`,
    url: getShareableUrl('report', report.id),
    idOrTag: report.id,
    address: report.addressText,
    category: catConf.label,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharePayload.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 48 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 36 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.9 }}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 gap-2 flex-wrap">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span
              className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg text-white shrink-0"
              style={{ backgroundColor: statusConf.pinHex }}
            >
              {statusConf.label}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border shrink-0 ${sevConf.colorClass}`}>
              {sevConf.label}
            </span>

            {/* Pulsating 'Civic Urgent' Status Badge for High Severity Reports */}
            {isHighSeverity && (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-red-600 text-white border-2 border-red-500 shadow-md animate-pulse shrink-0">
                <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                <ShieldAlert className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Civic Urgent</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Export PDF Button */}
            <button
              onClick={() => downloadReportPDF(report)}
              title="Download official PDF report"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-['Montserrat'] font-extrabold bg-[#008080]/10 hover:bg-[#008080]/20 text-[#008080] dark:bg-[#008080]/20 dark:hover:bg-[#008080]/30 dark:text-[#CCFF00] border border-[#008080]/30 transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            {/* Standard Share Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              title="Share report with neighbors or social media"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-extrabold bg-[#008080] text-[#CCFF00] hover:bg-[#006666] transition-all cursor-pointer shadow-2xs min-h-[36px]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>Share Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Emergency High Contrast Alert Banner */}
          {report.category === 'EMERGENCY' ? (
            <div className="p-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl shadow-lg border border-red-400 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Siren className="w-5 h-5 text-yellow-300 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Emergency Hazard Alert</h4>
                  <p className="text-[11px] text-red-100 font-medium">Critical public safety / infrastructure risk reported.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-red-950/80 text-yellow-300 rounded-xl text-[10px] font-mono font-black border border-red-400/60">
                PRIORITY 1
              </span>
            </div>
          ) : isHighSeverity ? (
            <div className="p-3.5 bg-gradient-to-r from-red-600/90 via-red-600 to-rose-700 text-white rounded-2xl shadow-lg border-2 border-red-400 flex items-center justify-between gap-3 animate-pulse font-['Montserrat']">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center shrink-0">
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-white/40 animate-ping" />
                  <div className="relative w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
                    <ShieldAlert className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Civic Urgent Risk</h4>
                    <span className="px-2 py-0.5 bg-white text-red-700 text-[10px] font-black uppercase rounded-md shadow-2xs">
                      {sevConf.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-red-100 font-medium leading-tight mt-0.5">
                    High-severity infrastructure hazard flagged for immediate municipal inspection & priority dispatch.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-red-950/80 text-red-200 rounded-xl text-[10px] font-mono font-black border border-red-400/60 shrink-0">
                HIGH PRIORITY
              </span>
            </div>
          ) : null}

          {/* Main Title & Category */}
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#006D5B] dark:text-[#CCFF00] font-extrabold mb-1">
              <CategoryIcon category={report.category} className="w-4 h-4" />
              <span>{catConf.label}</span>
              <span>•</span>
              <span className="text-slate-600 dark:text-slate-300 font-mono font-bold">Report ID: #{report.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-[#0A2540] dark:text-white leading-tight">
              {report.title}
            </h1>
            <p className="text-xs text-[#111827] dark:text-slate-200 mt-1.5 flex items-center space-x-1.5 flex-wrap font-extrabold">
              <span className="flex items-center space-x-1 text-[#0A2540] dark:text-slate-100">
                <MapPin className="w-4 h-4 text-[#006D5B] dark:text-[#CCFF00] shrink-0" />
                <span>{report.addressText}</span>
              </span>
              {distanceTag && (
                <>
                  <span>•</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#006D5B] text-white dark:bg-[#006D5B] dark:text-[#CCFF00] border border-[#006D5B] flex items-center gap-1 shadow-2xs">
                    <Navigation className="w-2.5 h-2.5 text-[#CCFF00]" />
                    <span>{distanceTag}</span>
                  </span>
                </>
              )}
              <span>•</span>
              <span className="text-slate-700 dark:text-slate-300">Reported {formatTimeAgo(report.createdAt)}</span>
            </p>
          </div>

          {/* Photo Gallery & Resolution Comparison */}
          <div className="space-y-2">
            {report.status === 'RESOLVED' && report.resolutionImageUrl && (
              <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit text-xs font-semibold">
                <button
                  onClick={() => setShowResolvedPhoto(false)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    !showResolvedPhoto
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  Original Problem Photo
                </button>
                <button
                  onClick={() => setShowResolvedPhoto(true)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    showResolvedPhoto
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  Resolution Completion Photo ✨
                </button>
              </div>
            )}

            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              <img
                src={
                  showResolvedPhoto && report.resolutionImageUrl
                    ? report.resolutionImageUrl
                    : report.imageUrls[0]
                }
                alt={report.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* AI FRAUD SHIELD FORENSIC BADGE & CARD */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated
              ? 'bg-rose-950/20 border-rose-800/80 dark:bg-rose-950/40'
              : 'bg-emerald-950/20 border-emerald-800/60 dark:bg-emerald-950/40'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated
                  ? 'bg-rose-900/60 border-rose-700 text-rose-300'
                  : 'bg-emerald-900/60 border-emerald-700 text-emerald-300'
              }`}>
                {report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated
                      ? '⚠️ Flagged AI Synthetic Picture'
                      : '🛡️ Verified Camera Capture'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                    report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {report.aiForensics?.aiProbability ?? (report.isFlaggedAsAiFake ? 96 : 4)}% AI Score
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {report.isFlaggedAsAiFake || report.aiForensics?.isAiGenerated
                    ? 'Photo flagged for synthetic AI generative artifacts. Misleading fake pictures violate community trust.'
                    : 'CMOS camera sensor PRNU noise & natural lighting verified by AI Fraud Shield.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsForensicsOpen(true)}
              className="px-3.5 py-2 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Scan className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>Inspect Forensics</span>
            </button>
          </div>

          {/* TURN-BY-TURN NAVIGATION & DISPATCH ROUTE ASSISTANT */}
          <ReportMapDirections report={report} variant="full" />

          {/* Description & Endorse Button */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border-2 border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <p className="text-sm text-[#111827] dark:text-slate-100 font-semibold leading-relaxed whitespace-pre-line">
              {report.description || 'No additional details provided by resident.'}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t-2 border-slate-200 dark:border-slate-700">
              <div className="text-xs text-[#0A2540] dark:text-slate-200 font-bold">
                Filed by <strong className="text-[#006D5B] dark:text-[#CCFF00] font-black">{report.userName}</strong> ({report.isGuest ? 'Guest Resident' : 'Verified Citizen'})
              </div>

              <div className="flex items-center gap-2">
                {onOpenVerificationModal && (
                  <button
                    onClick={() => onOpenVerificationModal(report)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-100" />
                    <span>Ground Check (+15 Karma)</span>
                  </button>
                )}

                {/* Share Button */}
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border btn-soft-tactile min-h-[44px]"
                >
                  <Share2 className="w-4 h-4 text-[#008080]" />
                  <span>Share Issue</span>
                </button>

                {/* Endorse Button */}
                <button
                  onClick={(e) => onUpvote(report.id, e)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    report.userHasUpvoted
                      ? 'btn-primary-designer'
                      : 'btn-soft-tactile'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${report.userHasUpvoted ? 'fill-current text-[#CCFF00]' : ''}`} />
                  <span>{report.upvotesCount} Endorsements</span>
                </button>
              </div>
            </div>
          </div>

          {/* DEDICATED DEEP-LINK & SOCIAL MEDIA SHARING BAR */}
          <div className="p-4 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/95 to-[#006D5B] text-white rounded-2xl border-2 border-[#006D5B] shadow-lg space-y-3 font-['Montserrat']">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#006D5B] text-[#CCFF00] flex items-center justify-center shrink-0 border border-[#CCFF00]/30">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Share Deep Link & Spread the Word</h4>
                  <p className="text-[11px] text-slate-300">Direct report link for neighbors, ward reps, or social media</p>
                </div>
              </div>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3 py-1.5 bg-[#CCFF00] hover:bg-lime-400 text-[#0A2540] text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs shrink-0 flex items-center space-x-1 min-h-[36px]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>All Share Options</span>
              </button>
            </div>

            {/* Deep Link URL input & Copy Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={sharePayload.url}
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-200 focus:outline-none pr-8"
                />
              </div>

              <button
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer min-h-[42px] shrink-0 border ${
                  copiedLink
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-[#B45309] hover:bg-amber-600 text-white border-amber-400/40'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Open Graph Social Media Preview Badge */}
            <div className="flex items-center gap-2.5 p-2 bg-slate-900/70 rounded-xl border border-slate-700/80 text-[11px] text-slate-300">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#006D5B] bg-slate-800">
                <img
                  src={report.imageUrls?.[0] || report.resolutionImageUrl || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=400&q=80'}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-white truncate text-xs">{report.title}</span>
                  <span className="px-1.5 py-0.5 bg-[#006D5B] text-[#CCFF00] text-[9px] font-mono font-black rounded border border-[#CCFF00]/30 shrink-0">
                    OG Card Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  Social media platforms will auto-render this image, title & deep-link summary
                </p>
              </div>
            </div>

            {/* Direct Messaging & Social Shortcuts */}
            {(() => {
              const socialLinks = getSocialShareLinks(sharePayload);
              return (
                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/10">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider hidden sm:inline">Quick Send:</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <a
                      href={socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white rounded-xl text-xs font-bold border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3 py-1.5 bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white rounded-xl text-xs font-bold border border-sky-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
                    >
                      <Twitter className="w-3.5 h-3.5 text-sky-400" />
                      <span>X</span>
                    </a>

                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white rounded-xl text-xs font-bold border border-blue-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
                    >
                      <Facebook className="w-3.5 h-3.5 text-blue-400" />
                      <span>Facebook</span>
                    </a>

                    <a
                      href={socialLinks.email}
                      className="flex-1 sm:flex-initial px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600 text-amber-200 hover:text-white rounded-xl text-xs font-bold border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Official Municipal Work Order Status */}
          {report.officialNote && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-2xl space-y-2 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center space-x-2 font-bold text-amber-950 dark:text-amber-100">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Official Municipal Status Update</span>
              </div>
              <p className="leading-relaxed">{report.officialNote}</p>
              {report.assignedWorker && (
                <p className="text-[11px] opacity-80 pt-1 border-t border-amber-200/60 dark:border-amber-800">
                  Assigned Crew: <strong>{report.assignedWorker}</strong>
                </p>
              )}
            </div>
          )}

          {/* Community Discussion Feed */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#008080]" />
              <span>Community Discussion & Updates ({comments.length})</span>
            </h3>

            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    comment.isOfficialUpdate
                      ? 'bg-[#008080]/10 dark:bg-[#008080]/20 border-[#008080]/30'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100">
                      {comment.isOfficialUpdate ? (
                        <Building2 className="w-3.5 h-3.5 text-[#008080]" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{comment.userName}</span>
                      {comment.isOfficialUpdate && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-[#008080] text-[#CCFF00] rounded-md uppercase font-bold">
                          Official
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{formatTimeAgo(comment.createdAt)}</span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>

            {/* Post new comment form */}
            <form onSubmit={handleCommentSubmit} className="space-y-2 pt-2">
              <textarea
                rows={2}
                placeholder="Add your observation or comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#008080] text-slate-900 dark:text-slate-100"
              />

              <div className="flex items-center justify-between">
                {isAdminMode ? (
                  <label className="flex items-center space-x-1.5 text-xs text-amber-700 dark:text-amber-400 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOfficialUpdate}
                      onChange={(e) => setIsOfficialUpdate(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Post as Official Municipal Update</span>
                  </label>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={isPosting || !newCommentText.trim()}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#008080] hover:bg-[#006666] text-[#CCFF00] rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        </motion.div>

        <AiForensicModal
          isOpen={isForensicsOpen}
          onClose={() => setIsForensicsOpen(false)}
          report={report}
        />

        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          data={sharePayload}
        />
      </motion.div>
  );
};
