"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

// Extracted style constants
const timelineStyles = {
  container: "w-full bg-background font-sans md:px-10",
  content: "max-w-7xl mx-auto pt-6 md:py-10 px-2 sm:px-4 md:px-8 lg:px-10",
  header: "flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-8",
  title: "text-3xl font-bold text-foreground sm:text-4xl md:text-[40px] md:leading-[1.2]",
  subtitle: "text-muted-foreground text-sm md:text-base max-w-sm mt-1",
  filterContainer: "flex items-center flex-wrap gap-2 mt-4 md:mt-0 w-full md:w-auto justify-start md:justify-end",
  selectTrigger: "w-full md:w-[180px] text-xs sm:text-sm h-auto py-1 px-2 sm:px-3",
  button: "text-xs px-2 py-1 h-auto sm:text-sm sm:px-3",
  timelineContainer: "relative max-w-7xl mx-auto pb-20",
  timelineItem: "flex justify-start pt-10 md:pb-40 md:gap-10",
  stickyHeader: "sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full",
  dot: "h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center",
  dotInner: "h-4 w-4 rounded-full bg-muted border border-[hsl(var(--border))] p-2",
  titleDesktop: "hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-muted-foreground",
  contentContainer: "relative pl-20 pr-4 md:pl-4 w-full",
  titleMobile: "md:hidden block text-2xl mb-4 text-left font-bold text-muted-foreground",
  progressLine: "absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-border to-transparent to-99%",
  progressBar: "absolute inset-x-0 top-0 w-[2px] bg-linear-to-t from-purple-500 via-blue-500 to-transparent from-0% via-10% rounded-full",
} as const;

export const Timeline = ({
  data,
  availableYears = [],
  selectedYear,
  onSelectYear,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Optimize height calculation with useCallback
  const updateHeight = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  useEffect(() => {
    updateHeight();
    // Optional: Add resize listener for dynamic height updates
    const handleResize = () => updateHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateHeight, data.length]); // Only depend on data.length, not the entire data array
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Memoize year selection handlers
  const handleSelectChange = useCallback((value: string) => {
    const year = parseInt(value, 10);
    onSelectYear?.(isNaN(year) ? null : year);
  }, [onSelectYear]);

  const handleButtonClick = useCallback((year: number) => {
    onSelectYear?.(selectedYear === year ? null : year);
  }, [onSelectYear, selectedYear]);
  // Memoize filter section to prevent unnecessary re-renders
  const filterSection = useMemo(() => {
    if (!availableYears.length || !onSelectYear) return null;

    return (
      <div className={timelineStyles.filterContainer}>
        {availableYears.length > 3 ? (
          <Select
            value={selectedYear?.toString() ?? ""}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className={timelineStyles.selectTrigger}>
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
              onClick={() => handleButtonClick(year)}
              size="sm"
              className={timelineStyles.button}
            >
              {year}
            </Button>
          ))
        )}
      </div>
    );
  }, [availableYears, selectedYear, handleSelectChange, handleButtonClick, onSelectYear]);

  // Animation variants matching other pages
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  const timelineVariants = {
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

  return (
    <div className={timelineStyles.container} ref={containerRef}>
      <div className={timelineStyles.content}>
        <div className={timelineStyles.header}>
          <div className="flex-1">
            <motion.h2
              className={timelineStyles.title}
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              Through the Years
            </motion.h2>
            <motion.p
              className={timelineStyles.subtitle}
              variants={titleVariants}
            >
              {data.length} epic events from {selectedYear}.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {filterSection}
          </motion.div>
        </div>
      </div>

      <motion.div 
        ref={ref} 
        className={timelineStyles.timelineContainer}
        variants={timelineVariants}
        initial="hidden"
        animate="visible"
      >
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
        <div
          style={{ height: height + "px" }}
          className={timelineStyles.progressLine}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className={timelineStyles.progressBar}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Extracted TimelineItem component for better performance
interface TimelineItemProps {
  item: TimelineEntry;
  index: number;
}

const TimelineItem = React.memo(({ item, index }: TimelineItemProps) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    },
  };

  return (
    <motion.div 
      className={timelineStyles.timelineItem}
      variants={itemVariants}
    >
      <div className={timelineStyles.stickyHeader}>
        <div className={timelineStyles.dot}>
          <div className={timelineStyles.dotInner} />
        </div>
        <h3 className={timelineStyles.titleDesktop}>
          {item.title}
        </h3>
      </div>

      <div className={timelineStyles.contentContainer}>
        <h3 className={timelineStyles.titleMobile}>
          {item.title}
        </h3>
        {item.content}
      </div>
    </motion.div>
  );
});

TimelineItem.displayName = 'TimelineItem';
