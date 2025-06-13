"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "@/components/ui/enhanced-share";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import Image from "next/image";

type UserBadge = Tables<"UserBadge"> & {
  Badge: Tables<"Badge">;
};

export function UserBadgesClient({ badges }: { badges: UserBadge[] }) {
  const supabase = createClient();
  const { userId } = useParams();
  const showToast = (message: string) => {
    toast.success(message);
  };

  const createShareContent = (userBadge: UserBadge) => {
    const badgeName = userBadge.Badge.name;
    const badgeDescription = userBadge.Badge.description;
    const earnedDate = new Date(userBadge.earnedAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const badgeShareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/user/${userId}/badge/${userBadge.badgeId}`
        : "";

    const shareTitle = `Just earned my "${badgeName}" badge!`;
    const shareText = `Just earned my "${badgeName}" badge!

${
  badgeDescription
    ? `${badgeDescription}

`
    : ""
}Earned on: ${earnedDate}

Check out my profile to see all my achievements!`;

    return {
      url: badgeShareUrl,
      title: shareTitle,
      text: shareText,
      earnedDate,
    };
  };

  if (badges.length === 0) {
    return <p className="text-muted-foreground">No badges earned yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {badges.map((userBadge) => {
          const shareContent = createShareContent(userBadge);

          const publicIconUrl = supabase.storage
            .from("badges")
            .getPublicUrl(userBadge.Badge.iconUrl).data.publicUrl;
          return (
            <Dialog key={userBadge.badgeId}>
              {" "}
              <div className="relative flex flex-col items-center space-y-3 p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-60 hover:opacity-100 transition-opacity duration-200"
                    aria-label={`Share ${userBadge.Badge.name} badge`}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <div className="w-28 h-28 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    className="w-full h-full object-contain"
                    src={publicIconUrl}
                    alt={userBadge.Badge.name}
                    width={112}
                    height={112}
                  />
                </div>

                <div className="text-center space-y-1 w-full">
                  <Link href={`/badges/${userBadge.Badge.id}`} passHref>
                    <h3 className="text-sm font-semibold text-foreground hover:text-primary cursor-pointer transition-colors duration-200 line-clamp-2">
                      {userBadge.Badge.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground">
                    {shareContent.earnedDate}
                  </p>
                </div>
              </div>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    Share Your Badge
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={publicIconUrl}
                        alt={userBadge.Badge.name}
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold">
                          {userBadge.Badge.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Earned on {shareContent.earnedDate}
                        </p>
                      </div>
                    </div>
                    {userBadge.Badge.description && (
                      <p className="text-sm text-muted-foreground">
                        {userBadge.Badge.description}
                      </p>
                    )}
                  </div>{" "}
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your achievement with your friends and network!
                  </p>{" "}
                  <div className="flex justify-around items-center space-x-2">
                    {["whatsapp", "twitter", "linkedin", "generic"].map(
                      (platform) => (
                        <ShareButton
                          key={platform}
                          platform={platform as any}
                          url={shareContent.url}
                          title={shareContent.title}
                          text={shareContent.text}
                          showToast={showToast}
                        />
                      )
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </>
  );
}
