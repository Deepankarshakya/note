import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNotes } from "../context/NotesContext";
import { useState, useLayoutEffect } from "react";
import { EditorPressable } from "../component/editpressable";
import { DeletePressable } from "../component/DeletePressable";
import { useTheme } from "../context/ThemeContext";
import { spacing, borderRadius, shadows, typography } from "../component/theme";
import Feather from '@expo/vector-icons/Feather';

export default function NotesScreen({ navigation }: any) {
    const { notes, deleteNote } = useNotes();
    const { colors, isDark } = useTheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={{ paddingHorizontal: 8 }}>
                    <Feather name="settings" size={20} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, colors.textPrimary]);
    const [search, setSearch] = useState("");
    const filteredNotes = notes.filter((note) =>
        note.title
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
    );
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.count, { color: colors.textSecondary }]}>Number of notes: {notes.length}
            </Text>
            <TextInput
                placeholder="Search notes..."
                value={search}
                onChangeText={setSearch}
                style={[styles.search, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textPrimary }]}
                placeholderTextColor={colors.textMuted}
            />
            <FlatList
                data={filteredNotes}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.file, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("NoteOpen", { noteId: item.id })}
                    >
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={[styles.noteTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                                <Text style={[styles.noteContent, { color: colors.textSecondary }]} numberOfLines={2}>{item.content}</Text>
                            </View>
                            <View style={styles.actions}>
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
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={[styles.empty, { color: colors.textMuted }]}>No notes found. Create one!</Text>
                }
            />
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate("CreateNote")}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl,
    },
    count: {
        ...typography.caption,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    search: {
        borderWidth: 1,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 15,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 80,
    },
    file: {
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        ...shadows.md,
    },
    noteTitle: {
        ...typography.subtitle,
        marginBottom: spacing.xs,
    },
    noteContent: {
        ...typography.body,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
        flex: 1,
        marginRight: spacing.md,
    },
    actions: {
        flexDirection: 'row',
    },
    empty: {
        ...typography.body,
        textAlign: 'center',
        marginTop: 60,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
    },
    fabText: {
        fontSize: 32,
        color: '#ffffff',
        lineHeight: 30,
    },
});