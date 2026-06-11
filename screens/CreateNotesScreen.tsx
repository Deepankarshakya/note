import { useState } from "react";
import {View, Text, Button, TextInput} from "react-native";
import { useNotes } from "../context/NotesContext";

export default function CreateNotesScreen({navigation}:any){

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {addNote} = useNotes();

    return(
    <View>
        <Text>Create Notes Screen</Text>
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
            title="Save Note"
            onPress={() => {
                addNote({
                    id: Date.now().toString(),
                    title,
                    content,
                });
                navigation.goBack();
            }}
        />
    </View>
    )
}