"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";

export const HeroSection = () => {
  const { user, login } = useAuth();
  const router = useRouter();
  
  const handleProfileClick = () => {
    if (user) {
      router.push(`/user/${user.id}`);
    } else {
      login();
    }
  };
  return (
    <section className="container">
      <div className="grid place-items-center lg:max-w-(--breakpoint-xl) gap-8 mx-auto py-16 sm:py-24">
        <div className="text-center space-y-8">
           <div>
        <Button onClick={()=>router.push('/recruitment')}
          variant="outline"
          className="bg-green-500 text-white hover:bg-green-600 font-bold px-6 py-2 rounded-md"
        >
          🚀 APPLY FOR ACE 2025 RECRUITMENTS
        </Button>
      </div>
             
          <div className="max-w-(--breakpoint-md) mx-auto text-center text-4xl md:text-6xl font-bold break-words">
            <h1>
              Association of
              <span className="text-transparent px-2 bg-linear-to-r from-[#D247BF] to-primary bg-clip-text">
                Computing Engineers
              </span>
              <br className="md:hidden" />{" "}
              <span className="glitch-text">SASTRA</span>
            </h1>
          </div>
          <p className="max-w-(--breakpoint-sm) mx-auto text-xl text-muted-foreground">
            {`ACE is a student-run club established with the aim of promoting excellence in computing education and research`}
          </p>{" "}
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button
              onClick={handleProfileClick}
              className="w-5/6 md:w-1/4 font-bold group/arrow cursor-pointer"
            >
              View Profile
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link href="/events/upcoming">Upcoming events</Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14 w-full lg:w-[90%] xl:w-[80%] aspect-video overflow-hidden">
          <div className="absolute -inset-4 lg:-inset-8 bg-primary/30 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

          <video
            src="/videos/hero-background.webm"
            autoPlay
            loop
            muted
            playsInline
            className="relative z-10 w-full h-full object-cover rounded-2xl border border-[hsl(var(--border))]/10 shadow-xl shadow-black/10"
          />

          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <TextHoverEffect text="ACE" className="pointer-events-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};
