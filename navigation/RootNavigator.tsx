import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import NotesScreen from "../screens/NotesScreen";
import EditNoteScreen from "../screens/EditNoteScreen";
import CreateNotesScreen from "../screens/CreateNotesScreen";
import NoteOpenScreen from "../screens/NoteOpenScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Image, StyleSheet, Text, View } from "react-native"

const Stack = createNativeStackNavigator();

function AuthStack() {
    const { colors } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: { fontWeight: 'bold' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ title: "Sign Up" }}
            />
        </Stack.Navigator>
    );
}

function AppStack() {
    const { colors } = useTheme();
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: { fontWeight: 'bold' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="Notes"
                component={NotesScreen}
                options={{
                    headerTitle: () => (
                        <View style={{flexDirection:'row'}}>
                            <Image
                                source={require("../assets/icon.png")}
                                style={{
                                    width: 50,
                                    height: 50,
                                }}
                                resizeMode="contain"
                            />
                            <Text style={{paddingTop:13}}>My Notes</Text>
                        </View>
                    ),

                }}
            />
            <Stack.Screen
                name="CreateNote"
                component={CreateNotesScreen}
                options={{ title: "Create Note" }}
            />
            <Stack.Screen
                name="EditNote"
                component={EditNoteScreen}
                options={{ title: "Edit Note" }}
            />
            <Stack.Screen
                name="NoteOpen"
                component={NoteOpenScreen}
                options={{ title: "Note" }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "Settings" }}
            />
        </Stack.Navigator>
    );
}

export default function RootNavigator() {
    const { colors, isDark } = useTheme();
    const { isAuthenticated } = useAuth();

    return (
        <NavigationContainer>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}