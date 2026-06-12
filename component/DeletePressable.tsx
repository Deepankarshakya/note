import {Pressable, PressableProps, StyleSheet, Text} from "react-native";

export function DeletePressable(props: PressableProps & {text:string}){
    return(
        <Pressable
        {...props} style={styles.button}
        >
            <Text style={styles.text}>
                {props.text}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        padding:10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: '#d0d0d0',
        borderWidth: 1,
        shadowColor: '#f56565',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
        margin: 3,
        marginTop:10,

    },
    text: {
        color: '#eb2525',
        fontWeight: "bold",
    }
})