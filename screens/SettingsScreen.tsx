import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { spacing, borderRadius, typography, shadows } from "../component/theme";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"

export default function SettingsScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, signOut, updateAvatar } = useAuth();
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(!!state.isConnected);
        });
        return () => unsubscribe();
    }, []);


    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: signOut },
        ]);
    };


    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission needed", "Please allow access to your photo library.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (result.canceled || !result.assets?.[0]) return;

        setUploading(true);
        try {
            const asset = result.assets[0];
            const filePath = `${user!.id}/avatar.jpg`;

            // FormData works reliably on Android instead of fetch+blob
            const formData = new FormData();
            formData.append("file", {
                uri: asset.uri,
                name: "avatar.jpg",
                type: "image/jpeg",
            } as any);

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, formData, { contentType: "image/jpeg", upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
            const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

            await supabase.auth.updateUser({ data: { avatar_url: publicUrl } }); // ← save with ?t=
            updateAvatar(publicUrl);
        } catch (err: any) {
            Alert.alert("Upload failed", err.message ?? "Something went wrong.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

            {/* User Profile */}
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>User Profile</Text>
                <View style={styles.profileRow}>

                    <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} style={styles.avatarWrapper}>
                        {uploading ? (
                            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                <ActivityIndicator color="#fff" />
                            </View>
                        ) : user?.avatarUrl ? (
                            <Image
                                key={user.avatarUrl}
                                source={{ uri: user.avatarUrl }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                <Text style={styles.avatarText}>
                                    {(user?.email?.[0] ?? "U").toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.editBadgeText}>✎</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                            {user?.email ?? "User"}
                        </Text>
                        <Text style={[styles.profileStatus, { color: isConnected ? "green" : "red" }]}>
                            {isConnected ? "🟢 Online" : "🔴 Offline"}
                        </Text>
                        <Text style={[styles.tapHint, { color: colors.textMuted }]}>
                            Tap photo to change
                        </Text>
                    </View>

                </View>
            </View>

            {/* Appearance */}
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Appearance</Text>
                <View style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View>
                        <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Dark Mode</Text>
                        <Text style={[styles.rowHint, { color: colors.textSecondary }]}>Toggle dark theme</Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.border, true: colors.primaryLight }}
                        thumbColor={isDark ? colors.primary : colors.textMuted}
                    />
                </View>
            </View>

            {/* About */}
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>About</Text>
                <View style={styles.row}>
                    <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Version</Text>
                    <Text style={[styles.rowValue, { color: colors.textSecondary }]}>1.0.0</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.signOutButton, { backgroundColor: colors.dangerLight, borderColor: colors.danger }]}
                onPress={handleSignOut}
                activeOpacity={0.8}
            >
                <Text style={[styles.signOutText, { color: colors.danger }]}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    section: {
        marginHorizontal: spacing.xl,
        marginTop: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        padding: spacing.lg,
        ...shadows.sm,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: spacing.lg,
    },
    profileRow: { flexDirection: "row", alignItems: "center" },
    avatarWrapper: { position: "relative", marginRight: spacing.lg },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    avatarText: { color: "#ffffff", fontSize: 24, fontWeight: "bold" },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    editBadgeText: { color: "#fff", fontSize: 11 },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
    profileStatus: { fontSize: 14, marginBottom: 2 },
    tapHint: { fontSize: 12, marginTop: 2 },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: "transparent",
    },
    rowLabel: { fontSize: 16 },
    rowHint: { fontSize: 13, marginTop: 2 },
    rowValue: { fontSize: 15 },
    signOutButton: {
        marginHorizontal: spacing.xl,
        marginTop: spacing.xxl,
        marginBottom: spacing.xxl,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        paddingVertical: spacing.md,
        alignItems: "center",
    },
    signOutText: { fontWeight: "bold", fontSize: 16 },
});