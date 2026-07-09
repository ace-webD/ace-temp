'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FeedbackModalProps {
  eventId: string;
  userId: string;
  eventName: string;
  onClose?: () => void;
}

export function FeedbackModal({ eventId, userId, eventName, onClose }: FeedbackModalProps) {
  const supabase = createClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from('Feedback').insert([
        {
          eventId,
          userId,
          rating,
          comment: comment.trim() || null,
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          alert('You have already submitted feedback for this event');
        } else {
          throw error;
        }
        return;
      }

      alert('Thank you for your feedback!');
      onClose?.();
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Event Feedback</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{eventName}</p>

        {/* Star Rating */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">How would you rate this event?</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Comments (optional)</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about the event..."
            className="w-full border rounded p-2 text-sm min-h-[100px] bg-transparent"
            maxLength={500}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  );
}