export interface ShareDataPayload {
  type: 'report' | 'bulletin' | 'event' | 'hashtag' | 'article';
  title: string;
  text: string;
  url: string;
  idOrTag?: string;
  address?: string;
  category?: string;
}

export function getShareableUrl(type: ShareDataPayload['type'], idOrTag: string): string {
  // Use current live origin so all shared links are immediately accessible
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://cityscape.community';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const basePath = pathname === '/' ? '' : pathname;

  switch (type) {
    case 'report':
      return `${origin}${basePath}?reportId=${encodeURIComponent(idOrTag)}`;
    case 'bulletin':
      return `${origin}${basePath}?bulletinId=${encodeURIComponent(idOrTag)}`;
    case 'event':
      return `${origin}${basePath}?eventId=${encodeURIComponent(idOrTag)}`;
    case 'hashtag':
      return `${origin}${basePath}?tag=${encodeURIComponent(idOrTag)}`;
    case 'article':
      return `${origin}${basePath}?articleId=${encodeURIComponent(idOrTag)}`;
    default:
      return `${origin}${pathname}`;
  }
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
