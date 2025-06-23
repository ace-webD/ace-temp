"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, SupabaseClient } from '@supabase/supabase-js';
import { Loader } from '@/components/ui/loader';

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
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let isMounted = true;   
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
          if (isMounted) {
          if (error) {
            // This is expected for anonymous users or expired sessions
            console.warn("AuthContext: No authenticated user found:", error.message);
          }
          setUser(user ?? null);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("AuthContext: Failed to get initial user:", error);
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

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
      setLoading(false); 
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
