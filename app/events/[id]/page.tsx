import { createClient } from '@/lib/supabase/server'; // Helper for server-side Supabase
import EventDetailClient from './EventDetailClient';
import type { Tables } from '@/lib/supabase/database.types';
import { ParticipantWithRegistrationDate } from './EventDetailClient'; // Import shared type
import { unstable_noStore as noStore } from 'next/cache'; // Opt out of caching for dynamic data

// Define a type for participants that includes registration date and points
// Moved to EventDetailClient.tsx as it's used by both client and server

async function fetchEventDetails(id: string, supabaseInstance: any): Promise<Tables<'Event'> | null> {
  noStore(); // Ensure fresh data
  const { data, error } = await supabaseInstance
    .from('Event')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
  return data as Tables<'Event'>;
}

async function fetchEventParticipants(eventId: string, supabaseInstance: any): Promise<ParticipantWithRegistrationDate[]> {
  noStore(); // Ensure fresh data
  const { data, error } = await supabaseInstance
    .from('Registration')
    .select(`
      registeredAt,
      points,
      UserProfile!inner(*)
    `)
    .eq('eventId', eventId)
    .order('registeredAt', { ascending: true });

  if (error) {
    console.error('FETCH_PARTICIPANTS: Error fetching event participants:', error);
    return [];
  }
  if (!data) {
    return [];
  }

  const mappedData = data.map((reg: { registeredAt: string; points: number | null; UserProfile: Tables<'UserProfile'> }) => ({
    ...(reg.UserProfile as Tables<'UserProfile'>),
    registered_at: reg.registeredAt,
    points: reg.points,
  }));
  return mappedData as ParticipantWithRegistrationDate[];
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = await params; // Await params
  const supabase = await createClient();
  const eventId = resolvedParams.id; // Use resolvedParams

  if (!eventId) {
    // Handle case where eventId is not available, though Next.js routing should prevent this for [id]
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-muted-foreground">Event ID is missing.</p>
      </div>
    );
  }

  const eventDetails = await fetchEventDetails(eventId, supabase);
  let participants: ParticipantWithRegistrationDate[] = [];

  if (eventDetails) {
    participants = await fetchEventParticipants(eventId, supabase);
  }
  // All data fetching is done here. Now pass it to the client component.

  return (
    <EventDetailClient 
      initialEvent={eventDetails} 
      initialParticipants={participants} 
      eventId={eventId} 
    />
  );
}
