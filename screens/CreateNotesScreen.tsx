import { useState } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNotes } from "../context/NotesContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { spacing, borderRadius, shadows, typography } from "../component/theme";

export default function CreateNotesScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);   // local preview URI
  const [imagePath, setImagePath] = useState<string | null>(null); // path saved to DB
  const [uploading, setUploading] = useState(false);
  const { addNote } = useNotes();
  const { colors } = useTheme();
  const { user } = useAuth();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setImageUri(asset.uri); // show preview immediately
    setUploading(true);

    try {
      const path = `${user!.id}/${Date.now()}.jpg`; // unique path per note image

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      const { error } = await supabase.storage
        .from("note-images")
        .upload(path, formData, { contentType: "image/jpeg", upsert: false });

      if (error) throw error;

      setImagePath(path); // save path for DB
    } catch (err: any) {
      Alert.alert("Upload failed", err.message);
      setImageUri(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (imagePath) {
      await supabase.storage.from("note-images").remove([imagePath]);
    }
    setImageUri(null);
    setImagePath(null);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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

        {/* Image section */}
        {imageUri ? (
          <View style={styles.imagePreviewWrapper}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator color="#fff" size="large" />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.removeImageBtn, { backgroundColor: colors.danger }]}
              onPress={handleRemoveImage}
            >
              <Text style={styles.removeImageText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.addImageBtn, { borderColor: colors.border, backgroundColor: colors.inputBackground }]}
            onPress={handlePickImage}
            activeOpacity={0.7}
          >
            <Text style={[styles.addImageIcon, { color: colors.textMuted }]}>🖼️</Text>
            <Text style={[styles.addImageText, { color: colors.textMuted }]}>Add Image</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (uploading) {
              Alert.alert("Please wait", "Image is still uploading.");
              return;
            }

            addNote({ id: Date.now().toString(), title, content, image_path: imagePath });
            navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Save Note</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 40 },
  heading: { ...typography.title, textAlign: "center", marginBottom: spacing.xxl },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 15,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  contentInput: { minHeight: 160, textAlignVertical: "top" },
  addImageBtn: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: 6,
  },
  addImageIcon: { fontSize: 28 },
  addImageText: { fontSize: 14 },
  imagePreviewWrapper: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: borderRadius.md,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  uploadingText: { color: "#fff", fontSize: 14 },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  removeImageText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  saveButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    ...shadows.md,
  },
  saveText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
});