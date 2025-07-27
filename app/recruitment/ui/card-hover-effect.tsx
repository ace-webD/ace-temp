import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ClusterCard } from "./cluster-card";

type Item = {
  title: string;
  description?: string;
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
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1",
        className
      )}
    >
      {items.map((item, idx) => {
        const { title, link, imageUrl, description } = item; // Destructure for clarity
        const commonProps = {
          className: "relative group block p-2 cursor-pointer w-3/5 mx-auto ",
          onMouseEnter: () => setHoveredIndex(idx),
          onMouseLeave: () => setHoveredIndex(null),
        };

        const content = (
          <>
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0   w-full bg-primary/10 dark:bg-primary/20  rounded-3xl"
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
              link={link}
            />
          </>
        );

        return (
          <div key={title} {...commonProps}>
            {content}
          </div>
        );
      })}
    </div>
  );
};
