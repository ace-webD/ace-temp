"use client";
import { Menu, LogIn, LogOut, User as UserIcon, ShieldCheck, Loader2, Settings } from "lucide-react";
import React, { useState, useEffect } from "react"; // Added useEffect
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";
import { HeroLogo } from "../icons/HeroLogo";
import { useAuth } from "@/components/context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import GoogleIcon from "../icons/GoogleIcon";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "../ui/avatar";

interface RouteProps {
  href: string;
  label: string;
}

const mobileRouteList: RouteProps[] = [
  { href: "/clusters", label: "Clusters" },
  { href: "/events", label: "Events" },
  { href: "/events/upcoming", label: "Upcoming Events" },
  { href: "/badges", label: "Badges" },
];

const centerRouteList: RouteProps[] = [
  { href: "/clusters", label: "Clusters" },
  { href: "/events", label: "Events" },
  { href: "/events/upcoming", label: "Upcoming" },
  { href: "/badges", label: "Badges" },
];

export const Navbar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const { user, loading, login, logout } = useAuth(); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (!isMounted) {
      return;
    }

    const hasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;

    if (!hasScrollbar) {

      if (!visible) {
        setVisible(true);
      }
      return;
    }

    const previous = scrollYProgress.getPrevious();

    if (typeof current === "number" && typeof previous === "number") {
      const direction = current - previous;
      if (current < 0.05) {
        setVisible(true);
      } else { 
        setVisible(direction <= 0);
      }
    } else if (typeof current === "number" && previous === undefined) {
      if (current < 0.05) {
        setVisible(true); 
      } else {
        setVisible(true);
      }
    }
  });

  const renderAuthButton = (isMobile: boolean) => {
    if (loading) {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="opacity-50 cursor-not-allowed"
          disabled
        >
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      );
    }

    if (user) {
      const getAvatarFallbackText = () => {
        const name = user.user_metadata?.name; 
        const email = user.email;

        if (name) {
          const trimmedName = name.trim();
          const nameParts = trimmedName.split(' ').filter((part: string) => part.length > 0);
          if (nameParts.length >= 2) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
          } else if (nameParts.length === 1 && nameParts[0].length > 0) {
            return nameParts[0][0].toUpperCase();
          }
        }
        if (email && email.length > 0) {
          return email[0].toUpperCase();
        }
        return "U"; 
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "relative flex items-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
                "h-10 w-10 px-0" 
              )}
              size="icon" 
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {getAvatarFallbackText()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isMobile ? "start" : "end"} forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.user_metadata?.name ?? "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/user/${user.id}`} className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); if (isMobile) setIsSheetOpen(false); }} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Login"
            onClick={() => { if (isMobile) setIsSheetOpen(false); }}
            className="cursor-pointer"
          >
            <LogIn className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to your ACE account using SASTRA mail.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => { login(); setIsModalOpen(false); }}
              variant="outline"
              className="w-full cursor-pointer"
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };


  return (
    <>
      <div className="lg:hidden fixed top-5 right-5 z-50">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" onClick={() => setIsSheetOpen(!isSheetOpen)} className="cursor-pointer">
              <Menu className="cursor-pointer" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl border-r border-[hsl(var(--border))]/40 bg-card/75 backdrop-blur-lg w-[300px] sm:w-[400px]"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-lg"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <HeroLogo />
                    ACE
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {mobileRouteList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsSheetOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base cursor-pointer"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
              </div>
            </div>
            <SheetFooter className="flex-col sm:flex-col justify-start items-start gap-2">
              <Separator className="mb-2 bg-border/40 w-full" />
              <ToggleTheme />
              {renderAuthButton(true)}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "hidden lg:flex max-w-(--breakpoint-xl) fixed top-5 inset-x-0 mx-auto z-50",
            "border border-[hsl(var(--border))]/40 rounded-2xl",
            "bg-card/60 backdrop-blur-lg",
            "shadow-lg shadow-black/5",
            "p-2 items-center justify-between space-x-4"
          )}
        >
          <Link
            href="/"
            className="font-bold text-inherit flex items-center gap-2"
          >
            <HeroLogo />
            <span className="hidden md:flex">ACE</span>
          </Link>
          <NavigationMenu className="relative">
            <NavigationMenuList>
              <NavigationMenuItem>
                {centerRouteList.map(({ href, label }) => (
                  <NavigationMenuItem key={href} asChild>
                    <Link href={href} className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}>
                      {label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-2">
            <ToggleTheme />
            {renderAuthButton(false)}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
