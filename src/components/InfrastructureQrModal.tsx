import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Info,
  FileText,
  AlertTriangle,
  Tag,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Report } from '../types';
import { downloadInfrastructureSignagePDF } from '../lib/pdfExporter';
import { CATEGORY_CONFIG, STATUS_CONFIG } from '../lib/constants';

interface InfrastructureQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report;
  shareUrl: string;
}

export const InfrastructureQrModal: React.FC<InfrastructureQrModalProps> = ({
  isOpen,
  onClose,
  report,
  shareUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [signageType, setSignageType] = useState<'flyer' | 'caution' | 'tag'>('flyer');
  const [headlineText, setHeadlineText] = useState(
    'OFFICIAL CIVIC NOTICE: INFRASTRUCTURE HAZARD REPORTED'
  );

  if (!isOpen || !report) return null;

  const catConf = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.OTHER;
  const statusConf = STATUS_CONFIG[report.status] || STATUS_CONFIG.OPEN;
  const qrImage300 = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
  const qrImageHighRes = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(shareUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadInfrastructureSignagePDF(report, shareUrl, headlineText, signageType);
    } catch (err) {
      console.error('Failed to generate PDF signage', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto font-['Montserrat']"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#FAF6F0] dark:bg-[#1E1B18] rounded-3xl shadow-2xl border-2 border-[#E3DDD3] dark:border-stone-800 overflow-hidden my-auto p-5 sm:p-6 space-y-5 text-[#2E2A26] dark:text-stone-100 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#E3DDD3] dark:border-stone-800 pb-4 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#8F9E87]/20 text-[#2E2A26] dark:bg-[#8F9E87]/30 dark:text-[#FBD6C8] flex items-center justify-center shrink-0 border-2 border-[#8F9E87]/40 shadow-xs">
                <QrCode className="w-6 h-6 text-[#2E2A26] dark:text-[#FBD6C8]" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#8F9E87] dark:text-[#FBD6C8] block">
                  On-Site Public Infrastructure Tag
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#2E2A26] dark:text-white leading-tight">
                  QR Code & Printable Physical Signage
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close QR Signage Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 space-y-5 pr-1">
            {/* Context Note */}
            <div className="p-3.5 bg-[#F5EFE6] dark:bg-stone-800/80 rounded-2xl border-2 border-[#E3DDD3] dark:border-stone-700 text-xs text-[#635D55] dark:text-stone-300 font-medium flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-[#8F9E87] shrink-0 mt-0.5" />
              <div>
                <p>
                  Print and physically affix this QR code flyer directly on damaged public infrastructure (e.g., street light poles, broken benches, potholes, water leaks). Neighbors passing by can scan it with their smartphone camera to instantly view, endorse, or receive repair updates.
                </p>
              </div>
            </div>

            {/* Template Format Selector */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#2E2A26] dark:text-stone-200 block">
                Select Physical Signage Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSignageType('flyer')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                    signageType === 'flyer'
                      ? 'bg-[#8F9E87] text-white border-[#7E8D76] shadow-md'
                      : 'bg-[#F5EFE6] dark:bg-stone-800 text-[#2E2A26] dark:text-stone-200 border-[#E3DDD3] dark:border-stone-700 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-black text-xs">
                    <FileText className="w-4 h-4" />
                    <span>A4 / Letter Flyer</span>
                  </div>
                  <span className="text-[10px] opacity-80 mt-1 block">Full Civic Notice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignageType('caution')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                    signageType === 'caution'
                      ? 'bg-[#B45309] text-white border-amber-600 shadow-md'
                      : 'bg-[#F5EFE6] dark:bg-stone-800 text-[#2E2A26] dark:text-stone-200 border-[#E3DDD3] dark:border-stone-700 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-black text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-300" />
                    <span>Caution Sign</span>
                  </div>
                  <span className="text-[10px] opacity-80 mt-1 block">High-Vis Warning</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignageType('tag')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                    signageType === 'tag'
                      ? 'bg-[#2E2A26] text-white border-stone-700 shadow-md'
                      : 'bg-[#F5EFE6] dark:bg-stone-800 text-[#2E2A26] dark:text-stone-200 border-[#E3DDD3] dark:border-stone-700 hover:bg-stone-200/60'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-black text-xs">
                    <Tag className="w-4 h-4" />
                    <span>Compact Tag</span>
                  </div>
                  <span className="text-[10px] opacity-80 mt-1 block">4x6 Sticker Tag</span>
                </button>
              </div>
            </div>

            {/* Custom Headline Preset */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#2E2A26] dark:text-stone-200 block">
                Signage Header Text
              </label>
              <div className="flex gap-2 flex-wrap text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setHeadlineText('OFFICIAL CIVIC NOTICE: INFRASTRUCTURE HAZARD REPORTED')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer min-h-[36px] ${
                    headlineText.includes('OFFICIAL CIVIC NOTICE')
                      ? 'bg-[#8F9E87] text-white border-[#7E8D76]'
                      : 'bg-[#F5EFE6] dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-[#E3DDD3]'
                  }`}
                >
                  Official Civic Notice
                </button>
                <button
                  type="button"
                  onClick={() => setHeadlineText('CAUTION: PUBLIC INFRASTRUCTURE HAZARD REPORTED HERE')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer min-h-[36px] ${
                    headlineText.includes('CAUTION')
                      ? 'bg-[#B45309] text-white border-amber-600'
                      : 'bg-[#F5EFE6] dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-[#E3DDD3]'
                  }`}
                >
                  Caution Warning
                </button>
                <button
                  type="button"
                  onClick={() => setHeadlineText('NEIGHBORHOOD NOTICE: REPAIR WORK ORDER FILED')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer min-h-[36px] ${
                    headlineText.includes('WORK ORDER')
                      ? 'bg-[#2E2A26] text-white border-stone-700'
                      : 'bg-[#F5EFE6] dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-[#E3DDD3]'
                  }`}
                >
                  Work Order Notice
                </button>
              </div>
              <input
                type="text"
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border-2 border-[#E3DDD3] dark:border-stone-700 rounded-xl text-xs font-bold text-[#2E2A26] dark:text-white focus:outline-none focus:border-[#8F9E87]"
              />
            </div>

            {/* REALISTIC PRINTABLE POSTER PREVIEW */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#2E2A26] dark:text-stone-200">
                  Printable Poster Preview
                </span>
                <span className="text-[10px] font-mono font-bold text-[#8F9E87]">
                  High Contrast • Scan Ready
                </span>
              </div>

              <div
                id="printable-poster-frame"
                className={`p-5 rounded-2xl border-4 bg-white text-stone-900 shadow-xl space-y-4 font-['Montserrat'] ${
                  signageType === 'caution'
                    ? 'border-[#B45309]'
                    : signageType === 'tag'
                    ? 'border-[#2E2A26] max-w-sm mx-auto'
                    : 'border-[#8F9E87]'
                }`}
              >
                {/* Header Banner */}
                <div
                  className={`p-3 rounded-xl text-white flex items-center justify-between ${
                    signageType === 'caution' ? 'bg-[#B45309]' : 'bg-[#2E2A26]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-[#FBD6C8]" />
                    <span className="text-xs font-black tracking-wider uppercase">
                      CITYSCAPE CIVIC NOTICE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-black text-[#FBD6C8]">
                    REF #{report.id.slice(-6)}
                  </span>
                </div>

                {/* Notice Headline */}
                <div className="p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E3DDD3] text-center">
                  <h4 className="text-xs sm:text-sm font-black text-[#2E2A26] uppercase tracking-tight">
                    {headlineText}
                  </h4>
                </div>

                {/* Main Issue Details & QR Code Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Left Column Details */}
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-1 bg-[#8F9E87] text-white text-[10px] font-black uppercase rounded-lg">
                      {catConf.label}
                    </span>
                    <h2 className="text-base font-black text-[#2E2A26] leading-snug line-clamp-2">
                      {report.title}
                    </h2>
                    <p className="text-xs text-stone-700 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8F9E87] shrink-0" />
                      <span className="truncate">{report.addressText || 'Local Ward Area'}</span>
                    </p>
                    <div className="text-[11px] text-stone-600 font-medium space-y-1 pt-1 border-t border-stone-200">
                      <p>
                        Current Status:{' '}
                        <strong className="text-[#2E2A26]">{statusConf.label}</strong>
                      </p>
                      <p>
                        Endorsements:{' '}
                        <strong className="text-[#8F9E87]">{report.upvotesCount} Neighbors</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right Column QR Box */}
                  <div className="flex flex-col items-center justify-center p-3 bg-white border-2 border-[#8F9E87] rounded-2xl shadow-sm text-center">
                    <img
                      src={qrImage300}
                      alt="Physical Infrastructure QR Tag"
                      className="w-36 h-36 object-contain rounded-lg border p-1"
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#2E2A26] mt-2">
                      SCAN WITH CAMERA
                    </span>
                  </div>
                </div>

                {/* Scan Steps Bar */}
                <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E3DDD3] space-y-1 text-left text-[11px] text-stone-800">
                  <p className="font-black text-[#2E2A26] text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#8F9E87]" />
                    How to interact with this physical report:
                  </p>
                  <ol className="list-decimal list-inside space-y-0.5 font-semibold text-[10.5px]">
                    <li>Open your smartphone camera & point at the QR code.</li>
                    <li>Tap the popup link to view full photo evidence & crew notes.</li>
                    <li>Endorse / Upvote to raise municipal dispatch priority.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Direct Deep Link Bar */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#2E2A26] dark:text-stone-200 block">
                Deep Link URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-[#E3DDD3] dark:border-stone-700 rounded-xl text-xs font-mono font-bold text-[#2E2A26] dark:text-stone-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black min-h-[42px] flex items-center justify-center space-x-1.5 transition-all cursor-pointer border ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#8F9E87] hover:bg-[#7E8D76] text-white border-[#7E8D76]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Toolbar Footer */}
          <div className="pt-3 border-t-2 border-[#E3DDD3] dark:border-stone-800 flex items-center justify-end gap-2 flex-wrap shrink-0">
            <a
              href={qrImageHighRes}
              download={`Cityscape-QR-${report.id.slice(0, 8)}.png`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 bg-[#FAF6F0] dark:bg-stone-800 hover:bg-stone-200/80 text-[#2E2A26] dark:text-stone-200 rounded-2xl text-xs font-black border border-[#E3DDD3] dark:border-stone-700 flex items-center space-x-1.5 transition-all cursor-pointer min-h-[48px]"
            >
              <Download className="w-4 h-4 text-[#8F9E87]" />
              <span>Download QR PNG</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-[#FAF6F0] dark:bg-stone-800 hover:bg-stone-200/80 text-[#2E2A26] dark:text-stone-200 rounded-2xl text-xs font-black border border-[#E3DDD3] dark:border-stone-700 flex items-center space-x-1.5 transition-all cursor-pointer min-h-[48px]"
            >
              <Printer className="w-4 h-4 text-[#2E2A26] dark:text-stone-300" />
              <span>Print Poster</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2.5 bg-[#8F9E87] hover:bg-[#7E8D76] text-white rounded-2xl text-xs font-black shadow-md flex items-center space-x-1.5 transition-all cursor-pointer min-h-[48px] disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-white" />
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Official PDF Poster'}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
