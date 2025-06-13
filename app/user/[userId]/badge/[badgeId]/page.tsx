import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CONFIG, getAbsoluteUrl } from "@/lib/config";

// Generate dynamic metadata for badge sharing
export async function generateMetadata({
  params: paramsFromProps,
}: {
  params: Promise<{ userId: string; badgeId: string }>;
}): Promise<Metadata> {
  const params = await paramsFromProps;
  const supabase = await createClient();
  
  // Fetch user profile and badge data
  const [userProfileResult, userBadgeResult] = await Promise.all([
    supabase
      .from("UserProfile")
      .select("*")
      .eq("id", params.userId)
      .single(),
    supabase
      .from("UserBadge")
      .select(`
        *,
        Badge (*)
      `)
      .eq("userId", params.userId)
      .eq("badgeId", params.badgeId)
      .single()
  ]);

  if (userProfileResult.error || userBadgeResult.error || !userProfileResult.data || !userBadgeResult.data) {
    return {
      title: "Badge Not Found - ACE SASTRA",
      description: "The requested badge could not be found.",
    };
  }

  const userProfile = userProfileResult.data;
  const userBadge = userBadgeResult.data;
  const badge = userBadge.Badge;

  const earnedDate = new Date(userBadge.earnedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  });

  const badgeImageUrl = supabase.storage
    .from("badges")
    .getPublicUrl(badge.iconUrl).data.publicUrl;

  const title = `${userProfile.name} earned "${badge.name}" badge!`;
  const description = `${userProfile.name} just earned the "${badge.name}" badge at ACE SASTRA on ${earnedDate}.${badge.description ? ` ${badge.description}` : ''}`;
  const url = getAbsoluteUrl(`/user/${params.userId}/badge/${params.badgeId}`);
  const profileUrl = getAbsoluteUrl(`/user/${params.userId}`);

  return {
    title,
    description,
    keywords: [`ACE SASTRA`, `${userProfile.name}`, `${badge.name}`, `badge`, `achievement`, `${userProfile.department}`],
    openGraph: {
      title,
      description,
      url,
      siteName: CONFIG.site.name,
      locale: "en_US",
      type: "article",
      images: [
        {
          url: badgeImageUrl,
          width: 400,
          height: 400,
          alt: `${badge.name} badge earned by ${userProfile.name}`,
        },
      ],
      publishedTime: userBadge.earnedAt,
      authors: [userProfile.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [badgeImageUrl],
      site: "@ACE_SASTRA",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: profileUrl, 
    },
  };
}

export default async function BadgeSharePage({
  params: paramsFromProps,
}: {
  params: Promise<{ userId: string; badgeId: string }>;
}) {
  const params = await paramsFromProps;
  

  const supabase = await createClient();
  const { data: userBadge, error } = await supabase
    .from("UserBadge")
    .select("id")
    .eq("userId", params.userId)
    .eq("badgeId", params.badgeId)
    .single();

  if (error || !userBadge) {
    notFound();
  }

  redirect(`/user/${params.userId}`);
}
