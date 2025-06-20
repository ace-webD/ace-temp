import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';
import UpdateContactForm from './UpdateContactForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type UserProfile = Tables<'UserProfile'>;

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();          

    if (authError || !authUser) {
        console.log('SettingsPage: No authenticated user, redirecting to login.');
        redirect('/');
    }    const { data: userProfile, error: profileError } = await supabase
        .from('UserProfile')
        .select('*')
        .eq('id', authUser.id)
        .single<UserProfile>();

    if (profileError && profileError.code !== 'PGRST116') { 
        console.error('Error fetching user profile:', profileError);
        return (
            <div className="container mx-auto p-4 text-center">
                <Card className="bg-card p-6 rounded-lg shadow-lg mt-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-destructive">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-500">Failed to load Settings. Please try again. Details: {profileError.message}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="container mx-auto p-4 text-center">
                <Card className="bg-card p-6 rounded-lg shadow-lg mt-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-primary">Settings Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Settings not found. You might need to complete your settings setup.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card className="bg-card p-6 rounded-lg shadow-lg mt-6">
                <CardHeader className="text-center mb-6 pb-6 border-b border-[hsl(var(--border))]">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Your Settings</h1>
                </CardHeader>
                <CardContent className="space-y-5 mb-8">
                    <div>
                        <h2 className="text-sm font-medium text-muted-foreground">Name</h2>
                        <p className="text-md text-card-foreground">{userProfile.name}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-muted-foreground">Registration Number</h2>
                        <p className="text-md text-card-foreground">{userProfile.registrationNumber}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-muted-foreground">Department</h2>
                        <p className="text-md text-card-foreground">{userProfile.department}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-muted-foreground">Year</h2>
                        <p className="text-md text-card-foreground">{userProfile.year}</p>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-muted-foreground">Current Rating</h2>
                        <p className="text-md text-card-foreground">{userProfile.currentRating ?? 'N/A'}</p>
                    </div>
                </CardContent>

                <UpdateContactForm
                    userId={userProfile.id}
                    initialContactNumber={userProfile.contactNumber}
                />
            </Card>
        </div>
    );
}
