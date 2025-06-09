import { notFound } from 'next/navigation'; // ADD for 404 handling
import Link from 'next/link'; // Import Link

import { createClient } from '@/lib/supabase/server'; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tables } from '@/lib/supabase/database.types';
import { Button } from '@/components/ui/button'; // Import Button component
import UserBadgesClient from './UserBadgesClient'; // Import the new client component

// Define types based on your Supabase schema
type UserProfile = Tables<'UserProfile'>; // Use the standard UserProfile type
type UserBadge = Tables<'UserBadge'> & { Badge: Tables<'Badge'> };
type Event = Tables<'Event'>;
type Registration = Tables<'Registration'>;

async function fetchUserProfileData(userId: string, supabase: any): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('UserProfile')
    .select('*') // Fetches all columns from the UserProfile table.
    .eq('userId', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    return null;
  }
  return data; 
}

async function fetchUserBadgesData(userId: string, supabase: any): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from('UserBadge')
    .select(`
      *,
      Badge (*)
    `)
    .eq('userId', userId);
  if (error) {
    console.error('Error fetching user badges:', error.message);
    return [];
  }
  return data as UserBadge[];
}

async function fetchEventHistoryData(userId: string, supabase: any): Promise<(Registration & { Event: Event })[]> {
  const { data, error } = await supabase
    .from('Registration')
    .select(`
      *,
      Event!inner(*)
    `)
    .eq('userId', userId)
    .eq('Event.status', 'DONE') // Changed to filter by Event.status = 'DONE'
    .order('startTime', { foreignTable: 'Event', ascending: false });

  if (error) {
    console.error('Error fetching event history:', error.message);
    return [];
  }
  return data as (Registration & { Event: Event })[];
}

async function fetchUpcomingRegisteredEventsData(userId: string, supabase: any): Promise<(Registration & { Event: Event })[]> {
  const { data, error } = await supabase
    .from('Registration')
    .select(`
      *,
      Event!inner(*)
    `)
    .eq('userId', userId)
    .in('Event.status', ['OPEN', 'CLOSED']) // Changed to filter by Event.status = 'OPEN' or any other non-'DONE' status relevant for upcoming
    .order('startTime', { foreignTable: 'Event', ascending: true });

  if (error) {
    console.error('Error fetching upcoming events:', error.message);
    return [];
  }
  return data as (Registration & { Event: Event })[];
}


export default async function UserProfilePage({ params: paramsFromProps }: { params: Promise<{ userId: string }> }) {
  const params = await paramsFromProps;
  const pageUserId = params.userId;
  const supabase = await createClient(); 

  // Fetch all data concurrently
  const [
    userProfile,
    badges,
    eventHistory,
    upcomingEvents
  ] = await Promise.all([
    fetchUserProfileData(pageUserId, supabase),
    fetchUserBadgesData(pageUserId, supabase),
    fetchEventHistoryData(pageUserId, supabase),
    fetchUpcomingRegisteredEventsData(pageUserId, supabase)
  ]);

  if (!userProfile) {
    notFound(); // Use Next.js notFound for 404
  }

  // Helper to format date strings
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 ">
      <Card className="mb-6 shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              {/* Removed userProfile.avatarUrl as it does not exist on the type */}
              <AvatarImage src={undefined} alt={userProfile.name || 'User'} />
              <AvatarFallback>{userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">{userProfile.name || 'User Profile'}</h1>
              <p className="text-md text-muted-foreground">{userProfile.registrationNumber}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Department</h2>
            <p className="text-md text-muted-foreground">{userProfile.department}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Year</h2>
            <p className="text-md text-muted-foreground">{userProfile.year}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Contact Number</h2>
            <p className="text-md text-muted-foreground">{userProfile.contactNumber || 'N/A'}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Current Rating</h2>
            <p className="text-md text-muted-foreground">{userProfile.currentRating ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-primary">Upcoming Registered Events</h2>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto"> {/* Added max-h and overflow */}
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-3">
                {upcomingEvents
                  .map((eventReg) => (
                  <li key={eventReg.id} className="text-md text-muted-foreground hover:text-primary transition-colors duration-150">
                    <Link href={`/events/${eventReg.Event.id}`} className="hover:underline">
                      {eventReg.Event.name} - {formatDate(eventReg.Event.startTime)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming registered events.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-primary">Event History</h2>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto"> {/* Added max-h and overflow */}
            {eventHistory.length > 0 ? (
              <ul className="space-y-3">
                {eventHistory.map((eventReg) => (
                  <li key={eventReg.id} className="text-md text-muted-foreground hover:text-primary transition-colors duration-150">
                    <Link href={`/events/${eventReg.Event.id}`} className="hover:underline">
                      {eventReg.Event.name} - Attended on {formatDate(eventReg.Event.startTime)}
                      {eventReg.points && <span className="ml-2 text-green-500">(+{eventReg.points} points)</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No event history found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-primary">Badges Earned</h2>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto"> {/* Added max-h and overflow */}
          <UserBadgesClient badges={badges} />
        </CardContent>
      </Card>
    </div>
  );
}
