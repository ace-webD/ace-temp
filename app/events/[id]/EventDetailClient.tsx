"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import type { Tables, TablesInsert } from '@/lib/supabase/database.types';
import { createClient } from '@/lib/supabase/client';

export type ParticipantWithPoints = Tables<'UserProfile'> & {
  points: number | null;
};

interface EventDetailClientProps {
  initialEvent: Tables<'Event'> | null;
  initialParticipants: ParticipantWithPoints[];
  eventId: string;
}

const isValidContactNumber = (number: string): boolean => /^\d{10}$/.test(number);

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function EventDetailClient({ initialEvent, initialParticipants, eventId }: EventDetailClientProps) {
  const supabaseClient = createClient();
  const { user: authUser, supabase, loading: authLoading, login } = useAuth();

  const [event] = useState<Tables<'Event'> | null>(initialEvent);
  const [participants, setParticipants] = useState<ParticipantWithPoints[]>(initialParticipants);
  const [userProfile, setUserProfile] = useState<Tables<'UserProfile'> | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactModal, setContactModal] = useState({ isOpen: false, contactNumber: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isEventCompleted = event?.status === 'DONE';
  const canRegister = event?.status === 'OPEN';
  const leaderboardData = isEventCompleted ? participants : [];

  // Fetch user profile and check registration status
  useEffect(() => {
    if (!authUser || !supabase || authLoading) return;

    const fetchUserData = async () => {
      const [profileResponse, registrationResponse] = await Promise.all([
        supabase.from('UserProfile').select('*').eq('id', authUser.id).single(),
        supabase.from('Registration').select('id').eq('userId', authUser.id).eq('eventId', eventId).maybeSingle()
      ]);

      if (!profileResponse.error) {
        setUserProfile(profileResponse.data);
        setContactModal(prev => ({ ...prev, contactNumber: profileResponse.data?.contactNumber || '' }));
      }

      if (!registrationResponse.error) {
        setIsRegistered(!!registrationResponse.data);
      }
    };

    fetchUserData();
  }, [authUser, supabase, authLoading, eventId]);

  const handleRegister = async () => {
    if (!authUser || !userProfile || !event || !supabase) {
      toast.error("Please log in to register.");
      return;
    }

    // Check if contact number is needed
    if (!userProfile.contactNumber && !contactModal.contactNumber.trim()) {
      setContactModal({ ...contactModal, isOpen: true });
      return;
    }

    setShowConfirmDialog(true);
  };

  const executeRegister = async () => {
    if (!authUser || !event || !supabase) return;

    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {      // Update contact number if needed
      let updatedContactNumber = userProfile?.contactNumber;
      if (contactModal.contactNumber.trim() && contactModal.contactNumber.trim() !== userProfile?.contactNumber) {
        const { error: updateError } = await supabase
          .from('UserProfile')
          .update({ contactNumber: contactModal.contactNumber.trim() })
          .eq('id', authUser.id);

        if (updateError) throw new Error("Failed to update contact number");
        
        updatedContactNumber = contactModal.contactNumber.trim();
        setUserProfile(prev => prev ? { ...prev, contactNumber: updatedContactNumber! } : null);
      }

      // Register for event
      const registrationPayload: TablesInsert<'Registration'> = {
        eventId: event.id,
        userId: authUser.id,
        points: null,
      };

      const { error: registrationError } = await supabase
        .from('Registration')
        .insert(registrationPayload);

      if (registrationError) throw new Error(registrationError.message);

      toast.success("Successfully registered for the event!");
      setIsRegistered(true);
      setContactModal({ ...contactModal, isOpen: false });        // Add to participants list
        if (userProfile) {
          const newParticipant: ParticipantWithPoints = {
            ...userProfile,
            contactNumber: updatedContactNumber || null,
            points: null,
          };
          setParticipants(prev => [...prev, newParticipant]);
        }
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async () => {
    const trimmedContactNumber = contactModal.contactNumber.trim();

    if (!trimmedContactNumber) {
      toast.error("Contact number cannot be empty.");
      return;
    }

    if (!isValidContactNumber(trimmedContactNumber)) {
      toast.error("Please enter a valid 10-digit contact number.");
      return;
    }

    if (!authUser || !supabase) {
      toast.error("User not authenticated.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from('UserProfile')
      .update({ contactNumber: trimmedContactNumber })
      .eq('id', authUser.id);

    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to update contact number.");
    } else {
      toast.success("Contact number updated. Please register again.");
      setUserProfile(prev => prev ? { ...prev, contactNumber: trimmedContactNumber } : null);
      setContactModal({ contactNumber: trimmedContactNumber, isOpen: false });
    }
  };

  const imageContainerClass = isEventCompleted ? "aspect-video" : "aspect-4/5";

  const renderActionButton = () => {
    // if (!authUser) {
    //   return <Button onClick={login} className="w-full md:w-auto">Login to Register</Button>;
    // }

    // if (isRegistered) {
    //   return <Button disabled className="w-full md:w-auto">Already Registered</Button>;
    // }

    if (isEventCompleted) {
      return <Button disabled className="w-full md:w-auto">Event Completed</Button>;
    }

    if (!canRegister) {
      return <Button disabled className="w-full md:w-auto">Registration Closed</Button>;
    }

    return (
      <Link href={"https://docs.google.com/forms/d/e/1FAIpQLSemRLCOx5R3XFRKq0GIwbA9HuYhIqsD_Yl9fk0o34ehVUfrSA/viewform"} target="_blank" className="w-full md:w-auto">
        {/* <Button onClick={handleRegister} disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? <Loader /> : 'Register for Event'}
        </Button> */}
        <Button className="w-full md:w-auto">
          Register for Event
        </Button>
      </Link>
    );
  };

  const renderParticipantsList = () => {
    const dataToShow = isEventCompleted ? leaderboardData : participants;
    const title = isEventCompleted ? "Leaderboard" : "Participants";

    return (
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">{title}</h2>
        {dataToShow.length > 0 ? (
          <ul className="space-y-3">
            {dataToShow.map((participant, index) => (
              <li key={participant.id || index} className="bg-muted p-4 rounded-lg shadow-sm flex justify-between items-center">
                <Link
                  href={`/user/${participant.id}`}
                  className="font-semibold text-card-foreground hover:underline">
                  {participant.name || 'Anonymous User'}
                </Link>
                {isEventCompleted && (
                  <span className="font-bold text-lg text-primary">
                    {typeof participant.points === 'number' ? `${participant.points} pts` : '-'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            {isEventCompleted ? "No participants data available." : "No participants yet. Be the first to register!"}
          </p>
        )}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:pt-24 min-h-screen">
      <div className="bg-card shadow-xl rounded-lg overflow-hidden">
        <div className={`md:flex ${isEventCompleted ? 'flex-col' : 'flex-row md:gap-8'}`}>
          {isEventCompleted ? (
            <>              <div className={`relative w-full ${imageContainerClass} rounded-lg shadow-md overflow-hidden`}>
                <Image
                  src={supabaseClient.storage.from('event-images').getPublicUrl(event.imgUrl ?? '').data.publicUrl }
                  alt={`${event.name} Poster`}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 w-full">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{event.name}</h1>
                <div className="mb-6 space-y-2 text-muted-foreground">
                  <p><strong>Type:</strong> <span className="font-semibold text-card-foreground">{event.type}</span></p>
                  <p><strong>Date & Time:</strong> <span className="font-semibold text-card-foreground">{formatDate(event.startTime)}</span></p>
                  <p><strong>Location:</strong> <span className="font-semibold text-card-foreground">{event.location}</span></p>
                  {event.organizer_info && <p><strong>Organizer:</strong> <span className="font-semibold text-card-foreground" style={{ whiteSpace: 'pre-line' }}>{event.organizer_info}</span></p>}
                </div>
                <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8 text-card-foreground" style={{ whiteSpace: 'pre-line' }}>
                  {event.description || 'No description available.'}
                </div>
                {renderActionButton()}
              </div>
            </>
          ) : (
            <>
              <div className="px-6 py-6 md:py-8 md:w-2/3">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{event.name}</h1>
                <div className="mb-6 space-y-2 text-muted-foreground">
                  <p><strong>Type:</strong> <span className="font-semibold text-card-foreground">{event.type}</span></p>
                  <p><strong>Date & Time:</strong> <span className="font-semibold text-card-foreground">{formatDate(event.startTime)}</span></p>
                  <p><strong>Location:</strong> <span className="font-semibold text-card-foreground">{event.location}</span></p>
                  {event.organizer_info && <p><strong>Organizer:</strong> <span className="font-semibold text-card-foreground" style={{ whiteSpace: 'pre-line' }}>{event.organizer_info}</span></p>}
                </div>
                <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8 text-card-foreground" style={{ whiteSpace: 'pre-line' }}>
                  {event.description || 'No description available.'}
                </div>
                {renderActionButton()}
              </div>              <div className={`relative w-full md:w-1/3 ${imageContainerClass} md:order-last rounded-lg shadow-md overflow-hidden`}>
                <Image
                  src={supabaseClient.storage.from('event-images').getPublicUrl(event.imgUrl ?? '').data.publicUrl || '/placeholder-event.jpg'}
                  alt={`${event.name} Poster`}
                  width={400}
                  height={isEventCompleted ? 225 : 320}
                  className="w-full object-cover"
                />
              </div>
            </>
          )}
        </div>

        {renderParticipantsList()}
      </div>

      {/* Contact Modal */}
      <Dialog open={contactModal.isOpen} onOpenChange={(open) => setContactModal({ ...contactModal, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Contact Number</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-sm text-muted-foreground">
              To register for this event, please provide your contact number.
            </p>
            <Label htmlFor="contact-input">Contact Number</Label>
            <Input
              id="contact-input"
              type="tel"
              value={contactModal.contactNumber}
              onChange={(e) => setContactModal({ ...contactModal, contactNumber: e.target.value })}
              placeholder="Enter your contact number"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setContactModal({ ...contactModal, isOpen: false })}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleContactSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader /> : 'Save and Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registration Confirmation Modal */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button onClick={executeRegister} disabled={isSubmitting}>
              {isSubmitting ? <Loader /> : 'Confirm Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
