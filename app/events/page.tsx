import EventsClientPage from './EventsClientPage'; 
import { fetchPastEvents } from '@/lib/services/events';

export default async function EventsPage() {
  const { data: initialEvents, error: errorFetching } = await fetchPastEvents();

  return (
    <EventsClientPage 
      initialEvents={initialEvents} 
      errorFetching={errorFetching} 
    />
  );
}