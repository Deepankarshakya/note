import {View, Text, StyleSheet, ScrollView, Image} from "react-native";
import { useNotes } from "../context/NotesContext";
import { spacing, borderRadius, typography, shadows } from "../component/theme";
import { useTheme } from "../context/ThemeContext";

export default function NoteOpenScreen({ route }: any) {
    const { noteId } = route.params;
    const { notes } = useNotes();
    const note = notes.find((n) => n.id === noteId);
    const { colors } = useTheme();

    if (!note) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={[styles.notFound, { color: colors.textMuted }]}>Note not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{note.title}</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.body, { color: colors.textPrimary }]}>{note.content}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.xl,
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: spacing.xl,
        lineHeight: 34,
    },
    card: {
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        borderWidth: 1,
        ...shadows.md,
    },
    body: {
        ...typography.body,
        lineHeight: 26,
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFound: {
        ...typography.body,
    },
});
