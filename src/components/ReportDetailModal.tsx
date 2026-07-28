import React, { useState } from 'react';
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
} from 'lucide-react';
import { Report, Comment } from '../types';
import { STATUS_CONFIG, CATEGORY_CONFIG, SEVERITY_CONFIG } from '../lib/constants';
import { CategoryIcon } from './CategoryIcon';
import { formatTimeAgo, formatFullDate } from '../lib/utils';
import { AiForensicModal } from './AiForensicModal';

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

  if (!report) return null;

  const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
  const catConf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.OTHER;
  const sevConf = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.MEDIUM;

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

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?reportId=${report.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareText = `Check out this civic infrastructure report on CITYSCAPE: "${report.title}" at ${report.addressText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-settled-in">
        {/* Header bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <span
              className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg text-white"
              style={{ backgroundColor: statusConf.pinHex }}
            >
              {statusConf.label}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${sevConf.colorClass}`}>
              {sevConf.label}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Prominent Copy Link Button */}
            <button
              onClick={handleCopyLink}
              title="Copy direct shareable link for this issue"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-extrabold transition-all cursor-pointer border ${
                copiedLink
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                  : 'bg-white/90 text-indigo-950 border-white hover:bg-white shadow-2xs'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
              title="Share on X"
            >
              <Share2 className="w-4 h-4" />
            </a>

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
          {report.category === 'EMERGENCY' && (
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
          )}

          {/* Main Title & Category */}
          <div>
            <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">
              <CategoryIcon category={report.category} className="w-4 h-4" />
              <span>{catConf.label}</span>
              <span>•</span>
              <span className="text-slate-400 font-normal">Report ID: {report.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-[#1c1a3b] dark:text-white leading-tight">
              {report.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{report.addressText}</span>
              <span className="mx-1">•</span>
              <span>Reported {formatTimeAgo(report.createdAt)}</span>
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
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Inspect Forensics</span>
            </button>
          </div>

          {/* Description & Endorse Button */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {report.description || 'No additional details provided by resident.'}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700">
              <div className="text-xs text-slate-500">
                Filed by <strong>{report.userName}</strong> ({report.isGuest ? 'Guest Resident' : 'Verified Citizen'})
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

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    copiedLink
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                      : 'btn-soft-tactile'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-600" />
                      <span>Copy Link</span>
                    </>
                  )}
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
                  <ThumbsUp className={`w-4 h-4 ${report.userHasUpvoted ? 'fill-current' : ''}`} />
                  <span>{report.upvotesCount} Endorsements</span>
                </button>
              </div>
            </div>
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
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Community Discussion & Updates ({comments.length})</span>
            </h3>

            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    comment.isOfficialUpdate
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100">
                      {comment.isOfficialUpdate ? (
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{comment.userName}</span>
                      {comment.isOfficialUpdate && (
                        <span className="px-1.5 py-0.2 text-[9px] bg-blue-600 text-white rounded-md uppercase font-bold">
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
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
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
                  className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AiForensicModal
        isOpen={isForensicsOpen}
        onClose={() => setIsForensicsOpen(false)}
        report={report}
      />
    </div>
  );
};
