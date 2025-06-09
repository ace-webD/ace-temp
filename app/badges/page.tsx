import { createClient } from '@/lib/supabase/server';
import { Tables } from '@/lib/supabase/database.types';
import Link from 'next/link';
import { Badge as UiBadge } from '@/components/ui/badge'; // Alias to avoid conflict with type
import BadgesClientView from './BadgesClientView';

type Badge = Tables<'Badge'>;

async function fetchAllBadges(supabase: any): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('Badge')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
  return data;
}

export const metadata = {
  title: 'All Badges',
  description: 'Browse all available badges.',
};

export default async function BadgesPage() {
  const supabase = await createClient();
  const badges = await fetchAllBadges(supabase);

  return <BadgesClientView badges={badges} />
}