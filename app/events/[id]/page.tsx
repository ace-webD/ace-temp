import { createClient } from "@/lib/supabase/server";
import EventDetailClient from "./EventDetailClient";
import type { Tables } from "@/lib/supabase/database.types";
import { ParticipantWithPoints } from "./EventDetailClient";

async function fetchEventData(eventId: string) {
  const supabase = await createClient();

  const [eventResponse, participantsResponse] = await Promise.all([
    supabase.from("Event").select("*").eq("id", eventId).single(),    supabase
      .from("Registration")
      .select(
        `
      points,
      UserProfile!inner(*)
    `
      )
      .eq("eventId", eventId)
      .order("points", { ascending: false, nullsFirst: false }),
  ]);

  const event = eventResponse.error
    ? null
    : (eventResponse.data as Tables<"Event">);
  const participants: ParticipantWithPoints[] =
    participantsResponse.error || !participantsResponse.data
      ? []
      : participantsResponse.data.map((reg: any) => ({
          ...reg.UserProfile,
          points: reg.points,
        }));

  return { event, participants };
}

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id: eventId } = await params;
  const { event, participants } = await fetchEventData(eventId);

  return (
    <EventDetailClient
      initialEvent={event}
      initialParticipants={participants}
      eventId={eventId}
    />
  );
}
