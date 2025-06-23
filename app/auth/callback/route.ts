import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const next = searchParams.get('next') ?? '/';

  // Handle OAuth errors
  if (error) {
    if (error === 'server_error' && errorDescription?.includes('Database error saving new user')) {
      return NextResponse.redirect(`${origin}/auth/auth-error?errorCode=INVALID_EMAIL_DOMAIN`);
    }
    return NextResponse.redirect(`${origin}/auth/auth-error?errorCode=OAUTH_ERROR`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-error?errorCode=OAUTH_ERROR`);
  }

  try {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/auth/auth-error?errorCode=OAUTH_ERROR`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch {
    return NextResponse.redirect(`${origin}/auth/auth-error?errorCode=OAUTH_ERROR`);
  }
}