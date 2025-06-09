import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Initialize a response object. This will be updated by Supabase if cookies need to be set.
  // The `request` object is passed to `NextResponse.next()` to allow Supabase to read request details.
  let response = NextResponse.next({
    request: request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase URL or Anon Key is missing from environment variables. " +
        "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
  }

  // Initialize Supabase client for middleware
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        // Forward all cookies from the incoming request to Supabase.
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // This function is called by Supabase when it needs to set cookies.
        // The `cookiesToSet` array contains all cookies that need to be set on the response.

        // As per the Supabase SSR documentation example for Next.js middleware:
        // A new response object is created using the original request,
        // and cookies are set on this new response.
        // The `response` variable from the outer scope is then reassigned to this new response.
        // This is crucial for passing the updated cookies back to the browser.
        response = NextResponse.next({
          request: request, // Pass the original request object
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
  // IMPORTANT: supabase.auth.getUser() MUST be called to refresh the session
  // and keep the user logged in across server components and API routes.
  // This will also update the session cookie if it's about to expire.
  const {
    data: { user: authenticatedUser },
    error: userError,
  } = await supabase.auth.getUser();

  // Only log errors that are not related to missing auth sessions
  // Missing auth sessions are expected for unauthenticated users
  if (userError && userError.message !== "Auth session missing!") {
    console.error(
      "Error getting user in middleware (from getUser) during session update:",
      userError.message
    );
  }

  // The main purpose of this middleware is now session management.
  // Route protection for specific pages like /settings is handled within the page itself (server-side).
  // Client-side components will use AuthContext to react to the user's auth state.

  return response;
}
