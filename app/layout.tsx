import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/context/AuthContext";
import { CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: CONFIG.site.name,
  description: CONFIG.site.description,
  keywords: [
    "ACE",
    "SASTRA",
    "Computing",
    "Engineering",
    "Club",
    "Technology",
    "Education",
    "Research",
  ],
  authors: [{ name: CONFIG.site.name }],
  creator: CONFIG.site.name,
  publisher: CONFIG.site.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(CONFIG.site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ACE SASTRA - Excellence in Computing Education",
    description:
      "Join ACE SASTRA, a premier student-run computing club promoting excellence in technology education and research. Connect with passionate tech enthusiasts and innovators.",
    url: CONFIG.site.url,
    siteName: CONFIG.site.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/ACE_SVG_original.png",
        width: 800,
        height: 600,
        alt: "ACE SASTRA Original Logo",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen grow lg:pt-16">{children}</main>
            <FooterSection />
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
