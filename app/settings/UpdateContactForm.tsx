'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface UpdateContactFormProps {
  userId: string;
  initialContactNumber: string | null;
}

export default function UpdateContactForm({ userId, initialContactNumber }: UpdateContactFormProps) {
  const [contactNumber, setContactNumber] = useState<string>(initialContactNumber || '');
  const [saving, setSaving] = useState<boolean>(false);
  const supabase = createClient();
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;    // Validate mobile number format (10 digits)
    if (contactNumber && !/^[0-9]{10}$/.test(contactNumber)) {
      toast.error('Please enter a valid 10-digit contact number.');
      return;
    }    setSaving(true);

    const { error: updateError } = await supabase
      .from('UserProfile')
      .update({ contactNumber: contactNumber || null })
      .eq('userId', userId);    if (updateError) {
      console.error('Error updating contact number:', updateError);
      toast.error('Failed to update contact number. Please try again.');
    } else {
      toast.success('Contact number updated successfully.');
    }
    setSaving(false);
  };
  return (
    <form onSubmit={handleSave} className="space-y-6 border-t border-[hsl(var(--border))] pt-6">
      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>        <Input
          id="contactNumber"
          type="tel"
          value={contactNumber}
          onChange={(e) => {
            // Only allow numbers and limit to 10 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            setContactNumber(value);
          }}
          placeholder="Enter your 10-digit contact number"
          className="mt-1"
          maxLength={10}
        />
      </div>
      <Button type="submit" disabled={saving} className="cursor-pointer">
        {saving ? 'Saving...' : 'Save Contact'}
      </Button>
    </form>
  );
}
