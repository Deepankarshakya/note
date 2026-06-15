import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Note = {
  id: string;
  title: string;
  content: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateNote: (
    id:string,
    title:string,
    content:string,
  )=> void;
};

const NotesContext =
  createContext<NotesContextType | null>(null);

export function NotesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const deleteNote = (id: string) => {
        setNotes((prev) => 
        prev.filter((notes) => notes.id !== id))
    }
  const [notes, setNotes] = useState<Note[]>([]);


  const loadNotes = async() => {
    try{
      const storedNotes = 
      await AsyncStorage.getItem("notes");
      
      if(storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    }
    catch (error){
      console.log(error);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

useEffect(() => {
  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem(
        "notes",
        JSON.stringify(notes)
      );
    } catch (error) {
      console.log(error);
    }
  };

  saveNotes();
}, [notes]);




  const addNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
  };

  const updateNote = (
    id:string,
    title: string,
    content: string
  )  => {
  setNotes((prev) =>
    prev.map((note) =>
      note.id === id
        ? { ...note, title, content }
        : note
    )
  );
};

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        deleteNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error(
      "useNotes must be inside NotesProvider"
    );
  }

  return context;
};