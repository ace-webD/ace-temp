create type "public"."BadgeType" as enum ('MANUAL', 'AUTOMATIC');

create type "public"."EventType" as enum ('CONTEST', 'WORKSHOP', 'TALK');

create type "public"."event_status" as enum ('OPEN', 'CLOSED', 'DONE', 'CANCELLED');

create table "public"."Badge" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text not null,
    "iconUrl" text not null,
    "type" "BadgeType" not null default 'MANUAL'::"BadgeType"
);


alter table "public"."Badge" enable row level security;

create table "public"."ContactMessage" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "message" text not null,
    "createdAt" timestamp with time zone not null default now()
);


alter table "public"."ContactMessage" enable row level security;

create table "public"."Event" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text not null,
    "startTime" timestamp with time zone not null,
    "location" text not null,
    "type" "EventType" not null,
    "imgUrl" text,
    "organizer_info" text,
    "status" event_status not null default 'OPEN'::event_status
);


alter table "public"."Event" enable row level security;

create table "public"."Registration" (
    "id" uuid not null default gen_random_uuid(),
    "eventId" uuid not null,
    "registeredAt" timestamp with time zone not null default now(),
    "attended" boolean,
    "points" integer,
    "userId" uuid not null
);


alter table "public"."Registration" enable row level security;

create table "public"."UserBadge" (
    "id" uuid not null default gen_random_uuid(),
    "badgeId" uuid not null,
    "earnedAt" timestamp with time zone not null default now(),
    "userId" uuid not null
);


alter table "public"."UserBadge" enable row level security;

create table "public"."UserProfile" (
    "registrationNumber" text not null,
    "department" text not null,
    "year" integer not null,
    "contactNumber" text,
    "currentRating" integer not null default 0,
    "name" text not null,
    "id" uuid not null
);


alter table "public"."UserProfile" enable row level security;

create table "public"."userAdmins" (
    "isAdmin" boolean not null default false,
    "userId" uuid not null
);


alter table "public"."userAdmins" enable row level security;

CREATE UNIQUE INDEX "Badge_pkey" ON public."Badge" USING btree (id);

CREATE UNIQUE INDEX "ContactMessage_pkey" ON public."ContactMessage" USING btree (id);

CREATE UNIQUE INDEX "Event_pkey" ON public."Event" USING btree (id);

CREATE UNIQUE INDEX "Registration_pkey" ON public."Registration" USING btree (id);

CREATE UNIQUE INDEX "Registration_userId_eventId_key" ON public."Registration" USING btree ("userId", "eventId");

CREATE UNIQUE INDEX "UserBadge_pkey" ON public."UserBadge" USING btree (id);

CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON public."UserBadge" USING btree ("userId", "badgeId");

CREATE UNIQUE INDEX "UserProfile_pkey" ON public."UserProfile" USING btree (id);

CREATE UNIQUE INDEX "UserProfile_registrationNumber_key" ON public."UserProfile" USING btree ("registrationNumber");

CREATE INDEX idx_registration_eventid ON public."Registration" USING btree ("eventId");

CREATE INDEX idx_userbadge_badgeid ON public."UserBadge" USING btree ("badgeId");

CREATE UNIQUE INDEX "userAdmins_pkey" ON public."userAdmins" USING btree ("userId");

alter table "public"."Badge" add constraint "Badge_pkey" PRIMARY KEY using index "Badge_pkey";

alter table "public"."ContactMessage" add constraint "ContactMessage_pkey" PRIMARY KEY using index "ContactMessage_pkey";

alter table "public"."Event" add constraint "Event_pkey" PRIMARY KEY using index "Event_pkey";

alter table "public"."Registration" add constraint "Registration_pkey" PRIMARY KEY using index "Registration_pkey";

alter table "public"."UserBadge" add constraint "UserBadge_pkey" PRIMARY KEY using index "UserBadge_pkey";

alter table "public"."UserProfile" add constraint "UserProfile_pkey" PRIMARY KEY using index "UserProfile_pkey";

alter table "public"."userAdmins" add constraint "userAdmins_pkey" PRIMARY KEY using index "userAdmins_pkey";

alter table "public"."Registration" add constraint "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE not valid;

alter table "public"."Registration" validate constraint "Registration_eventId_fkey";

alter table "public"."Registration" add constraint "Registration_userId_eventId_key" UNIQUE using index "Registration_userId_eventId_key";

alter table "public"."Registration" add constraint "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"(id) ON DELETE CASCADE not valid;

alter table "public"."Registration" validate constraint "Registration_userId_fkey";

