"use client";
import {
  Menu,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Loader2,
  Settings,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";
import { HeroLogo } from "@/components/icons/HeroLogo";
import { useAuth } from "@/components/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

    const hasScrollbar =
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight;

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
          className={cn(
            "opacity-50 cursor-not-allowed",
            isMobile && "h-12 w-12 rounded-xl bg-card/50"
          )}
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
          const nameParts = trimmedName
            .split(" ")
            .filter((part: string) => part.length > 0);
          if (nameParts.length >= 2) {
            return (
              nameParts[0][0] + nameParts[nameParts.length - 1][0]
            ).toUpperCase();
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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "relative flex items-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
                isMobile
                  ? "h-12 w-12 px-0 bg-gradient-to-br from-primary/10 to-primary/5 active:from-primary/20 active:to-primary/10 border border-primary/20"
                  : "h-10 w-10 px-0"
              )}
              size="icon"
            >
              <Avatar className={isMobile ? "h-10 w-10" : "h-8 w-8"}>
                <AvatarFallback
                  className={isMobile ? "text-sm font-semibold" : ""}
                >
                  {getAvatarFallbackText()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align={isMobile ? "end" : "end"}
            side={isMobile ? "bottom" : "bottom"}
            sideOffset={isMobile ? 8 : 4}
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.user_metadata?.name ?? "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/user/${user.id}`}
                className="cursor-pointer"
                onClick={() => {
                  if (isMobile) setIsSheetOpen(false);
                }}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="cursor-pointer"
                onClick={() => {
                  if (isMobile) setIsSheetOpen(false);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                if (isMobile) setIsSheetOpen(false);
              }}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Login"
        onClick={() => {
          login();
          if (isMobile) setIsSheetOpen(false);
        }}
        className={cn(
          "cursor-pointer",
          isMobile &&
            "h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 active:from-primary/20 active:to-primary/10 border border-primary/20 transition-all duration-200"
        )}
      >
        <LogIn className="h-5 w-5" />
      </Button>
    );
  };
  return (
    <>
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSheetOpen(!isSheetOpen)}
                className="cursor-pointer h-9 w-9"
              >
                {" "}
                <motion.div
                  animate={{ rotate: isSheetOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="cursor-pointer h-5 w-5 text-foreground/70" />
                </motion.div>
                <span className="sr-only">Open Menu</span>
              </Button>
            </motion.div>
          </SheetTrigger>{" "}
          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-3xl rounded-br-3xl border-r border-border/20 bg-gradient-to-br from-card/95 via-card/90 to-card/85 backdrop-blur-xl w-[320px] sm:w-[380px] shadow-2xl overflow-y-auto scrollbar-thin"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex flex-col h-full">
              <SheetHeader className="mb-8 px-6 pt-6">
                <SheetTitle asChild>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      href="/"
                      className="flex items-center gap-3 font-bold text-xl group"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {" "}
                      <motion.div
                        whileTap={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-2 rounded-xl bg-primary/10 group-active:bg-primary/20 transition-colors duration-300"
                      >
                        <HeroLogo />
                      </motion.div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        ACE
                      </span>
                    </Link>
                  </motion.div>
                </SheetTitle>
              </SheetHeader>{" "}
              <nav className="flex-1 px-6 overflow-y-auto scrollbar-thin">
                <div className="flex flex-col gap-3">
                  {mobileRouteList.map(({ href, label }, index) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      {" "}
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Button
                          onClick={() => setIsSheetOpen(false)}
                          asChild
                          variant="ghost"
                          className="justify-start text-base cursor-pointer h-12 rounded-xl active:bg-primary/10 active:text-primary transition-all duration-200 group w-full relative overflow-hidden"
                        >
                          <Link
                            href={href}
                            className="flex items-center gap-3 px-4"
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-200"
                              layoutId={`bg-${href}`}
                            />
                            <motion.div
                              className="w-1 h-6 bg-primary rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-200"
                              whileTap={{ scaleY: 1.2 }}
                            />
                            <span className="relative z-10 font-medium">
                              {label}
                            </span>
                          </Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SheetFooter className="flex-col sm:flex-col justify-start items-stretch gap-4 px-6 pb-6">
                <Separator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />{" "}
                <div className="flex items-center justify-between">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <ToggleTheme />
                  </motion.div>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {renderAuthButton(true)}
                  </motion.div>
                </div>
              </SheetFooter>
            </motion.div>
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
                    <Link
                      href={href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "cursor-pointer"
                      )}
                    >
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
