import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin'; 
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const DEPT_MAP: Record<string, string> = {
  '001': 'B.Tech. - Civil Engineering',
  '002': 'B.Tech. - Chemical Engineering',
  '003': 'B.Tech. - Computer Science & Engineering',
  '004': 'B.Tech. - Electronics & Communication Engineering',
  '005': 'B.Tech. - Electrical & Electronics Engineering',
  '006': 'B.Tech. - Electronics & Instrumentation Engineering',
  '009': 'B.Tech. - Mechanical Engineering',
  '010': 'B.Tech. - Biotechnology',
  '011': 'B.Tech. - Bioengineering',
  '012': 'B.Tech. - Mechatronics',
  '013': 'B.Tech. - Bioinformatics',
  '014': 'B.Tech. - Information & Communication Technology',
  '015': 'B.Tech. - Information Technology',
  '017': 'B.Tech. - Aerospace Engineering',
  '018': 'B.Tech. - Computer Science & Business Systems',
  '156': 'B.Tech. - CSE (AI & Data Science)',
  '157': 'B.Tech. - CSE (Cyber Security & Blockchain)',
  '158': 'B.Tech. - CSE (IoT & Automation)',
  '159': 'B.Tech. - EEE (Smart Grid & EVs)',
  '160': 'B.Tech. - ECE (Cyber Physical Systems)',
  '161': 'B.Tech. - Mechanical (Digital Manufacturing)',
  '078': 'M.Tech. - Medical Nanotechnology (5 Yrs Integrated)',
  '123': 'M.Tech. - Biotechnology (5 Yrs Integrated)',
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = await createClient(); 
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError && sessionData?.user) {
      const user = sessionData.user;


      if (!user.email?.endsWith('@sastra.ac.in')) {
        console.error(`User email ${user.email} is not from @sastra.ac.in domain.`);
        
        try {
          const supabaseAdmin = getSupabaseAdmin();
          const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
          if (deleteUserError) {
            console.error(`Failed to delete user ${user.id} from auth.users:`, deleteUserError.message);

          } else {
            console.log(`Successfully deleted user ${user.id} from auth.users due to invalid email domain.`);
          }
        } catch (adminError: any) {
          console.error(`Error getting admin client or deleting user ${user.id}:`, adminError.message);
        }

        // It's important to sign out the user if their email domain is not allowed,
        // otherwise they might remain logged in via Supabase but locked out of the app.
        await supabase.auth.signOut();
        const errorUrl = `${origin}/auth/auth-error?errorCode=INVALID_EMAIL_DOMAIN`;
        return NextResponse.redirect(errorUrl);
      }      const { data: userProfile, error: profileError } = await supabase
        .from('UserProfile')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error(`Error checking UserProfile for ${user.id}:`, profileError.message);
        const errorUrl = `${origin}/auth/auth-error?errorCode=PROFILE_CHECK_FAILED`;
        return NextResponse.redirect(errorUrl);
      }
      
      if (!userProfile) {
        console.log(`Creating UserProfile for user ID: ${user.id} using database function.`);

        try {
          const supabaseAdmin = getSupabaseAdmin();

          const email = user.email; 
          if (!email) { 
            console.error(`User email is null or undefined for user ${user.id}.`);
            const errorUrl = `${origin}/auth/auth-error?errorCode=EMAIL_PARSE_ERROR`;
            return NextResponse.redirect(errorUrl);
          }
          const local = email.split('@')[0] || '';
          if (!local) {
            console.error(`Could not parse local part from email for user ${user.id}.`);
            const errorUrl = `${origin}/auth/auth-error?errorCode=EMAIL_PARSE_ERROR`;
            return NextResponse.redirect(errorUrl);
          }
          const registrationNumber = local;
          const yearDigits = local.substring(1, 3);
          const year = 2000 + parseInt(yearDigits, 10);
          if (isNaN(year)) {
            console.error(`Could not parse year from email: ${email} for user ${user.id}.`);
            const errorUrl = `${origin}/auth/auth-error?errorCode=YEAR_PARSE_ERROR`;
            return NextResponse.redirect(errorUrl);
          }
          const deptCode = local.substring(3, 6);
          const department = DEPT_MAP[deptCode] || 'Unknown Department';

          const { error: rpcError } = await supabaseAdmin.rpc('create_new_user_profile', {
            p_user_id: user.id,
            p_name: user.user_metadata.name, 
            p_registration_number: registrationNumber,
            p_year: year,
            p_department: department,
          });

          if (rpcError) {
            console.error(`Database function failed to create UserProfile for ${user.id}:`, rpcError.message);
            const errorUrl = `${origin}/auth/auth-error?errorCode=PROFILE_CREATE_FAILED`;
            return NextResponse.redirect(errorUrl);
          } else {
            console.log(`Database function created UserProfile successfully for user ID: ${user.id}`);
          }
        } catch (adminError: any) {
           console.error(`Error during admin profile creation process for ${user.id}:`, adminError.message);
           const errorUrl = `${origin}/auth/auth-error?errorCode=PROFILE_SETUP_ERROR`;
           return NextResponse.redirect(errorUrl);
        }
      } else {
         console.log(`UserProfile already exists for user ID: ${user.id}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    if (exchangeError) {
      console.error('Supabase auth code exchange error:', exchangeError.message);
      const errorUrl = `${origin}/auth/auth-error?errorCode=AUTH_CODE_ERROR`;
      return NextResponse.redirect(errorUrl);
    } else {
      console.error('Supabase auth code exchange error: No user data returned.');
      const errorUrl = `${origin}/auth/auth-error?errorCode=AUTH_CODE_ERROR`;
      return NextResponse.redirect(errorUrl);
    }
  } else {
     console.error('Supabase auth callback error: Code missing.');
  }

  console.error('Supabase auth callback error: Redirecting to generic error page.');
  const errorUrl = `${origin}/auth/auth-error?errorCode=AUTH_CODE_ERROR`;
  return NextResponse.redirect(errorUrl);
}