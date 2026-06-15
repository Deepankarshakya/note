import { useState } from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { spacing, borderRadius, shadows, typography } from "../component/theme";

export default function SignInScreen({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const { colors } = useTheme();

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setLoading(true);
        const error = await signIn(email.trim(), password);
        setLoading(false);
        if (error) {
            Alert.alert("Sign In Failed", error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.flex, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.top}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to your account</Text>
                </View>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textPrimary }]}
                    placeholderTextColor={colors.textMuted}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.textPrimary }]}
                    placeholderTextColor={colors.textMuted}
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleSignIn}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.linkContainer}>
                    <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                        Don't have an account? <Text style={[styles.linkHighlight, { color: colors.primary }]}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        padding: spacing.xl,
        paddingTop: 60,
        paddingBottom: 40,
    },
    top: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    button: {
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginTop: spacing.md,
        ...shadows.md,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: "bold",
        fontSize: 17,
    },
    linkContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    linkText: {
        fontSize: 15,
    },
    linkHighlight: {
        fontWeight: "bold",
    },
});
