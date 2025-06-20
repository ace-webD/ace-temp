"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, LogIn, Home } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("errorCode");
  let title = "Authentication Error";
  let message =
    "An unexpected error occurred during the authentication process.";
  if (typeof errorCode === "string") {
    switch (errorCode) {
      case "INVALID_EMAIL_DOMAIN":
        title = "Invalid Email Domain";
        message =
          "Sorry, only email addresses from the '@sastra.ac.in' domain are permitted. Please use your SASTRA University email address to sign up or log in.";
        break;
      default:
        title = "Authentication Error";
        message =
          "There was an error with the authentication process. Please try signing in again. If the problem persists, contact support.";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 text-slate-900 dark:text-slate-50">
      <Card className="w-full max-w-lg bg-white/80 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-md">
        <CardHeader className="text-center border-b border-slate-200 dark:border-slate-700 pb-6">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-20 h-20 text-red-500 dark:text-red-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-2">
            {title}
          </h1>
        </CardHeader>
        <CardContent className="text-center py-8 px-6">
          <p className="text-slate-600 dark:text-slate-300 text-md">
            {message}
          </p>
        </CardContent>{" "}
        <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
          <Button onClick={login} className="w-full sm:w-auto">
            <LogIn className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-8 text-xs text-slate-400 dark:text-slate-600">
        Error Code: {errorCode || "N/A"}
      </p>
    </div>
  );
}