alter table "public"."UserBadge" add constraint "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"(id) ON DELETE CASCADE not valid;

alter table "public"."UserBadge" validate constraint "UserBadge_badgeId_fkey";

alter table "public"."UserBadge" add constraint "UserBadge_userId_badgeId_key" UNIQUE using index "UserBadge_userId_badgeId_key";

alter table "public"."UserBadge" add constraint "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"(id) ON DELETE CASCADE not valid;

alter table "public"."UserBadge" validate constraint "UserBadge_userId_fkey";

alter table "public"."UserProfile" add constraint "UserProfile_contactNumber_format" CHECK ((("contactNumber" IS NULL) OR ("contactNumber" ~ '^[0-9]{10}$'::text))) not valid;

alter table "public"."UserProfile" validate constraint "UserProfile_contactNumber_format";

alter table "public"."UserProfile" add constraint "UserProfile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."UserProfile" validate constraint "UserProfile_id_fkey";

alter table "public"."UserProfile" add constraint "UserProfile_registrationNumber_key" UNIQUE using index "UserProfile_registrationNumber_key";

alter table "public"."userAdmins" add constraint "userAdmins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"(id) ON DELETE CASCADE not valid;

alter table "public"."userAdmins" validate constraint "userAdmins_userId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_admin_user(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    target_user_id uuid;
    profile_exists boolean;
BEGIN
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    SELECT EXISTS(
        SELECT 1 FROM public."UserProfile" 
        WHERE id = target_user_id
    ) INTO profile_exists;
    
    IF NOT profile_exists THEN
        RAISE EXCEPTION 'User % does not have a UserProfile', user_email;
    END IF;
    
    INSERT INTO public."userAdmins" ("userId", "isAdmin")
    VALUES (target_user_id, true)
    ON CONFLICT ("userId") 
    DO UPDATE SET "isAdmin" = true;
    
    RETURN true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_new_user_profile(p_user_id uuid, p_name text, p_registration_number text, p_year integer, p_department text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public."UserProfile" ("id", "name", "registrationNumber", "year", "department")
    VALUES (p_user_id, p_name, p_registration_number, p_year, p_department)
    ON CONFLICT ("registrationNumber") DO NOTHING;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_user_profile_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  registration_number text;
  year_digits text;
  calculated_year integer;
  dept_code text;
  department_name text;
  dept_map jsonb := '{
    "001": "B.Tech. - Civil Engineering",
    "002": "B.Tech. - Chemical Engineering",
    "003": "B.Tech. - Computer Science & Engineering",
    "004": "B.Tech. - Electronics & Communication Engineering",
    "005": "B.Tech. - Electrical & Electronics Engineering",
    "006": "B.Tech. - Electronics & Instrumentation Engineering",
    "009": "B.Tech. - Mechanical Engineering",
    "010": "B.Tech. - Biotechnology",
    "011": "B.Tech. - Bioengineering",
    "012": "B.Tech. - Mechatronics",
    "013": "B.Tech. - Bioinformatics",
    "014": "B.Tech. - Information & Communication Technology",
    "015": "B.Tech. - Information Technology",
    "017": "B.Tech. - Aerospace Engineering",
    "018": "B.Tech. - Computer Science & Business Systems",
    "156": "B.Tech. - CSE (AI & Data Science)",
    "157": "B.Tech. - CSE (Cyber Security & Blockchain)",
    "158": "B.Tech. - CSE (IoT & Automation)",
    "159": "B.Tech. - EEE (Smart Grid & EVs)",
    "160": "B.Tech. - ECE (Cyber Physical Systems)",
    "161": "B.Tech. - Mechanical (Digital Manufacturing)",
    "078": "M.Tech. - Medical Nanotechnology (5 Yrs Integrated)",
    "123": "M.Tech. - Biotechnology (5 Yrs Integrated)"
  }'::jsonb;
