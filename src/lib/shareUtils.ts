export interface ShareDataPayload {
  type: 'report' | 'bulletin' | 'event' | 'hashtag' | 'article' | 'trial_invite' | 'app_download';
  title: string;
  text: string;
  url: string;
  idOrTag?: string;
  address?: string;
  category?: string;
  wardName?: string;
  referralCode?: string;
}

export function getShareableUrl(
  type: ShareDataPayload['type'],
  idOrTag?: string,
  extraParams?: Record<string, string>
): string {
  // Use current live origin so all shared links are immediately accessible
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://cityscape.community';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const basePath = pathname === '/' ? '' : pathname;

  const urlObj = new URL(`${origin}${basePath}`);
  
  if (type === 'report' && idOrTag) {
    urlObj.searchParams.set('reportId', idOrTag);
  } else if (type === 'bulletin' && idOrTag) {
    urlObj.searchParams.set('bulletinId', idOrTag);
  } else if (type === 'event' && idOrTag) {
    urlObj.searchParams.set('eventId', idOrTag);
  } else if (type === 'hashtag' && idOrTag) {
    urlObj.searchParams.set('tag', idOrTag);
  } else if (type === 'article' && idOrTag) {
    urlObj.searchParams.set('articleId', idOrTag);
  } else if (type === 'trial_invite') {
    urlObj.searchParams.set('trial_invite', 'true');
    urlObj.searchParams.set('source', 'neighbor_invite');
  } else if (type === 'app_download') {
    urlObj.searchParams.set('install', 'true');
  }

  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) urlObj.searchParams.set(k, v);
    });
  }

  return urlObj.toString();
}

export function getPlatformSpecificUrl(platform: 'mobile' | 'desktop' | 'universal', inviteCode?: string): string {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://cityscape.community';
  const urlObj = new URL(origin);
  urlObj.searchParams.set('trial', 'active');
  urlObj.searchParams.set('platform', platform);
  if (inviteCode) urlObj.searchParams.set('ref', inviteCode);
  return urlObj.toString();
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && Boolean(navigator.share);
}

export async function triggerNativeShare(data: ShareDataPayload): Promise<boolean> {
  if (canNativeShare()) {
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      });
      return true;
    } catch (err) {
      // User cancelled or share failed, return false so fallback modal can remain or handle gracefully
      if ((err as Error).name !== 'AbortError') {
        console.warn('Native share error:', err);
      }
      return false;
    }
  }
  return false;
}

export function getSocialShareLinks(data: ShareDataPayload) {
  const fullMessage = `${data.title}\n${data.text}`;
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedMessage = encodeURIComponent(fullMessage);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${data.title} - ${data.url}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedMessage}%0A%0AView%20on%20CITYSCAPE:%20${encodedUrl}`,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`,
  };
}
