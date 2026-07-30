import React, { useState, useEffect, useRef } from 'react';
import { Tag, Sparkles, TrendingUp, Hash, Check } from 'lucide-react';
import { HashtagRecord } from '../lib/trendingAlgorithm';

interface HashtagInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  required?: boolean;
}

export const HashtagInput: React.FC<HashtagInputProps> = ({
  value,
  onChange,
  placeholder = 'Describe the issue or proposal... Type # to add hashtags (e.g. #PotholeFix #SF94102)',
  rows = 4,
  className = '',
  required = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [suggestions, setSuggestions] = useState<HashtagRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const [matchQuery, setMatchQuery] = useState('');
  const [hashtagRange, setHashtagRange] = useState<{ start: number; end: number } | null>(null);

  // Suggested popular default tags when user types "#" without additional query
  const defaultPopularTags: HashtagRecord[] = [
    { id: '1', name: 'potholefix', displayName: 'PotholeFix', usageCount: 48, recentCount: 12, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'streetlighting', displayName: 'StreetLighting', usageCount: 34, recentCount: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'waterleak', displayName: 'WaterLeak', usageCount: 29, recentCount: 7, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', name: 'sanitation', displayName: 'Sanitation', usageCount: 21, recentCount: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', name: 'parksafety', displayName: 'ParkSafety', usageCount: 18, recentCount: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  // Monitor cursor position and text for '#' character
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursor = e.target.selectionStart;
    checkHashtagTrigger(newValue, cursor);
  };

  const handleSelectionOrClick = () => {
    if (textareaRef.current) {
      checkHashtagTrigger(value, textareaRef.current.selectionStart);
    }
  };

  const checkHashtagTrigger = (text: string, cursorPos: number) => {
    const textBeforeCursor = text.slice(0, cursorPos);
    // Look for last `#` word segment before cursor
    const match = textBeforeCursor.match(/#([\p{L}\p{N}_]*)$/u);

    if (match) {
      const hashIndex = textBeforeCursor.lastIndexOf('#');
      const query = match[1];
      setMatchQuery(query);
      setHashtagRange({ start: hashIndex, end: cursorPos });
      fetchSuggestions(query);
      setIsOpen(true);
      setHighlightIdx(0);
    } else {
      setIsOpen(false);
      setHashtagRange(null);
    }
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch(`/api/hashtags/autocomplete?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.hashtags && data.hashtags.length > 0) {
          setSuggestions(data.hashtags);
          return;
        }
      }
    } catch (err) {
      console.warn('Autocomplete fetch fallback:', err);
    }

    // Fallback filtering
    if (!query) {
      setSuggestions(defaultPopularTags);
    } else {
      const filtered = defaultPopularTags.filter(
        (t) =>
          t.name.includes(query.toLowerCase()) ||
          t.displayName.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const selectTag = (tagDisplayName: string) => {
    if (!hashtagRange || !textareaRef.current) return;

    const before = value.slice(0, hashtagRange.start);
    const after = value.slice(hashtagRange.end);
    const inserted = `#${tagDisplayName} `;
    const updatedValue = before + inserted + after;

    onChange(updatedValue);
    setIsOpen(false);

    // Reposition cursor
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = before.length + inserted.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const selected = suggestions[highlightIdx];
      if (selected) {
        selectTag(selected.displayName);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onClick={handleSelectionOrClick}
        onKeyUp={handleSelectionOrClick}
        onKeyDown={handleKeyDown}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={`w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080]/30 focus:border-[#008080] font-sans leading-relaxed resize-none transition-all ${className}`}
      />

      {/* Floating Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-slate-900 border border-[#008080]/30 dark:border-[#008080]/60 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 font-['Montserrat']">
          <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#008080] dark:text-[#CCFF00] flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#CCFF00] animate-spin" />
              <span>Matching Hashtags {matchQuery ? `("#${matchQuery}")` : ''}</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400">Press Enter or Tab</span>
          </div>

          {suggestions.length === 0 ? (
            <div
              onClick={() => selectTag(matchQuery || 'CityFix')}
              className="p-2.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-[#008080]/10 dark:hover:bg-[#008080]/20 rounded-xl cursor-pointer flex items-center justify-between font-mono"
            >
              <div className="flex items-center gap-1.5 font-bold text-[#008080] dark:text-[#CCFF00]">
                <Hash className="w-3.5 h-3.5" />
                <span>Create new tag #{matchQuery}</span>
              </div>
              <span className="text-[10px] bg-[#008080]/20 text-[#008080] dark:text-[#CCFF00] px-2 py-0.5 rounded-md">New Tag</span>
            </div>
          ) : (
            suggestions.map((tag, idx) => {
              const isHighlighted = idx === highlightIdx;
              return (
                <div
                  key={tag.id || tag.name}
                  onClick={() => selectTag(tag.displayName)}
                  onMouseEnter={() => setHighlightIdx(idx)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    isHighlighted
                      ? 'bg-[#008080] text-white shadow-sm font-bold'
                      : 'hover:bg-[#008080]/10 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isHighlighted
                          ? 'bg-[#006666] text-[#CCFF00]'
                          : 'bg-[#008080]/20 dark:bg-[#008080]/30 text-[#008080] dark:text-[#CCFF00]'
                      }`}
                    >
                      #
                    </div>
                    <div>
                      <div className="font-mono font-bold text-xs">
                        #{tag.displayName}
                      </div>
                      <div className={`text-[10px] ${isHighlighted ? 'text-teal-100' : 'text-slate-400'}`}>
                        {tag.usageCount} community reports
                      </div>
                    </div>
                  </div>

                  {tag.recentCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 ${
                        isHighlighted
                          ? 'bg-[#004d4d] text-[#CCFF00]'
                          : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40'
                      }`}
                    >
                      <TrendingUp className="w-2.5 h-2.5" />
                      +{tag.recentCount} recent
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
