import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {supabase} from "../lib/supabase"

type User = {
  id: string;
  email: string;
  avatarUrl: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
  updateAvatar: (url: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const buildUser = (supabaseUser: any) : User => ({
    id: supabaseUser.id,
    email: supabaseUser.email!,
    avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,   
  })

  useEffect(() => {
    supabase.auth.getSession().then(({data: { session }}) => {
      if (session?.user) setUser(buildUser(session.user));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
       setUser(buildUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null; // null means success
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? error.message : null;
  }, []);


  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Sign out error:", error.message);
  }, []);

  const updateAvatar = useCallback ((url: string) => {
    setUser ((prev) => prev ? {...prev, avatarUrl: url} : prev);
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
