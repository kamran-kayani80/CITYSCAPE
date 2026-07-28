import React from 'react';
import { parseTextSegments } from '../lib/hashtagParser';
import { Tag } from 'lucide-react';

interface RichPostContentProps {
  content: string;
  className?: string;
  onHashtagClick?: (hashtag: string, e: React.MouseEvent) => void;
  hashtagBadgeClassName?: string;
}

export const RichPostContent: React.FC<RichPostContentProps> = ({
  content,
  className = 'text-xs text-slate-700 dark:text-slate-300 leading-relaxed',
  onHashtagClick,
  hashtagBadgeClassName,
}) => {
  if (!content) return null;

  const segments = parseTextSegments(content);

  const handleTagClick = (tagName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onHashtagClick) {
      onHashtagClick(tagName, e);
    } else {
      // Default: dispatch custom event or route to hashtag
      const event = new CustomEvent('cityscape:navigate-hashtag', {
        detail: { tag: tagName },
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <span key={idx}>{seg.content}</span>;
        }

        const tagName = seg.tagInfo?.name || seg.content.replace('#', '').toLowerCase();
        const displayTag = seg.tagInfo?.tagWithHash || seg.content;

        return (
          <span
            key={idx}
            onClick={(e) => handleTagClick(tagName, e)}
            className={
              hashtagBadgeClassName ||
              `inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 my-0.5 rounded-md font-mono font-bold text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-all cursor-pointer shadow-2xs`
            }
            title={`Explore #${tagName} reports & trending feed`}
          >
            <Tag className="w-2.5 h-2.5 opacity-70 shrink-0" />
            <span>{displayTag}</span>
          </span>
        );
      })}
    </div>
  );
};
