import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';

export type SupabaseEvent = Tables<'Event'>;

export interface EventsResponse {
  data: SupabaseEvent[];
  error: string | null;
}

/**
 * Fetches past events (status = 'DONE') from Supabase
 * @returns Promise with events data and error
 */
export async function fetchPastEvents(): Promise<EventsResponse> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('Event')
      .select('*')
      .eq('status', 'DONE')
      .order('startTime', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return {
        data: [],
        error: error.message || 'Failed to fetch events'
      };
    }

    return {
      data: data || [],
      error: null
    };
  } catch (error) {
    console.error('Unexpected error fetching events:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
