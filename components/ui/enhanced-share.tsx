"use client";

import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

type SharePlatform = "whatsapp" | "twitter" | "linkedin" | "generic";

interface ShareButtonProps {
  platform: SharePlatform;
  url: string;
  title: string;
  text?: string;
  showToast?: (message: string) => void;
}

export const ShareButton = ({
  platform,
  url,
  title,
  text,
  showToast,
}: ShareButtonProps) => {
  const handleGenericShare = (e: React.MouseEvent) => {
    e.preventDefault();

    navigator
      .share({
        title: title,
        text: text,
        url: url,
      })
      .then(() => {
        showToast?.("Content shared successfully!");
      })
      .catch((error) => {
        console.log("Error sharing:", error);
        showToast?.("Failed to share content.");
      });
  };

  switch (platform) {
    case "whatsapp":
      return (
        <WhatsappShareButton
          url={url}
          title={text}
          className={`cursor-pointer `}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      );

    case "twitter":
      return (
        <TwitterShareButton
          url={url}
          title={text}
          className={`cursor-pointer `}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      );

    case "linkedin":
      return (
        <LinkedinShareButton
          url={url}
          title={title}
          summary={text}
          source="ACE | SASTRA"
          className={`cursor-pointer `}
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      );

    case "generic":
      return (
        <button onClick={handleGenericShare} className={`cursor-pointer `}>
          <div
            className={`rounded-full overflow-hidden bg-gray-600 hover:bg-gray-700 transition-colors`}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={32 * 0.6}
              height={32 * 0.6}
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
          </div>
        </button>
      );

    default:
      return null;
  }
};
