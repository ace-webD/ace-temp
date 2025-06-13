import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { CONFIG, getAbsoluteUrl } from "@/lib/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/lib/supabase/database.types";
import { UserBadgesClient } from "./UserBadgesClient";

type UserProfile = Tables<"UserProfile">;
type UserBadge = Tables<"UserBadge"> & { Badge: Tables<"Badge"> };
type Event = Tables<"Event">;
type Registration = Tables<"Registration">;

async function fetchUserProfileData(
  userId: string,
  supabase: any
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("UserProfile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
  return data;
}

async function fetchUserBadgesData(
  userId: string,
  supabase: any
): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from("UserBadge")
    .select(
      `
      *,
      Badge (*)
    `
    )
    .eq("userId", userId);
  if (error) {
    console.error("Error fetching user badges:", error.message);
    return [];
  }
  return data as UserBadge[];
}

async function fetchEventHistoryData(
  userId: string,
  supabase: any
): Promise<(Registration & { Event: Event })[]> {
  const { data, error } = await supabase
    .from("Registration")
    .select(
      `
      *,
      Event!inner(*)
    `
    )
    .eq("userId", userId)
    .eq("Event.status", "DONE") // Changed to filter by Event.status = 'DONE'
    .order("startTime", { foreignTable: "Event", ascending: false });

  if (error) {
    console.error("Error fetching event history:", error.message);
    return [];
  }
  return data as (Registration & { Event: Event })[];
}

async function fetchUpcomingRegisteredEventsData(
  userId: string,
  supabase: any
): Promise<(Registration & { Event: Event })[]> {
  const { data, error } = await supabase
    .from("Registration")
    .select(
      `
      *,
      Event!inner(*)
    `
    )
    .eq("userId", userId)
    .in("Event.status", ["OPEN", "CLOSED"]) 
    .order("startTime", { foreignTable: "Event", ascending: true });

  if (error) {
    console.error("Error fetching upcoming events:", error.message);
    return [];
  }
  return data as (Registration & { Event: Event })[];
}

// Generate dynamic metadata for user profile pages
export async function generateMetadata({
  params: paramsFromProps,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const params = await paramsFromProps;
  const supabase = await createClient();
  const userProfile = await fetchUserProfileData(params.userId, supabase);
  if (!userProfile) {
    return {
      title: "User Not Found - ACE SASTRA",
      description: "The requested user profile could not be found.",
    };
  }

  const title = `${userProfile.name} - ACE SASTRA Member`;
  const description = `View ${userProfile.name}'s profile at ACE SASTRA.`;
  const url = getAbsoluteUrl(`/user/${params.userId}`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: CONFIG.site.name,
      locale: "en_US",
      type: "profile",
    },
  };
}

export default async function UserProfilePage({
  params: paramsFromProps,
}: {
  params: Promise<{ userId: string }>;
}) {
  const params = await paramsFromProps;
  const pageUserId = params.userId;
  const supabase = await createClient();

  // Fetch all data concurrently
  const [userProfile, badges, eventHistory, upcomingEvents] = await Promise.all(
    [
      fetchUserProfileData(pageUserId, supabase),
      fetchUserBadgesData(pageUserId, supabase),
      fetchEventHistoryData(pageUserId, supabase),
      fetchUpcomingRegisteredEventsData(pageUserId, supabase),
    ]
  );

  if (!userProfile) {
    notFound(); // Use Next.js notFound for 404
  }

  // Helper to format date strings
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Card className="mb-8 shadow-lg border border-border/20 bg-gradient-to-br from-background via-background to-muted/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {" "}
            {/* User Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <Avatar className="h-20 w-20 sm:h-32 sm:w-32 ring-4 ring-primary/20 shadow-xl border-4 border-background">
                <AvatarImage src={undefined} alt={userProfile.name || "User"} />
                <AvatarFallback className="text-2xl sm:text-4xl font-bold bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                  {userProfile.name
                    ? userProfile.name.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                    {userProfile.name || "User Profile"}
                  </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Department
                    </h3>
                    <p className="text-lg font-semibold text-foreground leading-tight">
                      {userProfile.department}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Year
                    </h3>
                    <p className="text-lg font-semibold text-foreground leading-tight">
                      {userProfile.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Rating Card */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <div className="bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/25 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden min-w-[220px]">
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                <div className="relative">
                  <p className="text-5xl font-bold text-primary mb-3 leading-none">
                    {userProfile.currentRating ?? "N/A"}
                  </p>
                  {userProfile.currentRating && (
                    <div className="w-full bg-primary/15 rounded-full h-3 mb-2 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{
                          width: `${Math.min(
                            (userProfile.currentRating / 5) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-primary/70 font-bold uppercase tracking-wider">
                  Current Rating
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((eventReg) => (
                    <div
                      key={eventReg.id}
                      className="p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all duration-200"
                    >
                      <Link
                        href={`/events/${eventReg.Event.id}`}
                        className="block"
                      >
                        <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                          {eventReg.Event.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(eventReg.Event.startTime)}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No upcoming registered events
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
              Event History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {eventHistory.length > 0 ? (
                <div className="space-y-3">
                  {eventHistory.map((eventReg) => (
                    <div
                      key={eventReg.id}
                      className="p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/50 transition-all duration-200"
                    >
                      <Link
                        href={`/events/${eventReg.Event.id}`}
                        className="block"
                      >
                        <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                          {eventReg.Event.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(eventReg.Event.startTime)}
                          </p>
                          {eventReg.points && (
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              +{eventReg.points} pts
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No event history found
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>{" "}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            Badges Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            <UserBadgesClient badges={badges} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
