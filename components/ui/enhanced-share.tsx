'use client';

import {
  TwitterShareButton,
  LinkedinShareButton,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

type SharePlatform = 'whatsapp' | 'twitter' | 'linkedin' | 'generic';

interface ShareButtonProps {
  platform: SharePlatform;
  url: string;
  title: string;
  text?: string;
  size?: number;
  round?: boolean;
  className?: string;
  showToast?: (message: string) => void;
}

const getShareContent = (title: string, text?: string, url?: string) => {
  return text || `${title}\n\n${url || ''}`;
};

export const ShareButton = ({ 
  platform,
  url, 
  title, 
  text, 
  size = 32, 
  round = true, 
  className = "",
  showToast 
}: ShareButtonProps) => {
  const shareContent = getShareContent(title, text, url);

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareContent)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleGenericShare = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Try Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      navigator.share({
        title: title,
        text: shareContent,
        url: url
      }).then(() => {
        showToast?.('Content shared successfully!');
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to clipboard
        fallbackToClipboard(shareContent);
      });
    } else {
      // Fallback to clipboard for browsers without Web Share API
      fallbackToClipboard(shareContent);
    }
  };
  
  const fallbackToClipboard = (content: string) => {
    navigator.clipboard?.writeText(content).then(() => {
      showToast?.('Content copied to clipboard!');
    }).catch(() => {
      showToast?.('Please copy this content manually to share.');
    });
  };

  const getAriaLabel = () => {
    switch (platform) {
      case 'whatsapp': return 'Share on WhatsApp';
      case 'twitter': return 'Share on Twitter';
      case 'linkedin': return 'Share on LinkedIn';
      case 'generic': return 'Share content';
      default: return 'Share';
    }
  };

  switch (platform) {
    case 'whatsapp':
      return (
        <button 
          onClick={handleWhatsAppShare}
          className={`cursor-pointer ${className}`}
          aria-label={getAriaLabel()}
        >
          <WhatsappIcon size={size} round={round} />
        </button>
      );

    case 'twitter':
      return (
        <TwitterShareButton 
          url={url} 
          title={shareContent}
          className={`cursor-pointer ${className}`}
        >
          <TwitterIcon size={size} round={round} />
        </TwitterShareButton>
      );

    case 'linkedin':
      return (
        <LinkedinShareButton 
          url={url} 
          title={title}
          summary={shareContent}
          className={`cursor-pointer ${className}`}
        >
          <LinkedinIcon size={size} round={round} />
        </LinkedinShareButton>
      );

    case 'generic':
      return (
        <button 
          onClick={handleGenericShare}
          className={`cursor-pointer ${className}`}
          aria-label={getAriaLabel()}
        >
          <div 
            className={`${round ? 'rounded-full' : 'rounded'} overflow-hidden bg-gray-600 hover:bg-gray-700 transition-colors`}
            style={{
              width: size,
              height: size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg 
              width={size * 0.6} 
              height={size * 0.6} 
              viewBox="0 0 24 24" 
              fill="white"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
          </div>
        </button>
      );

    default:
      return null;
  }
};