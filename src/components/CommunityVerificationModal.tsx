import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Camera, Sparkles, ShieldCheck, ThumbsUp, Upload } from 'lucide-react';
import { Report, IssueVerification } from '../types';

interface CommunityVerificationModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: (verification: IssueVerification, karmaAwarded: number) => void;
}

export const CommunityVerificationModal: React.FC<CommunityVerificationModalProps> = ({
  report,
  isOpen,
  onClose,
  onVerificationSuccess,
}) => {
  const [statusConfirmed, setStatusConfirmed] = useState<'RESOLVED' | 'STILL_BROKEN'>('RESOLVED');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ karma: number; message: string } | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/reports/${report.id}/verifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusConfirmed,
          photoUrl,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit verification');

      const data = await res.json();
      const karma = data.karmaAwarded || 25;

      setCelebrationData({
        karma,
        message: statusConfirmed === 'RESOLVED'
          ? 'Verification recorded! Neighborhood confidence boosted by +15%.'
          : 'Ground update logged! Municipal team flagged for priority re-inspection.',
      });

      setTimeout(() => {
        onVerificationSuccess(data.verification, karma);
        setIsSubmitting(false);
      }, 1800);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden relative max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ground Verification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Confirm repair status on site</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {celebrationData ? (
          /* Confetti / Reward Success Splash */
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-300 overflow-y-auto">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg shadow-amber-500/30 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider rounded-full mb-2">
                +{celebrationData.karma} Civic Karma Earned!
              </span>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Ground Check Verified!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                {celebrationData.message}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium">
              🤝 Thank you for keeping your local community database accurate and trustworthy.
            </div>
          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-5 space-y-4 overflow-y-auto flex-1 max-h-[calc(92vh-130px)]">
              {/* Target Issue Brief */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <img
                src={report.imageUrls[0]}
                alt={report.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Issue #{report.id}</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{report.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{report.addressText}</p>
              </div>
            </div>

            {/* Status Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                What is the current ground status?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatusConfirmed('RESOLVED')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    statusConfirmed === 'RESOLVED'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${statusConfirmed === 'RESOLVED' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold">Fix Confirmed</div>
                    <div className="text-[10px] opacity-80">Repaired & safe on site</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusConfirmed('STILL_BROKEN')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    statusConfirmed === 'STILL_BROKEN'
                      ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30 text-red-900 dark:text-red-300 ring-2 ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${statusConfirmed === 'STILL_BROKEN' ? 'text-red-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold">Still Broken</div>
                    <div className="text-[10px] opacity-80">Needs municipal follow-up</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Photo Upload (Optional for +10 Karma) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ground Photo Proof</span>
                </label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                  +10 Bonus Karma
                </span>
              </div>

              {photoUrl ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={photoUrl} alt="Ground proof" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-xl cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Snap or upload current site photo
                  </span>
                  <span className="text-[10px] text-slate-400">JPG, PNG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Verification Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Fresh asphalt cold-patch installed properly. Path clear..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
              />
            </div>

            </div>

            {/* Actions Footer - Sticky */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0 sticky bottom-0 z-20">
              <button
                type="button"
                onClick={onClose}
                className="btn-soft-tactile px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-designer flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold disabled:opacity-50 cursor-pointer min-h-[44px]"
              >
                {isSubmitting ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Verification (+15 Karma)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