BEGIN
  -- Extract registration number from email
  registration_number := split_part(NEW.email, '@', 1);
  
  -- Parse year from registration number
  year_digits := substring(registration_number from 2 for 2);
  calculated_year := 2000 + year_digits::integer;
  
  -- Parse department code
  dept_code := substring(registration_number from 4 for 3);
  department_name := COALESCE(dept_map->>dept_code, 'Unknown Department');
  
  -- Insert user profile
  INSERT INTO public."UserProfile" (
    id,
    name,
    registrationNumber,
    year,
    department
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    registration_number,
    calculated_year,
    department_name
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  user_count bigint;
  event_count bigint;
  message_count bigint;
  badge_count bigint;
BEGIN
  SELECT count(*) INTO user_count FROM public."UserProfile";
  SELECT count(*) INTO event_count FROM public."Event";
  SELECT count(*) INTO message_count FROM public."ContactMessage";
  SELECT count(*) INTO badge_count FROM public."Badge";
  RETURN json_build_object(
    'userCount', user_count,
    'eventCount', event_count,
    'messageCount', message_count,
    'badgeCount', badge_count
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT COALESCE(
    (SELECT "isAdmin" 
     FROM public."userAdmins" 
     WHERE "userId" = auth.uid()),
    false
  );
$function$
;

CREATE OR REPLACE FUNCTION public.remove_admin_user(user_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    UPDATE public."userAdmins" 
    SET "isAdmin" = false 
    WHERE "userId" = target_user_id;
    
    RETURN true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_current_rating_from_registration()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.points IS NOT NULL AND NEW.points <> 0 THEN
            UPDATE public."UserProfile"
            SET "currentRating" = "currentRating" + NEW.points
            WHERE "id" = NEW."userId";
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF NEW."userId" IS NOT NULL AND (COALESCE(OLD.points, 0) <> COALESCE(NEW.points, 0)) THEN
            UPDATE public."UserProfile"
            SET "currentRating" = "currentRating" + (COALESCE(NEW.points, 0) - COALESCE(OLD.points, 0))
            WHERE "id" = NEW."userId";
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.points IS NOT NULL AND OLD.points <> 0 THEN
            UPDATE public."UserProfile"
            SET "currentRating" = "currentRating" - OLD.points
            WHERE "id" = OLD."userId";
        END IF;
    END IF;
    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_email_domain()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Only allow @sastra.ac.in emails
  IF NEW.email IS NULL OR NOT NEW.email LIKE '%@sastra.ac.in' THEN
    RAISE EXCEPTION 'Only @sastra.ac.in email addresses are allowed'
      USING HINT = 'Please use your SASTRA university email address';
  END IF;
  
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."Badge" to "anon";

grant insert on table "public"."Badge" to "anon";

grant references on table "public"."Badge" to "anon";

grant select on table "public"."Badge" to "anon";

grant trigger on table "public"."Badge" to "anon";

grant truncate on table "public"."Badge" to "anon";

grant update on table "public"."Badge" to "anon";

grant delete on table "public"."Badge" to "authenticated";

grant insert on table "public"."Badge" to "authenticated";

grant references on table "public"."Badge" to "authenticated";

grant select on table "public"."Badge" to "authenticated";

grant trigger on table "public"."Badge" to "authenticated";

grant truncate on table "public"."Badge" to "authenticated";

grant update on table "public"."Badge" to "authenticated";

grant delete on table "public"."Badge" to "service_role";

grant insert on table "public"."Badge" to "service_role";

grant references on table "public"."Badge" to "service_role";

grant select on table "public"."Badge" to "service_role";

grant trigger on table "public"."Badge" to "service_role";

grant truncate on table "public"."Badge" to "service_role";

grant update on table "public"."Badge" to "service_role";

grant delete on table "public"."ContactMessage" to "anon";

grant insert on table "public"."ContactMessage" to "anon";

grant references on table "public"."ContactMessage" to "anon";

grant select on table "public"."ContactMessage" to "anon";

grant trigger on table "public"."ContactMessage" to "anon";

grant truncate on table "public"."ContactMessage" to "anon";

grant update on table "public"."ContactMessage" to "anon";

grant delete on table "public"."ContactMessage" to "authenticated";

grant insert on table "public"."ContactMessage" to "authenticated";

grant references on table "public"."ContactMessage" to "authenticated";

grant select on table "public"."ContactMessage" to "authenticated";

grant trigger on table "public"."ContactMessage" to "authenticated";

grant truncate on table "public"."ContactMessage" to "authenticated";

grant update on table "public"."ContactMessage" to "authenticated";

grant delete on table "public"."ContactMessage" to "service_role";

grant insert on table "public"."ContactMessage" to "service_role";

grant references on table "public"."ContactMessage" to "service_role";

grant select on table "public"."ContactMessage" to "service_role";

grant trigger on table "public"."ContactMessage" to "service_role";

grant truncate on table "public"."ContactMessage" to "service_role";

grant update on table "public"."ContactMessage" to "service_role";

grant delete on table "public"."Event" to "anon";

grant insert on table "public"."Event" to "anon";

grant references on table "public"."Event" to "anon";

grant select on table "public"."Event" to "anon";

grant trigger on table "public"."Event" to "anon";

grant truncate on table "public"."Event" to "anon";

grant update on table "public"."Event" to "anon";

grant delete on table "public"."Event" to "authenticated";

grant insert on table "public"."Event" to "authenticated";

grant references on table "public"."Event" to "authenticated";

grant select on table "public"."Event" to "authenticated";

grant trigger on table "public"."Event" to "authenticated";

grant truncate on table "public"."Event" to "authenticated";

grant update on table "public"."Event" to "authenticated";

grant delete on table "public"."Event" to "service_role";

grant insert on table "public"."Event" to "service_role";

grant references on table "public"."Event" to "service_role";

grant select on table "public"."Event" to "service_role";

grant trigger on table "public"."Event" to "service_role";

grant truncate on table "public"."Event" to "service_role";

grant update on table "public"."Event" to "service_role";

grant delete on table "public"."Registration" to "anon";

grant insert on table "public"."Registration" to "anon";

grant references on table "public"."Registration" to "anon";

grant select on table "public"."Registration" to "anon";

grant trigger on table "public"."Registration" to "anon";

grant truncate on table "public"."Registration" to "anon";

grant update on table "public"."Registration" to "anon";

grant delete on table "public"."Registration" to "authenticated";

grant insert on table "public"."Registration" to "authenticated";

grant references on table "public"."Registration" to "authenticated";

grant select on table "public"."Registration" to "authenticated";

grant trigger on table "public"."Registration" to "authenticated";

grant truncate on table "public"."Registration" to "authenticated";

grant update on table "public"."Registration" to "authenticated";

grant delete on table "public"."Registration" to "service_role";

grant insert on table "public"."Registration" to "service_role";

grant references on table "public"."Registration" to "service_role";

grant select on table "public"."Registration" to "service_role";

grant trigger on table "public"."Registration" to "service_role";

grant truncate on table "public"."Registration" to "service_role";

grant update on table "public"."Registration" to "service_role";

grant delete on table "public"."UserBadge" to "anon";

grant insert on table "public"."UserBadge" to "anon";

grant references on table "public"."UserBadge" to "anon";

grant select on table "public"."UserBadge" to "anon";

grant trigger on table "public"."UserBadge" to "anon";

grant truncate on table "public"."UserBadge" to "anon";

grant update on table "public"."UserBadge" to "anon";

grant delete on table "public"."UserBadge" to "authenticated";

grant insert on table "public"."UserBadge" to "authenticated";

grant references on table "public"."UserBadge" to "authenticated";

grant select on table "public"."UserBadge" to "authenticated";

grant trigger on table "public"."UserBadge" to "authenticated";

grant truncate on table "public"."UserBadge" to "authenticated";

grant update on table "public"."UserBadge" to "authenticated";

grant delete on table "public"."UserBadge" to "service_role";

grant insert on table "public"."UserBadge" to "service_role";

grant references on table "public"."UserBadge" to "service_role";

grant select on table "public"."UserBadge" to "service_role";

grant trigger on table "public"."UserBadge" to "service_role";

grant truncate on table "public"."UserBadge" to "service_role";

grant update on table "public"."UserBadge" to "service_role";

grant delete on table "public"."UserProfile" to "anon";

grant insert on table "public"."UserProfile" to "anon";

grant references on table "public"."UserProfile" to "anon";

grant select on table "public"."UserProfile" to "anon";

grant trigger on table "public"."UserProfile" to "anon";

grant truncate on table "public"."UserProfile" to "anon";

grant update on table "public"."UserProfile" to "anon";

grant delete on table "public"."UserProfile" to "authenticated";

grant insert on table "public"."UserProfile" to "authenticated";

grant references on table "public"."UserProfile" to "authenticated";

grant select on table "public"."UserProfile" to "authenticated";

grant trigger on table "public"."UserProfile" to "authenticated";

grant truncate on table "public"."UserProfile" to "authenticated";

grant update on table "public"."UserProfile" to "authenticated";

grant delete on table "public"."UserProfile" to "service_role";

grant insert on table "public"."UserProfile" to "service_role";

grant references on table "public"."UserProfile" to "service_role";

grant select on table "public"."UserProfile" to "service_role";

grant trigger on table "public"."UserProfile" to "service_role";

grant truncate on table "public"."UserProfile" to "service_role";

grant update on table "public"."UserProfile" to "service_role";

grant delete on table "public"."userAdmins" to "anon";

grant insert on table "public"."userAdmins" to "anon";

grant references on table "public"."userAdmins" to "anon";

grant select on table "public"."userAdmins" to "anon";

grant trigger on table "public"."userAdmins" to "anon";

grant truncate on table "public"."userAdmins" to "anon";

grant update on table "public"."userAdmins" to "anon";

grant delete on table "public"."userAdmins" to "authenticated";

grant insert on table "public"."userAdmins" to "authenticated";

grant references on table "public"."userAdmins" to "authenticated";

grant select on table "public"."userAdmins" to "authenticated";

grant trigger on table "public"."userAdmins" to "authenticated";

grant truncate on table "public"."userAdmins" to "authenticated";

grant update on table "public"."userAdmins" to "authenticated";

grant delete on table "public"."userAdmins" to "service_role";

grant insert on table "public"."userAdmins" to "service_role";

grant references on table "public"."userAdmins" to "service_role";

grant select on table "public"."userAdmins" to "service_role";

grant trigger on table "public"."userAdmins" to "service_role";

grant truncate on table "public"."userAdmins" to "service_role";

grant update on table "public"."userAdmins" to "service_role";

grant delete on table "public"."userAdmins" to "supabase_auth_admin";

grant insert on table "public"."userAdmins" to "supabase_auth_admin";

grant references on table "public"."userAdmins" to "supabase_auth_admin";

grant select on table "public"."userAdmins" to "supabase_auth_admin";

grant trigger on table "public"."userAdmins" to "supabase_auth_admin";

grant truncate on table "public"."userAdmins" to "supabase_auth_admin";

grant update on table "public"."userAdmins" to "supabase_auth_admin";

create policy "Badge unified access policy"
on "public"."Badge"
as permissive
for all
to public
using (true)
with check (((( SELECT auth.role() AS role) = 'authenticated'::text) AND ( SELECT is_admin() AS is_admin)));


create policy "ContactMessage delete policy"
on "public"."ContactMessage"
as permissive
for delete
to authenticated
using (( SELECT is_admin() AS is_admin));


create policy "ContactMessage insert policy"
on "public"."ContactMessage"
as permissive
for insert
to public
with check (true);


create policy "ContactMessage read policy"
on "public"."ContactMessage"
as permissive
for select
to authenticated
using (( SELECT is_admin() AS is_admin));


create policy "ContactMessage update policy"
on "public"."ContactMessage"
as permissive
for update
to authenticated
using (( SELECT is_admin() AS is_admin))
with check (( SELECT is_admin() AS is_admin));


create policy "Event unified access policy"
on "public"."Event"
as permissive
for all
to public
using (true)
with check (((( SELECT auth.role() AS role) = 'authenticated'::text) AND ( SELECT is_admin() AS is_admin)));


create policy "Registration delete policy"
on "public"."Registration"
as permissive
for delete
to authenticated
using (( SELECT is_admin() AS is_admin));


create policy "Registration insert policy"
on "public"."Registration"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = "userId") OR ( SELECT is_admin() AS is_admin)));


