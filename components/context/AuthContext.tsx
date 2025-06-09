"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, SupabaseClient } from '@supabase/supabase-js';

interface AuthContextType {
  supabase: SupabaseClient;
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null; // Add initialUser prop
}

export const AuthProvider = ({ children, initialUser = null }: AuthProviderProps) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(initialUser);
  // Since initialUser is always provided by RootLayout (either User or null),
  // the initial auth state is known. So, loading should start as false.
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    // No need to call getSession() here if initialUser is always provided
    // by RootLayout, as that establishes the initial auth state.

    // Listen for auth state changes.
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        // Ensure loading is false after any auth state change.
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Dependency array updated. initialUser is for initial state.

  const login = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("AuthContext: Login error:", error.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("AuthContext: Logout error:", error.message);
      setLoading(false); // Ensure loading is set to false on error
    }
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ supabase, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
