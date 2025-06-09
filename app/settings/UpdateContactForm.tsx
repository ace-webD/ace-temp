'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client'; // Standard client for mutations

interface UpdateContactFormProps {
  userId: string;
  initialContactNumber: string | null;
}

export default function UpdateContactForm({ userId, initialContactNumber }: UpdateContactFormProps) {
  const [contactNumber, setContactNumber] = useState<string>(initialContactNumber || '');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('UserProfile')
      .update({ contactNumber: contactNumber || null })
      .eq('userId', userId);

    if (updateError) {
      console.error('Error updating contact number:', updateError);
      setError('Failed to save contact number. Please try again.');
      toast.error('Failed to update contact number.');
    } else {
      toast.success('Contact number updated successfully.');
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 border-t border-[hsl(var(--border))] pt-6">
      {error && <p className="mb-4 text-sm text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}
      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter your contact number"
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={saving} className="cursor-pointer">
        {saving ? 'Saving...' : 'Save Contact'}
      </Button>
    </form>
  );
}
