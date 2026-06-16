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
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: spacing.md,
        lineHeight: 32,
        textAlign:'center',
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
        letterSpacing: 0.2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFound: {
        ...typography.body,
        fontSize: 16,
    },
});
