"use client";

import Image from 'next/image';
import Link from 'next/link'; 
import React, { useState, useMemo, useCallback } from 'react'; 
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline';
import { createClient } from '@/lib/supabase/client';
import { formatEventDate, extractAvailableYears, filterEventsByYear } from '@/lib/utils/date';
import type { SupabaseEvent } from '@/lib/services/events';

interface TimelineEntry {
  title: React.ReactNode;
  content: React.ReactNode;
}

interface EventsClientPageProps {
  initialEvents: SupabaseEvent[];
  errorFetching?: string | null;
}

// Extracted EventContent component for better performance
interface EventContentProps {
  event: SupabaseEvent;
  storageUrl: (imgUrl: string) => string;
}

const EventContent = React.memo(({ event, storageUrl }: EventContentProps) => {
  const formattedDate = event.startTime ? formatEventDate(event.startTime) : undefined;
  
  return (
    <motion.div 
      className="flex flex-col gap-4 p-4 rounded-lg bg-card shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {event.imgUrl && (
        <div className="relative w-full aspect-video overflow-hidden rounded-md">
          <Image
            src={storageUrl(event.imgUrl)}
            alt={event.name || 'Event Image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      {event.description && (
        <p className="text-card-foreground text-sm md:text-base">
          {event.description}
        </p>
      )}
      <div className="flex flex-col sm:flex-row justify-between text-xs md:text-sm text-muted-foreground mt-2">
        {event.location && <span>{event.location}</span>}
        {formattedDate && <span>{formattedDate}</span>}
      </div>
    </motion.div>
  );
});

EventContent.displayName = 'EventContent';

export default function EventsClientPage({ initialEvents, errorFetching }: EventsClientPageProps) {
  const supabaseClient = createClient();
  
  // Extract available years from events
  const availableYears = useMemo(() => 
    extractAvailableYears(initialEvents), 
    [initialEvents]
  );

  // Set default year to the latest available year
  const [selectedYear, setSelectedYear] = useState<number | null>(() => 
    availableYears[0] || null
  );

  // Filter events by selected year
  const displayEvents = useMemo(() => 
    filterEventsByYear(initialEvents, selectedYear), 
    [initialEvents, selectedYear]
  );

  // Memoize storage instance for better performance
  const storageUrl = useCallback((imgUrl: string) => 
    supabaseClient.storage.from('event-images').getPublicUrl(imgUrl).data.publicUrl,
    [supabaseClient.storage]
  );

  // Generate timeline data from filtered events
  const timelineData = useMemo((): TimelineEntry[] => {
    return displayEvents.map((event) => ({
      title: (
        <Link href={`/events/${event.id}`} className="hover:underline">
          {event.name || 'Event'}
        </Link>
      ),
      content: (
        <EventContent 
          event={event} 
          storageUrl={storageUrl}
        />
      ),
    }));
  }, [displayEvents, storageUrl]);
  const handleYearSelect = useCallback((year: number | null) => {
    // Don't unselect if trying to select null and we have a current selection
    if (year === null && availableYears.length > 0 && selectedYear !== null) {
      return;
    }
    setSelectedYear(year);
  }, [availableYears.length, selectedYear]);

  // Animation variants matching badges and upcoming events pages
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  const noEventsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  if (errorFetching) {
    return (
      <motion.div 
        className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.div variants={errorVariants}>
          <p className="text-xl font-semibold text-destructive">Error: {errorFetching}</p>
          <p className="text-muted-foreground">Could not load events. Please try again later.</p>
        </motion.div>
      </motion.div>
    );
  }

  // Simplified check for no events to display
  if (!initialEvents || initialEvents.length === 0) {
    return (
      <motion.div 
        className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.div variants={noEventsVariants}>
          <p className="text-xl font-semibold text-muted-foreground">No past events found.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className='md:mt-4 min-h-screen px-4'
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <Timeline
        data={timelineData}
        availableYears={availableYears}
        selectedYear={selectedYear}
        onSelectYear={handleYearSelect}
      />
    </motion.div>
  );
}
