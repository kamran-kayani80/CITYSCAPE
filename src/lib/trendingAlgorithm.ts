/**
 * Time-Decay Trending Score Engine
 *
 * Implements velocity-based ranking so high-volume historic tags
 * do not permanently dominate the trending dashboard.
 *
 * Formula: Score = U_recent / ((T_now - T_created_hours + 2) ^ gamma)
 */

export interface HashtagRecord {
  id: string;
  name: string; // lowercased normalized tag name (e.g. "potholefix")
  displayName: string; // display casing (e.g. "PotholeFix")
  usageCount: number; // total lifetime post count
  recentCount: number; // posts in last 4 hours (U_recent)
  category?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  trendingScore?: number;
  velocityChangePct?: number; // e.g. +68%
  rank?: number;
  isFollowing?: boolean;
}

export interface CalculateTrendingOptions {
  gamma?: number; // Gravity factor (default 1.5)
  timeWindowHours?: number; // Recent window (default 4 hours)
  referenceTimeMs?: number; // Current timestamp in ms
}

/**
 * Calculates the time-decay trending score for a single hashtag record.
 */
export function calculateHashtagScore(
  tag: HashtagRecord,
  options: CalculateTrendingOptions = {}
): number {
  const gamma = options.gamma ?? 1.5;
  const now = options.referenceTimeMs ?? Date.now();

  // Parse tag creation/activity timestamp
  const tagCreatedAtMs = new Date(tag.createdAt).getTime();
  const ageHours = Math.max(0, (now - tagCreatedAtMs) / (1000 * 60 * 60));

  // Recent usage weight (U_recent)
  // If recentCount is 0, give small baseline from total usageCount
  const uRecent = tag.recentCount > 0 ? tag.recentCount : Math.min(tag.usageCount * 0.05, 0.5);

  // Time decay denominator: (T_age + 2) ^ gamma
  const denominator = Math.pow(ageHours + 2, gamma);

  // Velocity multiplier for spiking activity
  const velocityBonus = tag.recentCount >= 3 ? 1.4 : 1.0;

  const score = (uRecent / denominator) * 100 * velocityBonus;

  return Math.round(score * 100) / 100;
}

/**
 * Computes sorted trending tags with ranks and scores.
 */
export function computeTrendingHashtags(
  tags: HashtagRecord[],
  options: CalculateTrendingOptions = {}
): HashtagRecord[] {
  const scoredTags = tags.map((tag) => {
    const score = calculateHashtagScore(tag, options);
    // Estimated velocity percentage vs previous period
    const estimatedPrevCount = Math.max(1, tag.usageCount - tag.recentCount);
    const velocityChangePct = Math.round(
      ((tag.recentCount * 2) / (estimatedPrevCount + tag.recentCount)) * 100
    );

    return {
      ...tag,
      trendingScore: score,
      velocityChangePct: Math.min(999, Math.max(12, velocityChangePct)),
    };
  });

  // Sort descending by calculated time-decay score
  scoredTags.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));

  // Assign 1-indexed ranks
  return scoredTags.map((tag, idx) => ({
    ...tag,
    rank: idx + 1,
  }));
}
