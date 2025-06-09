import { createClient } from '@/lib/supabase/server'; 
import EventsClientPage from './EventsClientPage'; 
import type { Tables } from '@/lib/supabase/database.types';

type SupabaseEvent = Tables<'Event'>;

async function fetchEvents(supabaseClient: Awaited<ReturnType<typeof createClient>>): Promise<{ data: SupabaseEvent[] | null, error: any }> {
  return await supabaseClient
    .from('Event')
    .select('*')
    .eq('status', 'DONE') // Changed to filter by status = 'DONE'
    .order('startTime', { ascending: false });
}

export default async function EventsPage() {
  const supabase = await createClient(); 
  let initialEvents: SupabaseEvent[] = [];
  let errorFetching: string | null = null;

  try {
    const { data, error } = await fetchEvents(supabase);
    if (error) {
      throw error;
    }
    initialEvents = data || [];
  } catch (error: any) {
    console.error('Error fetching data in Server Component: ', error);
    errorFetching = error.message || "An unexpected error occurred";
    initialEvents = []; 
  }

  return <EventsClientPage initialEvents={initialEvents} errorFetching={errorFetching} />;
}