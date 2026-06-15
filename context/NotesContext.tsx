import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

type Note = {
  id: string;
  title: string;
  content: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useAuth();

  // Load notes from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setNotes([]); // clear notes on logout
      return;
    }

    const loadNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, content")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error loading notes:", error.message);
      } else {
        setNotes(data ?? []);
      }
    };

    loadNotes();
  }, [user]); // re-runs when user changes (login/logout)

  const addNote = async (note: Note) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notes")
      .insert({ title: note.title, content: note.content, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.log("Error adding note:", error.message);
    } else {
      setNotes((prev) => [data, ...prev]);
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.log("Error deleting note:", error.message);
    } else {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    const { error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", id);

    if (error) {
      console.log("Error updating note:", error.message);
    } else {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, title, content } : note))
      );
    }
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be inside NotesProvider");
  return context;
};