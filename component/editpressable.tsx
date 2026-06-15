import {Pressable, PressableProps, StyleSheet, Text} from "react-native";
import {useTheme} from "../context/ThemeContext";
import {spacing, borderRadius, shadows} from "./theme";

export function EditorPressable(props: PressableProps & {text: string}){
    const {colors} = useTheme();
    return(
        <Pressable {...props} style={({pressed}) => [
            styles.button,
            {backgroundColor: colors.primaryLight, borderColor: colors.primary},
            pressed && {backgroundColor: colors.primaryLight, opacity: 0.7}
        ]}>
            <Text style={[styles.text, {color: colors.primary}]}>{props.text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        marginLeft: spacing.sm,
        ...shadows.sm,
    },
    text: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14,
    },
})