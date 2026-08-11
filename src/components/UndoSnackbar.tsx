import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, Undo2, RotateCcw, Clock, X, Check, Zap } from 'lucide-react';

export interface UndoUpvoteState {
  reportId: string;
  reportTitle: string;
  isUpvoted: boolean;
  expiresAt: number;
}

interface UndoSnackbarProps {
  undoState: UndoUpvoteState | null;
  onUndo: () => void;
  onDismiss: () => void;
  onSyncImmediately?: () => void;
}

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({
  undoState,
  onUndo,
  onDismiss,
  onSyncImmediately,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(5);

  useEffect(() => {
    if (!undoState) return;

    const updateCountdown = () => {
      const remainingMs = Math.max(0, undoState.expiresAt - Date.now());
      const remainingSec = Math.ceil(remainingMs / 1000);
      setSecondsLeft(remainingSec);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 200);

    return () => clearInterval(interval);
  }, [undoState]);

  if (!undoState) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={undoState.reportId + undoState.expiresAt}
        initial={{ opacity: 0, y: 48, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:max-w-md w-auto bg-[#0A2540] text-white rounded-2xl shadow-2xl border-2 border-[#006D5B] overflow-hidden font-['Montserrat']"
        role="alert"
        aria-live="assertive"
      >
        {/* Animated 5-second draining progress bar */}
        <div className="w-full bg-slate-800/80 h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-[#CCFF00] via-amber-400 to-[#B45309]"
          />
        </div>

        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          {/* Status icon & message */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-[#006D5B]/80 text-[#CCFF00] border border-[#CCFF00]/40 flex items-center justify-center shrink-0">
              <ThumbsUp className={`w-4 h-4 ${undoState.isUpvoted ? 'text-[#CCFF00]' : 'text-slate-300'}`} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black tracking-wide text-white truncate">
                  {undoState.isUpvoted ? 'Endorsement Added' : 'Endorsement Removed'}
                </span>
                <span className="inline-flex items-center space-x-1 bg-[#006D5B]/60 text-[#CCFF00] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border border-[#006D5B]">
                  <Clock className="w-2.5 h-2.5 inline" />
                  <span>{secondsLeft}s window</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                "{undoState.reportTitle}"
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Undo button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={onUndo}
              className="bg-[#B45309] hover:bg-amber-600 text-white px-3.5 py-2 rounded-xl text-xs font-black tracking-wider uppercase flex items-center space-x-1.5 shadow-md border border-amber-300/40 cursor-pointer min-h-[44px]"
              aria-label="Undo upvote action"
            >
              <Undo2 className="w-4 h-4" />
              <span>UNDO</span>
            </motion.button>

            {/* Dismiss button */}
            <button
              onClick={onDismiss}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
