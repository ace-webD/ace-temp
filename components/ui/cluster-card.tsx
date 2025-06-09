import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card as BaseCard, CardTitle as BaseCardTitle, CardDescription as BaseCardDescription } from "./card"; // Import the original card

// Define the props for the ClusterCard, including imageUrl
type ClusterCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageUrl: string; // Make imageUrl required for this specific card
  title: string;
  description: string;
};

export const ClusterCard = React.forwardRef<HTMLDivElement, ClusterCardProps>(
  ({ className, imageUrl, title, description, ...props }, ref) => {
    return (
      <BaseCard
        ref={ref}
        className={cn(
          "flex flex-col items-center text-center p-6 h-full", // Ensure consistent padding and allow card to take full height in grid cell
          "transition-all duration-300 ease-in-out", // Add overall transition
          // Hover state styling for the card itself
          "group-hover:border-primary/60 group-hover:shadow-primary/10", // Keep card border/shadow hover effect
          "shadow-md dark:shadow-neutral-800", // Default shadow
          className
        )}
        {...props} // Spread remaining props like onClick etc.
      >
        {/* Image Container */}
        {/* Removed group-hover:border-primary/80 from this div */}
        <div className="relative mb-6 h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-[hsl(var(--border))]/50 dark:border-[hsl(var(--border))]/30 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
          <Image
            src={imageUrl}
            alt={title} 
            fill
            className="object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-85" 
          />
        </div>
        {/* Text content container */}
        <div className="relative z-10 flex flex-col grow">
           {/* Keep title color consistent on hover, especially in dark mode */}
           <BaseCardTitle className="mb-2 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
             {title}
           </BaseCardTitle>
           {/* Remove line-clamp to allow full description */}
           <BaseCardDescription className="text-sm text-muted-foreground">
             {description}
           </BaseCardDescription>
        </div>
      </BaseCard>
    );
  }
);
ClusterCard.displayName = "ClusterCard";