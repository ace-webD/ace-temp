"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, Info, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Tables, Enums } from '@/lib/supabase/database.types';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader } from "@/components/ui/card"; 
import { formatEventDate } from '@/lib/utils/date';

type SupabaseEvent = Tables<'Event'> & {
  type: Enums<'EventType'>;
};

const UpcomingEventItem = ({ event }: { event: SupabaseEvent }) => {
  const supabaseClient = createClient();
  
  // Use utility function for date formatting with time
  const formatEventDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const dateOnly = formatEventDate(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${dateOnly}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const formattedStartTime = event.startTime ? formatEventDateTime(event.startTime) : undefined;

  const typeBadgeClasses = {
    CONTEST: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    WORKSHOP: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    TALK: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    DEFAULT: 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300',
  };

  const badgeClass = typeBadgeClasses[event.type] || typeBadgeClasses.DEFAULT;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="h-full">
      <Link href={`/events/${event.id}`} passHref>
        <Card className="h-full flex flex-col group hover:shadow-primary/20 transition-shadow duration-300 ease-in-out dark:hover:border-primary/60">
          <CardHeader className="p-4">
            <div className="flex justify-between items-center mb-2"> 
              <h3
                className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate grow mr-2"
                title={event.name ?? 'Upcoming Event'}
              >
                {event.name ?? 'Upcoming Event'}
              </h3>
              {event.type && (
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${badgeClass} shrink-0 self-center`}
                >
                  {event.type}
                </span>
              )}
            </div>
          </CardHeader>
          <div className="relative w-full aspect-4/5">
            {event.imgUrl && (
              <Image
                src={supabaseClient.storage.from('event-images').getPublicUrl(event.imgUrl).data.publicUrl}
                alt={event.name || 'Event Image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300"
              />
            )}
          </div>

          <div className="p-5 flex flex-col grow">
            <div className="space-y-2.5 text-sm text-muted-foreground mb-4 grow">
              {event.description && (
                <p className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-primary/80 shrink-0" />
                  <span className="line-clamp-2">{event.description.split('\n')[0]}</span>
                </p>
              )}
              {event.location && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary/80 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </p>
              )}
              {formattedStartTime && (
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary/80 shrink-0" />
                  <span>{formattedStartTime}</span>
                </p>
              )}
              {event.organizer_info && (
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 text-primary/80 shrink-0" />
                  <div className="text-xs">
                    {
                      (() => {
                        const lines = event.organizer_info.split('\n');
                        const firstLine = lines[0];
                        const remainingLines = lines.slice(1).join(' ');
                        return (
                          <>
                            <div>
                              <span className="font-semibold text-foreground/90">Lead by: </span>
                              <span className="text-muted-foreground leading-snug">
                                {firstLine}
                              </span>
                            </div>
                            {remainingLines && (
                              <span className="block text-muted-foreground leading-snug mt-0.5">
                                {remainingLines}
                              </span>
                            )}
                          </>
                        );
                      })()
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function UpcomingEventsClientView({ events }: { events: SupabaseEvent[] }) {
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.4,
        staggerChildren: 0.15,
        when: "beforeChildren"
      },
    },
  };

  const noEventsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" // Adjusted padding and removed min-h-screen for consistency
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="mb-8 text-center">
        <motion.h1
          className="text-3xl font-bold text-foreground sm:text-4xl md:text-[40px] md:leading-[1.2]" // Removed mb-8 from h1, parent div handles it
          variants={titleVariants}
        >
          Upcoming Events
        </motion.h1>
        <motion.p
          className="mt-3 text-lg text-muted-foreground sm:mt-4" // Adjusted top margin for consistency
          variants={titleVariants} // Assuming titleVariants is okay for subtitle too, or create a new one
        >
          Stay tuned for our upcoming events! Click on any event to learn more and register.
        </motion.p>
      </div>

      {/* Display events in a grid layout */}
      {events && events.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event) => (
            <UpcomingEventItem key={event.id} event={event} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-20"
          initial="hidden"
          animate="visible"
          variants={noEventsVariants}
        >
          <p className="text-2xl font-semibold text-muted-foreground mb-4">No Upcoming Events</p>
          <p className="text-md text-muted-foreground">Check back later for new events!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
