import React, { useState, useEffect } from 'react';
import {
  Tag,
  Flame,
  Clock,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  ArrowLeft,
  Share2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  MapPin,
  Send,
  AlertOctagon,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Report } from '../types';
import { RichPostContent } from './RichPostContent';
import { formatTimeAgo } from '../lib/utils';
import { CATEGORY_CONFIG, STATUS_CONFIG, SEVERITY_CONFIG } from '../lib/constants';

interface HashtagLandingViewProps {
  tag: string;
  reports: Report[];
  onBack: () => void;
  onSelectReport: (report: Report) => void;
  onUpvoteReport: (reportId: string, e: React.MouseEvent) => void;
  onOpenReportModalWithTag?: (tag: string) => void;
  onHashtagClick?: (tag: string) => void;
}

export const HashtagLandingView: React.FC<HashtagLandingViewProps> = ({
  tag,
  reports,
  onBack,
  onSelectReport,
  onUpvoteReport,
  onOpenReportModalWithTag,
  onHashtagClick,
}) => {
  const [activeTab, setActiveTab] = useState<'top' | 'latest' | 'media'>('latest');
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`followed_tag_${tag.toLowerCase()}`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [copiedLink, setCopiedLink] = useState(false);

  const normalizedTag = tag.toLowerCase().replace(/^#/, '');
  const displayTag = tag.startsWith('#') ? tag : `#${tag}`;

  // Filter reports matching hashtag in title or description or category
  const taggedReports = reports.filter((r) => {
    const text = `${r.title} ${r.description}`.toLowerCase();
    return text.includes(`#${normalizedTag}`) || text.includes(normalizedTag);
  });

  // Calculate engagement metrics for Top tab
  const sortedReports = [...taggedReports].sort((a, b) => {
    if (activeTab === 'top') {
      const scoreA = a.upvotesCount * 3 + (a.verificationsCount || 0) * 5;
      const scoreB = b.upvotesCount * 3 + (b.verificationsCount || 0) * 5;
      return scoreB - scoreA;
    }
    if (activeTab === 'media') {
      return (b.imageUrls?.length || 0) - (a.imageUrls?.length || 0);
    }
    // Latest chronological
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const mediaReports = taggedReports.filter((r) => r.imageUrls && r.imageUrls.length > 0);

  const handleToggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    try {
      localStorage.setItem(`followed_tag_${normalizedTag}`, nextState ? 'true' : 'false');
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  };

  const handleShareTag = () => {
    const url = `${window.location.origin}/#hashtag-${normalizedTag}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to GeoGrid Map</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            /hashtag/{normalizedTag}
          </span>

          <button
            onClick={handleShareTag}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer shadow-xs transition-all"
            title="Copy shareable link to tag"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-400/20 shrink-0">
              <Tag className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {displayTag}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-black uppercase">
                  #1 Velocity
                </span>
              </div>

              <p className="text-xs text-indigo-200/90 max-w-lg leading-relaxed">
                Dedicated civic intelligence feed for {displayTag}. Track, report, and verify city updates in real-time.
              </p>
            </div>
          </div>

          {/* Action Buttons: Follow Tag & Post with Tag */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleToggleFollow}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
                isFollowing
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${isFollowing ? 'text-white' : 'text-slate-400'}`} />
              <span>{isFollowing ? 'Following Tag' : 'Follow Tag'}</span>
            </button>

            {onOpenReportModalWithTag && (
              <button
                onClick={() => onOpenReportModalWithTag(displayTag)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Report with {displayTag}</span>
              </button>
            )}
          </div>
        </div>

        {/* Analytics Snapshot Strip */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-indigo-800/80">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-indigo-300 uppercase">Total Volume</div>
            <div className="text-lg font-mono font-black text-white">{taggedReports.length} Reports</div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-indigo-300 uppercase">Velocity Rank</div>
            <div className="text-lg font-mono font-black text-amber-300 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Top 1%</span>
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-indigo-300 uppercase">Followers</div>
            <div className="text-lg font-mono font-black text-white">342 Residents</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Top, Latest, Media) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('top')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'top'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Top Posts</span>
          </button>

          <button
            onClick={() => setActiveTab('latest')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'latest'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latest Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'media'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media ({mediaReports.length})</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono font-bold hidden sm:inline-block">
          Showing {sortedReports.length} reports
        </span>
      </div>

      {/* Feed Contents */}
      {activeTab === 'media' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {mediaReports.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold">No photo attachments found for {displayTag}.</p>
            </div>
          ) : (
            mediaReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={report.imageUrls[0]}
                  alt={report.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                  <div className="text-xs font-bold line-clamp-1">{report.title}</div>
                  <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1">
                    <span>{report.addressText}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <ThumbsUp className="w-3 h-3 text-amber-300" />
                      {report.upvotesCount}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReports.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <Tag className="w-10 h-10 text-indigo-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Be the first to post with {displayTag}!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No civic reports are currently tagged with {displayTag}. Click below to create a report and start this thread.
              </p>
              {onOpenReportModalWithTag && (
                <button
                  onClick={() => onOpenReportModalWithTag(displayTag)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold inline-flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Report Issue using {displayTag}</span>
                </button>
              )}
            </div>
          ) : (
            sortedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 transition-all cursor-pointer space-y-3 card-heartbeat-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {report.userName[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{report.userName}</span>
                        {report.isGuest ? (
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">Guest</span>
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>{formatTimeAgo(report.createdAt)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                          {report.addressText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {report.category.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-heading font-black text-base text-[#1c1a3b] dark:text-white">
                    {report.title}
                  </h3>
                  <RichPostContent
                    content={report.description}
                    onHashtagClick={onHashtagClick}
                  />
                </div>

                {report.imageUrls && report.imageUrls.length > 0 && (
                  <div className="rounded-2xl overflow-hidden h-48 bg-slate-100 dark:bg-slate-800">
                    <img src={report.imageUrls[0]} alt={report.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    onClick={(e) => onUpvoteReport(report.id, e)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      report.userHasUpvoted
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{report.upvotesCount} Upvotes</span>
                  </button>

                  <span className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
                    <span>View full report details</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
