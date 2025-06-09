import { createClient } from '@/lib/supabase/server';
import type { Tables, Enums } from '@/lib/supabase/database.types';
import UpcomingEventsClientView from './UpcomingEventsClientView'; // Import the new client component

// Define SupabaseEvent type to match the data structure expected by the client component
type SupabaseEvent = Tables<'Event'> & {
  type: Enums<'EventType'>;
};

// Remove UpcomingEventItem component as it's now in UpcomingEventsClientView.tsx

async function fetchUpcomingEvents(supabaseClient: Awaited<ReturnType<typeof createClient>>) {
  const now = new Date().toISOString();
  const { data, error } = await supabaseClient
    .from('Event')
    .select('*')
    // Changed to filter by status = 'OPEN'
    .eq('status', 'OPEN') 
    .order('startTime', { ascending: true });

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
  return data as SupabaseEvent[]; 
}

export default async function UpcomingEventsPage() {
  const supabase = await createClient();
  const events = await fetchUpcomingEvents(supabase);

  return <UpcomingEventsClientView events={events} />;
}
