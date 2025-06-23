import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/database.types';
import BadgesClientView from './BadgesClientView';

type Badge = Tables<'Badge'> & {
  publicIconUrl: string | null;
};

async function fetchAndProcessBadges(): Promise<Badge[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('Badge')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }

  // Add public URLs to existing badge data
  return data.map((badge) => ({
    ...badge,
    publicIconUrl: badge.iconUrl
      ? supabase.storage.from('badges').getPublicUrl(badge.iconUrl).data.publicUrl
      : null,
  }));
}

export const metadata = {
  title: 'All Badges',
  description: 'Browse all available badges.',
};

export default async function BadgesPage() {
  const badges = await fetchAndProcessBadges();

  return <BadgesClientView badges={badges} />;
}