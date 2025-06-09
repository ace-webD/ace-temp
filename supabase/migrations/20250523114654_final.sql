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
    "userId" uuid not null,
    "eventId" uuid not null,
    "registeredAt" timestamp with time zone not null default now(),
    "attended" boolean,
    "points" integer
);


alter table "public"."Registration" enable row level security;

create table "public"."UserBadge" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "badgeId" uuid not null,
    "earnedAt" timestamp with time zone not null default now()
);


alter table "public"."UserBadge" enable row level security;

create table "public"."UserProfile" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "registrationNumber" text not null,
    "department" text not null,
    "year" integer not null,
    "contactNumber" text,
    "currentRating" integer not null default 0,
    "name" text not null
);


alter table "public"."UserProfile" enable row level security;

create table "public"."user_admins" (
    "user_id" uuid not null,
    "is_admin" boolean not null default false
);


alter table "public"."user_admins" enable row level security;

CREATE UNIQUE INDEX "Badge_name_key" ON public."Badge" USING btree (name);

CREATE UNIQUE INDEX "Badge_pkey" ON public."Badge" USING btree (id);

CREATE UNIQUE INDEX "ContactMessage_pkey" ON public."ContactMessage" USING btree (id);

CREATE UNIQUE INDEX "Event_pkey" ON public."Event" USING btree (id);

CREATE UNIQUE INDEX "Registration_pkey" ON public."Registration" USING btree (id);

CREATE UNIQUE INDEX "Registration_userId_eventId_key" ON public."Registration" USING btree ("userId", "eventId");

CREATE UNIQUE INDEX "UserBadge_pkey" ON public."UserBadge" USING btree (id);

CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON public."UserBadge" USING btree ("userId", "badgeId");

CREATE UNIQUE INDEX "UserProfile_pkey" ON public."UserProfile" USING btree (id);

CREATE UNIQUE INDEX "UserProfile_userId_key" ON public."UserProfile" USING btree ("userId");

CREATE UNIQUE INDEX user_admins_pkey ON public.user_admins USING btree (user_id);

alter table "public"."Badge" add constraint "Badge_pkey" PRIMARY KEY using index "Badge_pkey";

alter table "public"."ContactMessage" add constraint "ContactMessage_pkey" PRIMARY KEY using index "ContactMessage_pkey";

alter table "public"."Event" add constraint "Event_pkey" PRIMARY KEY using index "Event_pkey";

alter table "public"."Registration" add constraint "Registration_pkey" PRIMARY KEY using index "Registration_pkey";

alter table "public"."UserBadge" add constraint "UserBadge_pkey" PRIMARY KEY using index "UserBadge_pkey";

alter table "public"."UserProfile" add constraint "UserProfile_pkey" PRIMARY KEY using index "UserProfile_pkey";

alter table "public"."user_admins" add constraint "user_admins_pkey" PRIMARY KEY using index "user_admins_pkey";

alter table "public"."Badge" add constraint "Badge_name_key" UNIQUE using index "Badge_name_key";

alter table "public"."Registration" add constraint "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE not valid;

alter table "public"."Registration" validate constraint "Registration_eventId_fkey";

alter table "public"."Registration" add constraint "Registration_userId_eventId_key" UNIQUE using index "Registration_userId_eventId_key";

alter table "public"."Registration" add constraint "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE not valid;

alter table "public"."Registration" validate constraint "Registration_userId_fkey";

alter table "public"."UserBadge" add constraint "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"(id) ON DELETE CASCADE not valid;

alter table "public"."UserBadge" validate constraint "UserBadge_badgeId_fkey";

alter table "public"."UserBadge" add constraint "UserBadge_userId_badgeId_key" UNIQUE using index "UserBadge_userId_badgeId_key";

alter table "public"."UserBadge" add constraint "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE CASCADE not valid;

alter table "public"."UserBadge" validate constraint "UserBadge_userId_fkey";

alter table "public"."UserProfile" add constraint "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."UserProfile" validate constraint "UserProfile_userId_fkey";

alter table "public"."UserProfile" add constraint "UserProfile_userId_key" UNIQUE using index "UserProfile_userId_key";

alter table "public"."user_admins" add constraint "user_admins_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "UserProfile"("userId") ON DELETE CASCADE not valid;

