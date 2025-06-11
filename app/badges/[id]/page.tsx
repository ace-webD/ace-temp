import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/database.types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge as UiBadge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Badge = Tables<'Badge'>;
type BadgeUser = Tables<'UserBadge'> & {
  UserProfile: Pick<Tables<'UserProfile'>, 'userId' | 'name'> | null;
  earnedAt: string;
};

async function fetchBadgeById(id: string, supabase: any): Promise<{ badge: Badge | null; users: BadgeUser[] }> {
  const { data: badgeData, error: badgeError } = await supabase
    .from('Badge')
    .select('*')
    .eq('id', id)
    .single();

  if (badgeError) {
    console.error(`Error fetching badge with id ${id}:`, badgeError);
    return { badge: null, users: [] }; 
  }

  const { data: usersData, error: usersError } = await supabase
    .from('UserBadge')
    .select(`
      userId,
      earnedAt,
      UserProfile (userId, name)
    `)
    .eq('badgeId', id);

  if (usersError) {
    console.error(`Error fetching users for badge id ${id}:`, usersError);
    return { badge: badgeData, users: [] }; 
  }

  return { badge: badgeData, users: usersData as BadgeUser[] };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { badge } = await fetchBadgeById(resolvedParams.id, supabase);

  if (!badge) {
    return {
      title: 'Badge Not Found',
    };
  }

  return {
    title: `${badge.name} - Badge Details`,
    description: badge.description,
  };
}

export default async function BadgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { badge, users } = await fetchBadgeById(resolvedParams.id, supabase);

  if (!badge) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const publicIconUrl = badge.iconUrl
    ? supabase.storage.from('badges').getPublicUrl(badge.iconUrl).data.publicUrl
    : null;

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link href="/badges" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Back to All Badges
      </Link>

      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-3 items-start">
          <div className="md:col-span-1 p-6 bg-muted flex items-center justify-center aspect-square">
            {publicIconUrl ? (
              <Image
                src={publicIconUrl}
                alt={`${badge.name} icon`}
                width={250}
                height={250}
                className="object-contain rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center rounded-md">
                <span className="text-muted-foreground text-lg">No Icon Available</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <CardHeader className="border-b">
              <CardTitle className="text-3xl font-bold text-primary tracking-tight">
                {badge.name}
              </CardTitle>
              <UiBadge variant={badge.type === 'AUTOMATIC' ? 'secondary' : 'default'} className="mt-1 w-fit">
                {badge.type} BADGE
              </UiBadge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {badge.description}
                </p>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      {users && users.length > 0 && (
        <div className="pt-8 mt-10">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center md:text-left">Recipients</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((userBadge) => {
              if (!userBadge.UserProfile) return null;
              return (
                <div key={userBadge.UserProfile.userId} className="p-5 rounded-xl shadow-lg bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col items-center text-center">
                  <Link href={`/user/${userBadge.UserProfile.userId}`} className="group">
                    <h4 className="text-lg font-semibold text-primary group-hover:underline mb-1">
                      {userBadge.UserProfile.name || 'Unnamed User'}
                    </h4>
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    Earned on: {formatDate(userBadge.earnedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
