import {View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { useNotes } from "../context/NotesContext";
import {useState} from "react"
import { useTheme } from "../context/ThemeContext";
import { spacing, borderRadius, shadows, typography } from "../component/theme";

export default function EditNoteScreen({
    route,
    navigation,
}:any) {
    const {noteId} = route.params;
    const { notes, updateNote } = useNotes();
    const { colors } = useTheme();
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
        return (
            <View style={[styles.notFound, { backgroundColor: colors.background }]}>
                <Text style={[styles.notFoundText, { color: colors.textMuted }]}>Note not found</Text>
            </View>
        );
    }   

    return (
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={[styles.heading, { color: colors.textPrimary }]}>Edit Note</Text>
                <TextInput
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textPrimary }]}
                    placeholderTextColor={colors.textMuted}
                />
                <TextInput
                    placeholder="Content"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    style={[styles.input, styles.contentInput, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textPrimary }]}
                    placeholderTextColor={colors.textMuted}
                    textAlignVertical="top"
                />
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                        updateNote(noteId, title, content);
                        navigation.navigate("Notes");
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.xl,
        paddingBottom: 40,
    },
    heading: {
        ...typography.title,
        textAlign: "center",
        marginBottom: spacing.xxl,
    },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 15,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    contentInput: {
        minHeight: 160,
        textAlignVertical: 'top',
    },
    saveButton: {
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        ...shadows.md,
    },
    saveText: {
        color: '#ffffff',
        fontWeight: "bold",
        fontSize: 16,
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFoundText: {
        ...typography.body,
    },
});