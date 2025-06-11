"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; // Added Link import
import { useAuth } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import type { Tables, TablesInsert } from '@/lib/supabase/database.types';
import { createClient } from '@/lib/supabase/client';
// Define a type for participants that includes registration date and points
export type ParticipantWithRegistrationDate = Tables<'UserProfile'> & {
  registered_at: string;
  points: number | null;
};

// Define a type for leaderboard entry
export type LeaderboardEntry = ParticipantWithRegistrationDate;

// Props for the client component
interface EventDetailClientProps {
  initialEvent: Tables<'Event'> | null; // This should automatically pick up the new 'status' field if types are up-to-date
  initialParticipants: ParticipantWithRegistrationDate[];
  eventId: string;
}

export default function EventDetailClient({ initialEvent, initialParticipants, eventId }: EventDetailClientProps) {
  const supabaseClient = createClient();
  const router = useRouter();
  const { user: authUser, supabase, loading: authLoading, login } = useAuth();

  const [event, setEvent] = useState<Tables<'Event'> | null>(initialEvent);
  const [participants, setParticipants] = useState<ParticipantWithRegistrationDate[]>(initialParticipants);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userProfile, setUserProfile] = useState<Tables<'UserProfile'> | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactNumberInput, setContactNumberInput] = useState('');
  const [isRegisterConfirmOpen, setIsRegisterConfirmOpen] = useState(false); // New state for register confirmation

  useEffect(() => {
    setEvent(initialEvent); // Update event state if prop changes
    setParticipants(initialParticipants); // Update participants state if prop changes

    // Updated to use event.status
    if (initialEvent?.status === 'DONE' && initialParticipants.length > 0) {
      const sortedLeaderboard = [...initialParticipants].sort((a, b) => {
        // Ensure points are numbers for comparison, default to 0 if null
        const pointsA = a.points ?? 0;
        const pointsB = b.points ?? 0;
        return pointsB - pointsA; // Sort descending by points
      });
      setLeaderboardData(sortedLeaderboard);
    } else if (initialEvent?.status !== 'DONE') {
      setLeaderboardData([]); // Clear leaderboard if event is not DONE
    }
  }, [initialEvent, initialParticipants]);

  const checkUserRegistration = useCallback(async (userId: string, currentEventId: string) => {
    if (!userId || !currentEventId || !supabase) return;
    const { data, error } = await supabase
      .from('Registration')
      .select('id')
      .eq('userId', userId)
      .eq('eventId', currentEventId)
      .maybeSingle();

    if (error) {
      console.error('Error checking registration status:', error.message);
      toast.error("Could not check registration status.");
    } else {
      setIsRegistered(!!data);
    }
  }, [supabase]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser || !supabase) return;
      setProfileLoading(true);      const { data: profile, error: profileError } = await supabase
        .from('UserProfile')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("EventDetailClient: Error fetching profile:", profileError.message);
        setUserProfile(null);
      } else {
        setUserProfile(profile || null);
        setContactNumberInput(profile?.contactNumber || '');
      }
      setProfileLoading(false);
    };

    if (authUser && !authLoading) {
      fetchUserProfile();
    } else if (!authLoading && !authUser) {
        setUserProfile(null);
        setContactNumberInput('');
    }
  }, [authUser, authLoading, supabase]);

  useEffect(() => {
    if (authUser && eventId && !authLoading) {
      checkUserRegistration(authUser.id, eventId);
    }
  }, [authUser, eventId, authLoading, checkUserRegistration]);

  useEffect(() => {
    // This effect updates leaderboard if participants state changes client-side OR event status changes
    // Updated to use event.status
    if (event?.status === 'DONE' && participants.length > 0) {
      const sortedLeaderboard = [...participants].sort((a, b) => {
        const pointsA = a.points ?? 0;
        const pointsB = b.points ?? 0;
        return pointsB - pointsA; // Sort descending
      });
      setLeaderboardData(sortedLeaderboard);
    } else if (event?.status !== 'DONE') {
      setLeaderboardData([]); // Clear leaderboard if event is not DONE
    }
  }, [event?.status, participants]);

  const handleRegister = async () => {
    if (!authUser || !userProfile || !event || !supabase) {
      toast.error("User not logged in or profile not loaded.");
      return;
    }

    if (!userProfile.contactNumber && !contactNumberInput.trim()) {
      setIsContactModalOpen(true);
      return;
    }
    // Open confirmation dialog instead of proceeding directly
    setIsRegisterConfirmOpen(true);
  };

  // New function to execute registration after confirmation
  const executeRegister = async () => {
    if (!authUser || !userProfile || !event || !supabase) { // Basic checks again
      toast.error("User not logged in or profile not loaded.");
      return;
    }
    setIsRegisterConfirmOpen(false); // Close dialog

    let currentContactNumber = userProfile.contactNumber;    // This part handles contact number update if it was changed in the contact modal
    // and then the user proceeded to confirm registration.
    if (contactNumberInput.trim() && contactNumberInput.trim() !== userProfile.contactNumber) {
      setIsSubmitting(true); // isSubmitting for the whole process now
      const { error: updateError } = await supabase
        .from('UserProfile')
        .update({ contactNumber: contactNumberInput.trim() })
        .eq('id', authUser.id);

      if (updateError) {
        toast.error("Failed to update contact number. Please try again.");
        setIsSubmitting(false);
        return;
      }
      currentContactNumber = contactNumberInput.trim();
      setUserProfile(prev => prev ? {...prev, contactNumber: currentContactNumber} : null);
      // toast.success("Contact number updated."); // Optional: can be too noisy if registration follows immediately
    }
    // Ensure contact modal is closed if it was open before this flow
    setIsContactModalOpen(false);

    setIsSubmitting(true);
    try {
      const registrationPayload: TablesInsert<'Registration'> = {
        eventId: event.id,
        userId: authUser.id,
        points: null,
      };
      const { error: registrationError } = await supabase
        .from('Registration')
        .insert(registrationPayload);

      if (registrationError) {
        toast.error(registrationError.message || "Failed to register for the event.");
      } else {
        toast.success("Successfully registered for the event!");
        setIsRegistered(true);
        if (userProfile) { // userProfile should be up-to-date with contactNumber if changed
            const newParticipant: ParticipantWithRegistrationDate = {
                ...userProfile, // Use the potentially updated userProfile
                contactNumber: currentContactNumber, // Ensure the latest contact number is used
                registered_at: new Date().toISOString(),
                points: null,
            };
            setParticipants(prev => [...prev, newParticipant]);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async () => {
    const trimmedContactNumber = contactNumberInput.trim();

    if (!trimmedContactNumber) {
      toast.error("Contact number cannot be empty.");
      return;
    }
    const isValidContactNumber = (number: string): boolean => {
      const tenDigitsRegex = /^\d{10}$/;
      return tenDigitsRegex.test(number);
    };

    if (!isValidContactNumber(trimmedContactNumber)) {
      toast.error("Please enter a valid 10-digit contact number. Only digits are allowed.");
      return;
    }

    if (!authUser || !supabase) {
        toast.error("User not authenticated.");
        return;
    }    setIsSubmitting(true);
    const { error } = await supabase
        .from('UserProfile')
        .update({ contactNumber: contactNumberInput.trim() })
        .eq('id', authUser.id);
    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to update contact number. Please try again.");
    } else {
      toast.success("Contact number updated. You can now register.");
      setUserProfile(prev => prev ? {...prev, contactNumber: contactNumberInput.trim()} : null);
      setIsContactModalOpen(false);
      if (event) { // No need to check userProfile here, it's updated above
         toast.info("Please click the 'Register' button again to complete your event registration.");
      }
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-muted-foreground">Event not found or failed to load.</p>
      </div>
    );
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A'; // Return N/A or some placeholder if dateString is null/undefined
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Updated to use event.status
  const canRegister = event?.status === 'OPEN';
  const isEventCompleted = event?.status === 'DONE';
  const imageContainerClass = isEventCompleted ? "aspect-video" : "aspect-4/5";

  return (
    <div className="container mx-auto px-4 py-8 pt-20 md:pt-24 min-h-screen">
      <div className="bg-card shadow-xl rounded-lg overflow-hidden">
        {/* Main layout for Image and Content */}
        <div className={`md:flex ${isEventCompleted ? 'flex-col' : 'flex-row md:gap-8'} ${!isEventCompleted ? 'md:items-start' : ''}`}>
          {isEventCompleted ? (
            <>
              {/* Image Section (Top for 'DONE' status) */}
              <div className={`relative w-full md:w-full ${imageContainerClass} rounded-lg shadow-md overflow-hidden`}>
                <Image
                  src={supabaseClient.storage.from('event-images').getPublicUrl(event.imgUrl ?? '').data.publicUrl || '/placeholder-event.jpg'}
                  alt={`${event.name} Poster`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              {/* Content Section (Below image for 'DONE' status) */}
              <div className={`px-6 py-6 md:py-8 w-full`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{event.name}</h1>
                <div className="mb-6 space-y-2 text-muted-foreground">
                  <p><strong>Type:</strong> <span className="font-semibold text-card-foreground">{event.type}</span></p>
                  <p><strong>Date & Time:</strong> <span className="font-semibold text-card-foreground">{formatDate(event.startTime)}</span></p>
                  <p><strong>Location:</strong> <span className="font-semibold text-card-foreground">{event.location}</span></p>
                  {event.organizer_info && <p><strong>Organizer:</strong> <span className="font-semibold text-card-foreground" style={{ whiteSpace: 'pre-line' }}>{event.organizer_info}</span></p>}
                </div>
                <div
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8 text-card-foreground"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {event.description || 'No description available.'}
                </div>
                {/* Button for DONE status */}
                <Button disabled className="w-full md:w-auto">Event Completed</Button>
              </div>
            </>
          ) : (
            <>
              {/* Content Section (Left for other statuses) */}
              <div className={`px-6 py-6 md:py-8 md:w-2/3`}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{event.name}</h1>
                <div className="mb-6 space-y-2 text-muted-foreground">
                  <p><strong>Type:</strong> <span className="font-semibold text-card-foreground">{event.type}</span></p>
                  <p><strong>Date & Time:</strong> <span className="font-semibold text-card-foreground">{formatDate(event.startTime)}</span></p>
                  <p><strong>Location:</strong> <span className="font-semibold text-card-foreground">{event.location}</span></p>
                  {event.organizer_info && <p><strong>Organizer:</strong> <span className="font-semibold text-card-foreground" style={{ whiteSpace: 'pre-line' }}>{event.organizer_info}</span></p>}
                </div>
                <div
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8 text-card-foreground"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {event.description || 'No description available.'}
                </div>
                {/* Buttons for non-DONE statuses */}
                {authUser ? (
                  isRegistered ? (
                    <Button disabled className="w-full md:w-auto">Already Registered</Button>
                  ) : (
                    canRegister ? (
                      <Button onClick={handleRegister} disabled={isSubmitting} className="w-full md:w-auto cursor-pointer">
                        {isSubmitting ? <Loader /> : 'Register for Event'}
                      </Button>
                    ) : (
                      <Button disabled className="w-full md:w-auto">Registration Closed</Button>
                    )
                  )
                ) : (
                  <Button onClick={login} className="w-full md:w-auto cursor-pointer">Login to Register</Button>
                )}
              </div>
              {/* Image Section (Right for other statuses) */}
              <div className={`relative w-full md:w-1/3 ${imageContainerClass} md:order-last rounded-lg shadow-md overflow-hidden`}>
                <Image
                  src={supabaseClient.storage.from('event-images').getPublicUrl(event.imgUrl ?? '').data.publicUrl || '/placeholder-event.jpg'}
                  alt={`${event.name} Poster`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </>
          )}
        </div>

        {event && (
          <div className="p-6 md:p-8 mt-0 md:mt-0"> 
            {isEventCompleted ? ( 
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Leaderboard</h2>
                {leaderboardData.length > 0 ? (
                  <>
                    <ul className="space-y-3">
                      {leaderboardData.map((entry, index) => (
                        // MODIFIED: Increased padding and rounding
                        <li key={entry.id || index} className="bg-muted p-4 rounded-lg shadow-sm flex justify-between items-center">
                          <div>
                            <Link
                              href={`/user/${entry.id}`}
                              className="font-semibold text-card-foreground hover:underline">
                              {entry.name || 'Anonymous User'}
                            </Link>
                            {/* REMOVED: Registered on date */}
                          </div>
                          <span className="font-bold text-lg text-primary">
                            {typeof entry.points === 'number' ? `${entry.points} pts` : '-'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-muted-foreground">No participants data available for the leaderboard.</p>
                )}
              </div>
            ) : (
              <div>
                {/* MODIFIED: Removed count from title */}
                <h2 className="text-2xl font-semibold mb-4 text-primary">Participants</h2>
                {participants.length > 0 ? (
                  <ul className="space-y-3">
                    {participants.map((participant, index) => (
                      // MODIFIED: Increased padding and rounding
                      <li key={participant.id || index} className="bg-muted p-4 rounded-lg shadow-sm">
                        <Link
                          href={`/user/${participant.id}`}
                          className="font-semibold text-card-foreground hover:underline">
                          {participant.name || 'Anonymous User'}
                        </Link>
                        {/* REMOVED: Registered on date */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    {isEventCompleted ? "No participants data available." : "No participants yet. Be the first to register!"}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Contact Number</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-sm text-muted-foreground">
              To register for this event, please provide your contact number.
            </p>
            <Label htmlFor="contact-modal-input">Contact Number</Label>
            <Input
              id="contact-modal-input"
              type="tel"
              value={contactNumberInput}
              onChange={(e) => setContactNumberInput(e.target.value)}
              placeholder="Enter your contact number"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline" onClick={() => setIsContactModalOpen(false)} className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <Button onClick={handleContactSubmit} disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? <Loader /> : 'Save and Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Register Confirmation Dialog */}
      <Dialog open={isRegisterConfirmOpen} onOpenChange={setIsRegisterConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to register for {event?.name}?
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsRegisterConfirmOpen(false)} className="cursor-pointer" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button onClick={executeRegister} disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? <Loader /> : 'Confirm Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