create policy "Registration read policy"
on "public"."Registration"
as permissive
for select
to public
using (true);


create policy "Registration update policy"
on "public"."Registration"
as permissive
for update
to authenticated
using (( SELECT is_admin() AS is_admin))
with check (( SELECT is_admin() AS is_admin));


create policy "UserBadge unified access policy"
on "public"."UserBadge"
as permissive
for all
to public
using (true)
with check (((( SELECT auth.role() AS role) = 'authenticated'::text) AND ( SELECT is_admin() AS is_admin)));


create policy "Users can read their own profile optimized"
on "public"."UserProfile"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update their own profile optimized"
on "public"."UserProfile"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "userAdmins unified access policy"
on "public"."userAdmins"
as permissive
for all
to authenticated
using (((( SELECT auth.uid() AS uid) = "userId") OR ( SELECT is_admin() AS is_admin)))
with check (( SELECT is_admin() AS is_admin));


CREATE TRIGGER registration_changes_update_user_rating_trigger AFTER INSERT OR DELETE OR UPDATE ON public."Registration" FOR EACH ROW EXECUTE FUNCTION update_user_current_rating_from_registration();


grant delete on table "storage"."s3_multipart_uploads" to "postgres";

grant insert on table "storage"."s3_multipart_uploads" to "postgres";

grant references on table "storage"."s3_multipart_uploads" to "postgres";

grant select on table "storage"."s3_multipart_uploads" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads" to "postgres";

grant update on table "storage"."s3_multipart_uploads" to "postgres";

grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant references on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant select on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant update on table "storage"."s3_multipart_uploads_parts" to "postgres";

create policy "Allow admins full access to all buckets"
on "storage"."objects"
as permissive
for all
to authenticated
using (is_admin())
with check (is_admin());