alter table "public"."user_admins" validate constraint "user_admins_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_new_user_profile(p_user_id uuid, p_name text, p_registration_number text, p_year integer, p_department text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public."UserProfile" ("userId","name", "registrationNumber", year, department)
    VALUES (p_user_id,p_name,p_registration_number, p_year, p_department)
    -- Optional: Handle conflict if, due to a race condition, the profile was just created.
    -- The calling Next.js code already checks, but this adds robustness.
    ON CONFLICT ("userId") DO NOTHING;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
  declare
    claims jsonb;
    is_admin_status boolean;
  begin
    claims := event->'claims';
    select is_admin into is_admin_status from public.user_admins where user_id = (event->>'user_id')::uuid;
    if jsonb_typeof(claims->'is_admin') = 'null' or claims->'is_admin' is null then
      claims := jsonb_set(claims, '{is_admin}', to_jsonb(coalesce(is_admin_status, false)));
    end if;
    event := jsonb_set(event, '{claims}', claims);
    return event;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.custom_claims_get(claim_name text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce(current_setting('request.jwt.claims', true)::jsonb ->> claim_name, null)::jsonb;
$function$
;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
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
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT coalesce(public.custom_claims_get('is_admin')::boolean, false);
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_current_rating_from_registration()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Handle INSERT operations
    IF (TG_OP = 'INSERT') THEN
        -- Only update if points are explicitly provided and non-zero during insert
        -- (Your current client code inserts points as NULL, so this part won't run on initial registration)
        IF NEW.points IS NOT NULL AND NEW.points <> 0 THEN
            UPDATE public."UserProfile"
            SET "currentRating" = "currentRating" + NEW.points
            WHERE "userId" = NEW."userId";
        END IF;
    -- Handle UPDATE operations
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Update if points have changed
        IF NEW."userId" IS NOT NULL AND (COALESCE(OLD.points, 0) <> COALESCE(NEW.points, 0)) THEN
            UPDATE public."UserProfile"
            SET "currentRating" = "currentRating" + (COALESCE(NEW.points, 0) - COALESCE(OLD.points, 0))
            WHERE "userId" = NEW."userId";
        END IF;
    -- Handle DELETE operations
    ELSIF (TG_OP = 'DELETE') THEN
        -- Subtract points if the deleted registration had points
        IF OLD.points IS NOT NULL AND OLD.points <> 0 THEN
            UPDATE public."UserProfile"
            SET "currentRating" = "currentRating" - OLD.points
            WHERE "userId" = OLD."userId";
        END IF;
    END IF;
    RETURN NULL; -- The result is ignored for AFTER triggers
END;
$function$
;

grant delete on table "public"."Badge" to "anon";

grant insert on table "public"."Badge" to "anon";

grant select on table "public"."Badge" to "anon";

grant update on table "public"."Badge" to "anon";

grant delete on table "public"."Badge" to "authenticated";

grant insert on table "public"."Badge" to "authenticated";

grant select on table "public"."Badge" to "authenticated";

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

grant select on table "public"."ContactMessage" to "anon";

grant update on table "public"."ContactMessage" to "anon";

grant delete on table "public"."ContactMessage" to "authenticated";

grant insert on table "public"."ContactMessage" to "authenticated";

grant select on table "public"."ContactMessage" to "authenticated";

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

grant select on table "public"."Event" to "anon";

grant update on table "public"."Event" to "anon";

grant delete on table "public"."Event" to "authenticated";

grant insert on table "public"."Event" to "authenticated";

grant select on table "public"."Event" to "authenticated";

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

grant select on table "public"."Registration" to "anon";

grant update on table "public"."Registration" to "anon";

grant delete on table "public"."Registration" to "authenticated";

grant insert on table "public"."Registration" to "authenticated";

grant select on table "public"."Registration" to "authenticated";

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

grant select on table "public"."UserBadge" to "anon";

grant update on table "public"."UserBadge" to "anon";

grant delete on table "public"."UserBadge" to "authenticated";

grant insert on table "public"."UserBadge" to "authenticated";

grant select on table "public"."UserBadge" to "authenticated";

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

grant select on table "public"."UserProfile" to "anon";

grant update on table "public"."UserProfile" to "anon";

grant delete on table "public"."UserProfile" to "authenticated";

grant insert on table "public"."UserProfile" to "authenticated";

grant select on table "public"."UserProfile" to "authenticated";

grant update on table "public"."UserProfile" to "authenticated";

grant delete on table "public"."UserProfile" to "service_role";

grant insert on table "public"."UserProfile" to "service_role";

grant references on table "public"."UserProfile" to "service_role";

grant select on table "public"."UserProfile" to "service_role";

grant trigger on table "public"."UserProfile" to "service_role";

grant truncate on table "public"."UserProfile" to "service_role";

grant update on table "public"."UserProfile" to "service_role";

grant delete on table "public"."user_admins" to "anon";

grant insert on table "public"."user_admins" to "anon";

grant select on table "public"."user_admins" to "anon";

grant update on table "public"."user_admins" to "anon";

grant delete on table "public"."user_admins" to "authenticated";

grant insert on table "public"."user_admins" to "authenticated";

grant select on table "public"."user_admins" to "authenticated";

grant update on table "public"."user_admins" to "authenticated";

grant delete on table "public"."user_admins" to "service_role";

grant insert on table "public"."user_admins" to "service_role";

grant references on table "public"."user_admins" to "service_role";

grant select on table "public"."user_admins" to "service_role";

grant trigger on table "public"."user_admins" to "service_role";

grant truncate on table "public"."user_admins" to "service_role";

grant update on table "public"."user_admins" to "service_role";

grant delete on table "public"."user_admins" to "supabase_auth_admin";

grant insert on table "public"."user_admins" to "supabase_auth_admin";

grant select on table "public"."user_admins" to "supabase_auth_admin";

grant update on table "public"."user_admins" to "supabase_auth_admin";

create policy "Allow admin full access to badges"
on "public"."Badge"
as permissive
for all
to public
using (is_admin())
with check (is_admin());


create policy "Allow authenticated read access to badges"
on "public"."Badge"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."Badge"
as permissive
for select
to public
using (true);


create policy "Allow admin delete access to messages"
on "public"."ContactMessage"
as permissive
for delete
to public
using (is_admin());


create policy "Allow admin read access to messages"
on "public"."ContactMessage"
as permissive
for select
to public
using (is_admin());


create policy "Enable read access for all users"
on "public"."ContactMessage"
as permissive
for select
to public
using (true);


create policy "Enable write access for all users"
on "public"."ContactMessage"
as permissive
for insert
to public
with check (true);


create policy "Allow admin full access to events"
on "public"."Event"
as permissive
for all
to public
using (is_admin())
with check (is_admin());


create policy "Allow authenticated read access to events"
on "public"."Event"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."Event"
as permissive
for select
to anon
using (true);


create policy "Admin: Full access to registrations"
on "public"."Registration"
as permissive
for all
to public
using (is_admin())
with check (is_admin());


create policy "Authenticated: Insert own registrations"
on "public"."Registration"
as permissive
for insert
to authenticated
with check ((auth.uid() = "userId"));


create policy "Public: Read access to registrations"
on "public"."Registration"
as permissive
for select
to public
using (true);


create policy "Admin: Full access to user_badges"
on "public"."UserBadge"
as permissive
for all
to public
using (is_admin())
with check (is_admin());


create policy "Public: Read access to user_badges"
on "public"."UserBadge"
as permissive
for select
to public
using (true);


create policy "Allow admin full access to profiles"
on "public"."UserProfile"
as permissive
for all
to public
using (is_admin())
with check (is_admin());


create policy "Allow authenticated users to view profiles"
on "public"."UserProfile"
as permissive
for select
to authenticated
using (true);


create policy "Allow users to insert their own profile"
on "public"."UserProfile"
as permissive
for insert
to authenticated
with check ((auth.uid() = "userId"));


create policy "Allow users to update their own profile"
on "public"."UserProfile"
as permissive
for update
to authenticated
using ((auth.uid() = "userId"))
with check ((auth.uid() = "userId"));


create policy "Enable read access for all users"
on "public"."UserProfile"
as permissive
for select
to public
using (true);


create policy "Allow admin users to manage admin status"
on "public"."user_admins"
as permissive
for all
to public
using (((custom_claims_get('is_admin'::text))::boolean = true))
with check (((custom_claims_get('is_admin'::text))::boolean = true));


create policy "Allow auth admin to read user admin status"
on "public"."user_admins"
as permissive
for select
to supabase_auth_admin
using (true);


create policy "Allow individual user access to own admin status"
on "public"."user_admins"
as permissive
for select
to public
using ((auth.uid() = user_id));


CREATE TRIGGER registration_changes_update_user_rating_trigger AFTER INSERT OR DELETE OR UPDATE ON public."Registration" FOR EACH ROW EXECUTE FUNCTION update_user_current_rating_from_registration();