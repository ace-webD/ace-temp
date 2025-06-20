"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimelineEntry {
  title: React.ReactNode;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  availableYears?: number[];
  selectedYear?: number | null;
  onSelectYear?: (year: number | null) => void;
}

export const Timeline = ({
  data,
  availableYears = [],
  selectedYear,
  onSelectYear,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]); // MODIFIED: Added data to dependency array to recalculate height if timeline items change

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-background font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto pt-6 md:py-10 px-2 sm:px-4 md:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text</div>-foreground sm:text-4xl md:text-[40px] md:leading-[1.2]">
              Through the Years
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-sm mt-1">
              {data.length} epic events from {selectedYear}.
            </p>
          </div>
          {/* Filter section */}
          {availableYears.length > 0 && onSelectYear && (
            <div className="flex items-center flex-wrap gap-2 mt-4 md:mt-0 w-full md:w-auto justify-start md:justify-end">
              {availableYears.length > 3 ? (
                <Select
                  value={selectedYear?.toString() ?? ""} // Ensure value is a string
                  onValueChange={(value) => {
                    const year = parseInt(value, 10);
                    onSelectYear(isNaN(year) ? null : year);
                  }}
                >
                  <SelectTrigger className="w-full md:w-[180px] text-xs sm:text-sm h-auto py-1 px-2 sm:px-3">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                availableYears.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    onClick={() =>
                      onSelectYear(selectedYear === year ? null : year)
                    }
                    size="sm"
                    className="text-xs px-2 py-1 h-auto sm:text-sm sm:px-3"
                  >
                    {year}
                  </Button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pb-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-muted border border-[hsl(var(--border))] p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-muted-foreground ">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-muted-foreground">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          // MODIFIED: Removed mask-[...] class to prevent it from hiding the colorful motion.div
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-border to-transparent to-99%"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-linear-to-t from-purple-500 via-blue-500 to-transparent from-0% via-10% rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
