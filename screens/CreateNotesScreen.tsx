import { useState } from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { useNotes } from "../context/NotesContext";
import { useTheme } from "../context/ThemeContext";
import { spacing, borderRadius, shadows, typography } from "../component/theme";

export default function CreateNotesScreen({navigation}:any){

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {addNote} = useNotes();
    const { colors } = useTheme();

    return(
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={[styles.heading, { color: colors.textPrimary }]}>New Note</Text>
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
                        addNote({
                            id: Date.now().toString(),
                            title,
                            content,
                        });
                        navigation.goBack();
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveText}>Save Note</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    )
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
});