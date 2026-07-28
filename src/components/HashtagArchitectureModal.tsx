import React, { useState } from 'react';
import { Database, Code, Copy, Check, Terminal, Cpu, Flame, Layers, Sparkles } from 'lucide-react';

interface HashtagArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HashtagArchitectureModal: React.FC<HashtagArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'function' | 'algorithm' | 'api'>('schema');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSchemaCode = `-- 1. Core Hashtags Table with normalized name lookups
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,       -- Normalized lowercased string (e.g. "potholefix")
  display_name TEXT NOT NULL,      -- Original display casing (e.g. "PotholeFix")
  usage_count INT DEFAULT 1,       -- Atomic counter of post occurrences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast trigram fuzzy auto-complete search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_hashtags_name_trgm ON hashtags USING gin (name gin_trgm_ops);

-- 2. Many-to-Many Join Table linking Posts & Hashtags
CREATE TABLE IF NOT EXISTS post_hashtags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id UUID REFERENCES hashtags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE INDEX IF NOT EXISTS idx_post_hashtags_tag_time ON post_hashtags (hashtag_id, created_at DESC);`;

  const plpgsqlFunctionCode = `-- 3. Atomic Increment & Link PL/pgSQL Function
CREATE OR REPLACE FUNCTION process_post_hashtags(
  p_post_id UUID,
  p_tags TEXT[],        -- Normalized lowercased names
  p_display_tags TEXT[] -- Original display casing
) RETURNS VOID AS $$
DECLARE
  v_tag_id UUID;
  i INT;
BEGIN
  IF array_length(p_tags, 1) IS NULL THEN
    RETURN;
  END IF;

  FOR i IN 1..array_length(p_tags, 1) LOOP
    -- Upsert hashtag with atomic usage_count increment
    INSERT INTO hashtags (name, display_name, usage_count)
    VALUES (p_tags[i], p_display_tags[i], 1)
    ON CONFLICT (name) DO UPDATE
      SET usage_count = hashtags.usage_count + 1,
          updated_at = NOW()
    RETURNING id INTO v_tag_id;

    -- Link post to hashtag
    INSERT INTO post_hashtags (post_id, hashtag_id)
    VALUES (p_post_id, v_tag_id)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;`;

  const algorithmMathText = `Time-Decay Gravity Formula for Trending Score:

Score = U_recent / ((T_now - T_created + 2) ^ gamma)

Where:
  • U_recent: Number of posts referencing the hashtag in recent timeframe (e.g., past 4h)
  • T_now - T_created: Age in hours of hashtag activity
  • gamma: Gravity decay exponent (default 1.5)
  • Velocity multiplier: 1.4x bonus applied when recent spike threshold is breached (>3 posts in 4h)

This prevents historical high-volume tags from permanently clogging the trending feed.`;

  const apiRoutesCode = `GET  /api/hashtags/trending
     Returns velocity-decay ranked top tags with real-time scores and post counts.

GET  /api/hashtags/autocomplete?q=pothole
     Trigram prefix search for live auto-complete composer menu.

GET  /api/hashtags/:tag
     Fetches tag metadata, follower stats, top/latest/media feeds.

POST /api/hashtags/follow
     Toggles persistent user subscription to tag updates.`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'schema':
        return sqlSchemaCode;
      case 'function':
        return plpgsqlFunctionCode;
      case 'algorithm':
        return algorithmMathText;
      case 'api':
        return apiRoutesCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-indigo-900/80 overflow-hidden my-auto p-6 sm:p-8 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-800 text-amber-300 flex items-center justify-center font-bold shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                <span>Hashtag Engine Architecture & SQL Schema</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                PostgreSQL • pg_trgm • Time-Decay Gravity Scoring • Express API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-full cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'schema'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. SQL Tables & GIN Index</span>
          </button>

          <button
            onClick={() => setActiveTab('function')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'function'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. PL/pgSQL Atomic Function</span>
          </button>

          <button
            onClick={() => setActiveTab('algorithm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'algorithm'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Time-Decay Formula</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'api'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>4. Express REST API</span>
          </button>
        </div>

        {/* Code Output Display */}
        <div className="relative group">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 border border-slate-700 cursor-pointer transition-all z-10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied Snippet' : 'Copy SQL/Code'}</span>
          </button>

          <pre className="p-4 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed max-h-96">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-800">
          <span className="font-mono text-[11px] text-emerald-400">
            ✓ Production-Ready Engine Active on CITYSCAPE Express Backend
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
