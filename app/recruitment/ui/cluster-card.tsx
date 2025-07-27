import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Card as BaseCard, CardTitle as BaseCardTitle, CardDescription as BaseCardDescription } from "./card"; // Import the original card

// Define the props for the ClusterCard, including imageUrl
type ClusterCardProps = React.HTMLAttributes<HTMLDivElement> & {
  imageUrl: string; // Make imageUrl required for this specific card
  title: string;
  description?: string;
  link?:string;
};

export const ClusterCard = React.forwardRef<HTMLDivElement, ClusterCardProps>(
  ({ className, imageUrl, link,title, description, ...props }, ref) => {
    const router = useRouter();

    return (
      <BaseCard
        ref={ref}
        onClick={() => link ? router.push(link) : null} 
        className={cn(
          "flex flex-row items-center text-center p-6 w-full h-full ", // Ensure consistent padding and allow card to take full height in grid cell
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
        <div className="relative  h-15 w-15 shrink-0 overflow-hidden rounded-full transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg">
          {/* {border-4 border-[hsl(var(--border))]/50 dark:border-[hsl(var(--border))]/30} */}
          <Image
            src={imageUrl}
            alt={title} 
            fill
            className="object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-85 " 
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
           {/* {link?
                <div className="mt-5 flex justify-center">
                  <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >  
                      <Badge className="text-base py-2 px-4 text-center hover:bg-white hover:text-primary transition-colors duration-300">
                        Click to apply
                      </Badge>
                  </a>
                </div>

          :null} */}
        </div>
      </BaseCard>
    );
  }
);
ClusterCard.displayName = "ClusterCard";