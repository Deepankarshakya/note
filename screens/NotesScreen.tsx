import { View, Text, Pressable, FlatList, TextInput, ScrollView, StyleSheet, Button } from "react-native";
import { useNotes } from "../context/NotesContext";
import { useState } from "react";
import { EditorPressable } from "../component/editpressable";
import { DeletePressable } from "../component/DeletePressable"

export default function NotesScreen({ navigation }: any) {
    const { notes, deleteNote } = useNotes();
    const [search, setSearch] = useState("");
    const filteredNotes = notes.filter((note) =>
        note.title
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
    );
    return (
        <View style={styles.container}>
            <Text style={styles.Numbernotes}>Number of notes : {notes.length}</Text>
            <TextInput
                placeholder="Search notes..."
                value={search}
                onChangeText={setSearch}
                style={styles.search}
            />
            <ScrollView style={styles.inside}>

                <FlatList
                    data={filteredNotes}
                    renderItem={({ item }) => (
                        <View style={styles.file}>
                            <View style={{flexDirection:'row'}}>
                                <View style=
                                {{flexDirection: 'column'}}>
                                    <Text>{item.title}</Text>
                                    <Text>{item.content}</Text>
                                </View>
                                <View style=
                                {{flexDirection:'row-reverse'}}>
                                    <DeletePressable
                                        text="Delete"
                                        onPress={() => deleteNote(item.id)}
                                    />
                                    <EditorPressable
                                        text="Edit"
                                        onPress={() =>
                                            navigation.navigate("EditNote", {
                                                noteId: item.id,
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}

                />
            </ScrollView>

            <Button
                title="Create Note"
                onPress={() => navigation.navigate("CreateNote")}
            />
        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    search: {
        borderWidth: 1,
    },
    Numbernotes: {
        textAlign: 'center',
        padding: 10,
    },
    file: {
        borderWidth: 1,
        margin: 10
    },
    inside: {
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
    },
});