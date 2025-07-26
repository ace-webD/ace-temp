import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ClusterCard } from "./cluster-card";

type Item = {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {items.map((item, idx) => {
        const { title, link, imageUrl, description } = item;
        const commonProps = {
          className: "relative group block p-2 h-full w-full",
          onMouseEnter: () => setHoveredIndex(idx),
          onMouseLeave: () => setHoveredIndex(null),
        };

        const content = (
          <>
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-primary/10 dark:bg-primary/20 block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <ClusterCard
              imageUrl={imageUrl}
              title={title}
              description={description}
            />
          </>
        );

return link ? (
  <a
    key={title}
    href={link}
    className="relative group block p-2 h-full w-full"
  
    target="_blank"
    rel="noopener noreferrer"
  >
    {content}
  </a>
) : (
  <div key={title} {...commonProps}>
    {content}
  </div>
);

      })}
    </div>
  );
};
