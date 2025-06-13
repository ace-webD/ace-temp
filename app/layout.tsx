import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { AuthProvider } from "@/components/context/AuthContext";
import { createClient } from "@/lib/supabase/server";
import { CONFIG, getSiteUrl } from "@/lib/config";
import type { User } from "@supabase/supabase-js";

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

async function getInitialUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Only log errors that are not related to missing auth sessions
    // Missing auth sessions are expected for unauthenticated users
    if (error && error.message !== "Auth session missing!") {
      console.error("Error fetching user:", error);
    }

    return user;
  } catch (error) {
    // Only log if it's not an AuthSessionMissingError
    if (
      error &&
      !(error as any).__isAuthError &&
      (error as any).status !== 400
    ) {
      console.error("Failed to get initial user:", error);
    }
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getInitialUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider initialUser={initialUser}>
            <MainLayoutWrapper>{children}</MainLayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
