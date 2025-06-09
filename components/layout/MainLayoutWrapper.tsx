"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";
import { Toaster } from "@/components/ui/sonner";

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen grow lg:pt-16">{children}</main>
      <FooterSection />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
