import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Mail,
  Send,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Download,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { ShareDataPayload, canNativeShare, triggerNativeShare, getSocialShareLinks } from '../lib/shareUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareDataPayload | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen || !data) return null;

  const links = getSocialShareLinks(data);
  const isNativeShareSupported = canNativeShare();

  const handleCopy = () => {
    navigator.clipboard.writeText(data.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    const success = await triggerNativeShare(data);
    if (success) {
      onClose();
    }
  };

  const getCategoryLabel = (type: ShareDataPayload['type']) => {
    switch (type) {
      case 'report':
        return 'Neighborhood Issue Report';
      case 'bulletin':
        return 'Official Municipal Advisory';
      case 'event':
        return 'Community Event';
      case 'hashtag':
        return 'Civic Topic & Hashtag';
      case 'article':
        return 'Civic Journal Article';
      default:
        return 'Community Announcement';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-[#CBD5E1] dark:border-slate-800 overflow-hidden my-auto p-5 sm:p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 text-[#008080] dark:bg-[#008080]/20 dark:text-[#CCFF00] flex items-center justify-center shrink-0 border border-[#008080]/30">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#008080] dark:text-[#CCFF00]">
                  {getCategoryLabel(data.type)}
                </span>
                <h3 className="text-lg font-heading font-black text-[#0A2540] dark:text-white leading-tight">
                  Share with Neighbors
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close Share Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item Context Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
              {data.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {data.text}
            </p>
            {data.address && (
              <p className="text-[11px] text-[#006D5B] dark:text-[#CCFF00] font-mono font-bold pt-1">
                📍 {data.address}
              </p>
            )}
          </div>

          {/* Native System Share (if mobile/supported) */}
          {isNativeShareSupported && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3.5 px-4 bg-[#0A2540] hover:bg-[#006D5B] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer min-h-[56px] border border-slate-700"
            >
              <Share2 className="w-5 h-5 text-[#CCFF00]" />
              <span>Use System Share Sheet</span>
            </button>
          )}

          {/* Direct Copy Link Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Direct Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={data.url}
                className="flex-1 px-3.5 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 focus:outline-none min-h-[56px]"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-3 rounded-2xl text-xs font-black min-h-[56px] min-w-[110px] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm border ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-[#008080] hover:bg-[#006666] text-[#CCFF00] border-[#008080]'
                }`}
              >
                {copied ? (
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
          </div>

          {/* Social Channels Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Share via Messaging & Social Platforms
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-2xl border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer min-h-[56px]"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold mt-1">WhatsApp</span>
              </a>

              <a
                href={links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer min-h-[56px]"
                title="Share on X (Twitter)"
              >
                <Twitter className="w-5 h-5 text-sky-500" />
                <span className="text-[10px] font-bold mt-1">X / Twitter</span>
              </a>

              <a
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-800 dark:text-blue-300 rounded-2xl border border-blue-200 dark:border-blue-800 transition-all cursor-pointer min-h-[56px]"
                title="Share on Facebook"
              >
                <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-bold mt-1">Facebook</span>
              </a>

              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-800 dark:text-sky-300 rounded-2xl border border-sky-200 dark:border-sky-800 transition-all cursor-pointer min-h-[56px]"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <span className="text-[10px] font-bold mt-1">LinkedIn</span>
              </a>

              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 text-cyan-800 dark:text-cyan-300 rounded-2xl border border-cyan-200 dark:border-cyan-800 transition-all cursor-pointer min-h-[56px]"
                title="Share on Telegram"
              >
                <Send className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-[10px] font-bold mt-1">Telegram</span>
              </a>

              <a
                href={links.email}
                className="flex flex-col items-center justify-center p-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 rounded-2xl border border-amber-200 dark:border-amber-800 transition-all cursor-pointer min-h-[56px]"
                title="Send via Email"
              >
                <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-bold mt-1">Email</span>
              </a>
            </div>
          </div>

          {/* Printable QR Code Toggle for Neighborhood Bulletin Boards */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowQr(!showQr)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer min-h-[48px]"
            >
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-[#008080]" />
                <span>Show Printable QR Code for Community Flyers</span>
              </div>
              <span className="text-[11px] font-mono text-[#008080] dark:text-[#CCFF00] font-black">
                {showQr ? 'Hide QR' : 'View QR'}
              </span>
            </button>

            {showQr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-[#008080]/40 flex flex-col items-center text-center space-y-3"
              >
                <img
                  src={links.qrCode}
                  alt="Community QR Code"
                  className="w-44 h-44 rounded-xl border p-2 bg-white shadow-sm"
                />
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs font-medium">
                  Scan this QR code with any smartphone camera to open this {data.type} directly in Cityscape.
                </p>
                <a
                  href={links.qrCode}
                  download={`Cityscape-${data.type}-${data.idOrTag || 'share'}.png`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#0A2540] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 hover:bg-[#006D5B] transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#CCFF00]" />
                  <span>Download QR Image</span>
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
