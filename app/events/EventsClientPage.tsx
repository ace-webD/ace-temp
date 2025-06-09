"use client";

import Image from 'next/image';
import Link from 'next/link'; 
import React, { useEffect, useState, useMemo } from 'react'; 
import { Timeline } from '@/components/ui/timeline';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/lib/supabase/database.types';
import { createClient } from '@/lib/supabase/client';
type SupabaseEvent = Tables<'Event'>;

interface TimelineEntry {
  title: React.ReactNode; // Changed from string to React.ReactNode
  content: React.ReactNode;
}

interface EventsClientPageProps {
  initialEvents: SupabaseEvent[];
  errorFetching?: string | null;
}

export default function EventsClientPage({ initialEvents, errorFetching }: EventsClientPageProps) {
  const supabaseClient = createClient();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Derive availableYears from initialEvents
  const availableYears = useMemo(() => {
    if (!initialEvents || initialEvents.length === 0) {
      return [];
    }
    return Array.from(
      new Set(
        initialEvents.map(event => new Date(event.startTime).getFullYear())
      )
    ).sort((a, b) => b - a); // Sort years descending
  }, [initialEvents]);

  // Effect 1: Set initial selectedYear when availableYears changes (e.g., on initial load)
  useEffect(() => {
    if (availableYears.length > 0) {
      setSelectedYear(availableYears[0]); // Default to the latest year
    } else {
      setSelectedYear(null); // No years available
    }
  }, [availableYears]); // Rerun only when availableYears array itself changes

  // Derive displayEvents based on selectedYear and initialEvents
  const displayEvents = useMemo(() => {
    if (!initialEvents || !selectedYear) return []; // Guard against null initialEvents or selectedYear
    // Filter by the selected year
    return initialEvents.filter(
      event => new Date(event.startTime).getFullYear() === selectedYear
    );
  }, [initialEvents, selectedYear]);

  // Derive timelineData from displayEvents
  const timelineData = useMemo(() => {
    return displayEvents.map((event) => {
      let formattedStartTime: string | undefined = undefined;
      if (event.startTime) {
        const date = new Date(event.startTime);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        let daySuffix = 'th';
        if (day === 1 || day === 21 || day === 31) daySuffix = 'st';
        else if (day === 2 || day === 22) daySuffix = 'nd';
        else if (day === 3 || day === 23) daySuffix = 'rd';
        formattedStartTime = `${day}${daySuffix} ${month} ${year}`;
      }

      return {
        title: (
          <Link href={`/events/${event.id}`} className="hover:underline">
            {event.name || 'Event'}
          </Link>
        ),
        content: (
          <div className="flex flex-col gap-4 p-4 rounded-lg bg-card shadow-sm">
            {event.imgUrl && (
              <div className="relative w-full aspect-video overflow-hidden rounded-md">
                <Image
                  src={supabaseClient.storage.from('event-images').getPublicUrl(event.imgUrl).data.publicUrl}
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
              {formattedStartTime && <span>{String(formattedStartTime)}</span>}
            </div>
          </div>
        ),
      };
    });
  }, [displayEvents, supabaseClient.storage]);

  const handleTimelineYearSelect = (yearFromTimeline: number | null) => {

    if (yearFromTimeline === null && availableYears.length > 0 && selectedYear !== null) {
      return;
    }
    setSelectedYear(yearFromTimeline);
  };

  if (errorFetching) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center">
        <p className="text-xl font-semibold text-destructive">Error: {errorFetching}</p>
        <p className="text-muted-foreground">Could not load events. Please try again later.</p>
      </div>
    );
  }

  // Simplified check for no events to display
  if (!initialEvents || initialEvents.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center">
        <p className="text-xl font-semibold text-muted-foreground">No past events found.</p>
      </div>
    );
  }

  return (
    <div className='md:mt-4 min-h-screen px-4'>
      <Timeline
        data={timelineData}
        availableYears={availableYears}
        selectedYear={selectedYear}
        onSelectYear={handleTimelineYearSelect}
      />
    </div>
  );
}
