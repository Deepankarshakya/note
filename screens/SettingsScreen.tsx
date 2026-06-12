import {View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { spacing, borderRadius, typography, shadows } from "../component/theme";

export default function SettingsScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Out", style: "destructive", onPress: signOut },
        ]);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>User Profile</Text>
                <View style={styles.profileRow}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>{(user?.email?.[0] ?? "U").toUpperCase()}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user?.email ?? "User"}</Text>
                        <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>Active</Text>
                    </View>
                </View>
            </View>

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
    container: {
        flex: 1,
    },
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
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: spacing.lg,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
    },
    rowLabel: {
        fontSize: 16,
    },
    rowHint: {
        fontSize: 13,
        marginTop: 2,
    },
    rowValue: {
        fontSize: 15,
    },
    signOutButton: {
        marginHorizontal: spacing.xl,
        marginTop: spacing.xxl,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    signOutText: {
        fontWeight: "bold",
        fontSize: 16,
    },
});
