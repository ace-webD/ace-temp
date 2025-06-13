import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { AuthProvider } from "@/components/context/AuthContext";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACE SASTRA",
  description:
    "ACE is a student-run club established with the aim of promoting excellence in computing education and research. We are a community of passionate individuals who believe in the power of technology to transform the world.",
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
  authors: [{ name: "ACE SASTRA" }],
  creator: "ACE SASTRA",
  publisher: "ACE SASTRA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ace-temp.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ACE SASTRA - Excellence in Computing Education",
    description:
      "Join ACE SASTRA, a premier student-run computing club promoting excellence in technology education and research. Connect with passionate tech enthusiasts and innovators.",
    url: "https://ace-temp.vercel.app",
    siteName: "ACE SASTRA",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/ACE_SVG_original.svg",
        width: 800,
        height: 600,
        alt: "ACE SASTRA Original Logo",
        type: "image/svg+xml",
      },
    ],
  },

  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
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
