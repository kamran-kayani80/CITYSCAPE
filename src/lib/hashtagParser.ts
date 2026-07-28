/**
 * Dynamic Text Parsing & Tokenization Engine for Hashtags
 * Supports Unicode/multi-language text using PCRE-compatible Unicode property escapes.
 */

export interface ParsedHashtag {
  name: string; // Normalized lowercased string (e.g. "potholefix")
  displayName: string; // Original display casing (e.g. "PotholeFix")
  tagWithHash: string; // Display with leading hash (e.g. "#PotholeFix")
  startIndex: number;
  endIndex: number;
}

export interface TextSegment {
  type: 'text' | 'hashtag';
  content: string;
  tagInfo?: ParsedHashtag;
}

/**
 * Regex pattern matching hashtags safely across international character sets.
 * \p{L}: Any letter in any language (Latin, Cyrillic, CJK, Arabic, Devanagari, etc.)
 * \p{N}: Any numeric character
 * _: Underscore
 * Uses unicode flag 'u' and global flag 'g'
 */
export const HASHTAG_REGEX = /#([\p{L}\p{N}_]+)/gu;

/**
 * Extract all unique hashtags from post or report text.
 */
export function extractHashtags(text: string): {
  tags: string[]; // Normalized lowercased unique tag names
  displayTags: string[]; // Corresponding original casing
  details: ParsedHashtag[];
} {
  if (!text) {
    return { tags: [], displayTags: [], details: [] };
  }

  const details: ParsedHashtag[] = [];
  const tagSet = new Set<string>();
  const displayTags: string[] = [];
  const tags: string[] = [];

  // Reset regex state before matching
  HASHTAG_REGEX.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = HASHTAG_REGEX.exec(text)) !== null) {
    const rawTagContent = match[1];
    // Exclude purely numeric tags if desired, or keep if valid (e.g. #SF94102 or #2026)
    if (!rawTagContent) continue;

    const normalizedName = rawTagContent.toLowerCase();
    const displayName = rawTagContent;
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    details.push({
      name: normalizedName,
      displayName,
      tagWithHash: `#${displayName}`,
      startIndex,
      endIndex,
    });

    if (!tagSet.has(normalizedName)) {
      tagSet.add(normalizedName);
      tags.push(normalizedName);
      displayTags.push(displayName);
    }
  }

  return { tags, displayTags, details };
}

/**
 * Tokenize a block of text into plain text chunks and interactive hashtag segments.
 */
export function parseTextSegments(text: string): TextSegment[] {
  if (!text) return [];

  const segments: TextSegment[] = [];
  const { details } = extractHashtags(text);

  if (details.length === 0) {
    return [{ type: 'text', content: text }];
  }

  let lastIndex = 0;

  for (const item of details) {
    if (item.startIndex > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, item.startIndex),
      });
    }

    segments.push({
      type: 'hashtag',
      content: item.tagWithHash,
      tagInfo: item,
    });

    lastIndex = item.endIndex;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * Sanitizes and formats a single hashtag input string.
 * e.g. "  #PotholeFix!  " -> "potholefix"
 */
export function sanitizeHashtagInput(input: string): string {
  if (!input) return '';
  return input.trim().replace(/^#+/, '').replace(/[^\p{L}\p{N}_]/gu, '').toLowerCase();
}
