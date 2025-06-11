'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Share2 } from 'lucide-react';
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
} from 'react-share';
import type { Tables } from '@/lib/supabase/database.types';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';
import Image from "next/image";

type UserBadgeWithImage = Tables<'UserBadge'> & {
    Badge: Tables<'Badge'> & { imageUrl?: string }
};

interface UserBadgesClientProps {
    badges: UserBadgeWithImage[];
}

export default function UserBadgesClient({ badges }: UserBadgesClientProps) {

    const supabase = createClient();
    const params = useParams();
    const userId = params.userId; 
    if (badges.length === 0) {
        return <p className="text-muted-foreground">No badges earned yet.</p>;
    }

    return (
        <>
            <div className="flex flex-wrap gap-6"> 
                {badges.map((userBadge) => {
                    const badgeUrl = typeof window !== 'undefined' ? `${window.location.origin}/user/${userId}` : ''; 
                    const shareTitle = `Check out my ${userBadge.Badge.name} badge!`;
                    const badgeDescription = userBadge.Badge.description ?? '';
                    const publicIconUrl = supabase.storage.from('badges').getPublicUrl(userBadge.Badge.iconUrl).data.publicUrl;
                    

                    return (                        <Dialog key={userBadge.badgeId}>
                            <div
                                className="group relative w-32 h-32 rounded-lg shadow-sm overflow-hidden cursor-pointer"
                            >
                                <Image
                                  className="w-full h-full object-cover"
                                  src={publicIconUrl}
                                  alt={userBadge.Badge.name}
                                  width={128}
                                  height={128}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-black/30 dark:bg-black/50 p-2">
                                    <Link href={`/badges/${userBadge.Badge.id}`} passHref>
                                        <span className="text-white text-sm font-semibold text-center mb-2 hover:underline cursor-pointer">
                                            {userBadge.Badge.name}
                                        </span>
                                    </Link>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:text-primary hover:bg-white/20 cursor-pointer" 
                                            aria-label={`Share ${userBadge.Badge.name} badge`}
                                        >
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </div>

                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Share &quot;{userBadge.Badge.name}&quot; Badge</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Share your achievement with your friends and network!
                                    </p>
                                    <div className="flex justify-around items-center space-x-2">
                                        <FacebookShareButton url={badgeUrl} hashtag={`#${userBadge.Badge.name.replace(/\s+/g, '')}`} className="cursor-pointer">
                                            <FacebookIcon size={32} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton url={badgeUrl} title={shareTitle} className="cursor-pointer">
                                            <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                        <LinkedinShareButton url={badgeUrl} title={shareTitle} summary={badgeDescription} className="cursor-pointer">
                                            <LinkedinIcon size={32} round />
                                        </LinkedinShareButton>
                                        <WhatsappShareButton url={badgeUrl} title={shareTitle} separator=":: " className="cursor-pointer">
                                            <WhatsappIcon size={32} round />
                                        </WhatsappShareButton>
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
