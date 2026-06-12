import { createContext, useContext, useState, useCallback } from "react";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (email: string, _password: string): Promise<string | null> => {
    // TODO: Replace with Supabase auth sign-in
    setUser({ id: Date.now().toString(), email });
    return null;
  }, []);

  const signUp = useCallback(async (email: string, _password: string): Promise<string | null> => {
    // TODO: Replace with Supabase auth sign-up
    setUser({ id: Date.now().toString(), email });
    return null;
  }, []);

  const signOut = useCallback(() => {
    // TODO: Replace with Supabase auth sign-out
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
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
