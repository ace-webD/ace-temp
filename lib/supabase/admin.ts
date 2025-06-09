import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Ensure these environment variables are set in your deployment environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseServiceRoleKey) {
  // Log a warning locally, but throw an error in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY");
  } else {
    console.warn("Missing env.SUPABASE_SERVICE_ROLE_KEY. Admin operations will fail.");
    // Allow local development to proceed, but inserts might fail if RLS is strict
  }
}

// IMPORTANT: Never expose the service_role key client-side
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        // Prevent storing session cookies for the admin client
        persistSession: false,
        // Automatically refresh token is not needed for service_role
        autoRefreshToken: false,
        // No need to detect session in URL for service_role
        detectSessionInUrl: false,
      },
    })
  : null; // Handle case where service key might be missing in dev

// Optional: Helper function to ensure admin client is available
export const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not available. Check SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return supabaseAdmin;
}