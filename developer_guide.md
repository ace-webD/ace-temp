# Supabase Database Management Commands

## Type Generation
Generates TypeScript type definitions from the Supabase database schema and saves them to the local types file.

npx supabase gen types typescript --project-id vytqypgbcbtkuykebodm --schema public > lib/supabase/database.types.ts

## Docker Operations
Starts the local Supabase development environment using Docker containers.

## Database Migrations

### Pull migrations
Synchronizes local migration files with the remote database state
npx supabase db pull

### Generate single migration
Creates a new migration file for specific table changes with proper linking to the remote database (Delete the existing migrations folder)
npx supabase db diff -f my_table --linked --schema public,storage

## Admin User Management

### Add Admin User
Makes a user an admin by their email address. User must already exist and have a UserProfile.

-- Via SQL Editor in Supabase Dashboard:
SELECT public.add_admin_user('125015150@sastra.ac.in');

### Remove Admin User
Removes admin privileges from a user by their email address.

-- Via SQL Editor in Supabase Dashboard:
SELECT public.remove_admin_user('125015150@sastra.ac.in');