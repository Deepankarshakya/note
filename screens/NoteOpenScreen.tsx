import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import { useNotes } from "../context/NotesContext";
import { spacing, borderRadius, typography, shadows } from "../component/theme";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

export default function NoteOpenScreen({ route }: any) {
    const { noteId } = route.params;
    const { notes, getSignedUrl } = useNotes();
    const note = notes.find((n) => n.id === noteId);
    const { colors } = useTheme();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (note?.image_path) {
            getSignedUrl(note.image_path).then((url) => {
                if (url) setImageUrl(url);
            });
        }
    }, [note?.image_path]);

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

            {/* Image — only shows if note has one */}
            {imageUrl && (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.body, { color: colors.textPrimary }]}>{note.content}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
        textAlign: "center",
    },
    image: {
        width: "100%",
        height: 220,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
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
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    notFound: { ...typography.body, fontSize: 16 },
});