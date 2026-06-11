import {View, Text, TextInput, Button} from "react-native";
import { useNotes } from "../context/NotesContext";
import {useState} from "react"

export default function EditNoteScreen({
    route,
    navigation,
}:any) {
    const {noteId} = route.params;
    const { notes, updateNote } = useNotes();
    const note = notes.find(
        (note) => note.id === noteId
    );
    const [title, setTitle] = useState(
  note?.title ?? ""
);

const [content, setContent] = useState(
  note?.content ?? ""
);
if (!note) {
  return <Text>Note not found</Text>;
}

   return (
  <View style={{ padding: 20 }}>
    
    <TextInput
      placeholder="Title"
      value={title}
      onChangeText={setTitle}
    />

    <TextInput
      placeholder="Content"
      value={content}
      onChangeText={setContent}
      multiline
    />

    <Button
      title="Save Changes"
      onPress={() => {
        updateNote(
          noteId,
          title,
          content
        );

        navigation.navigate("Notes");
      }}
    />
  </View>
);
}