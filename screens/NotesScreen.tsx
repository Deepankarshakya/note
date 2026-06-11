import { View, Text, Button, FlatList } from "react-native";
import { useNotes } from "../context/NotesContext";

export default function NotesScreen({ navigation }: any) {
    const { notes, deleteNote } = useNotes();
    return (
        <View>
            <Text>Notes Screen</Text>
            <Text>{notes.length}</Text>
            <FlatList
                data={notes}
                renderItem={({ item }) => (


                    <View style={{
                        margin: 10,
                        padding: 15,
                        borderWidth: 1,
                        borderRadius: 10,
                    }}>
                        <Text>{item.title}</Text>
                        <Text>{item.content}</Text>

                        <Button
                            title="Delete"
                            onPress={() => deleteNote(item.id)}
                        />

                                    <Button 
                title="Edit Notes"
                onPress={() => 
                    navigation.navigate("EditNote", {
                        noteId: item.id,
                    })
                }
            />
                    </View>
                )}
                keyExtractor={(item) => item.id}

            />
            <Button
                title="Create Note"
                onPress={() => navigation.navigate("CreateNote")}
            />

        </View>
    )
}