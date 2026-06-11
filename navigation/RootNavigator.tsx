import {NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";


import NotesScreen from "../screens/NotesScreen";
import EditNoteScreen from "../screens/EditNoteScreen";
import CreateNotesScreen from "../screens/CreateNotesScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Notes"
                    component={NotesScreen}
                />

                <Stack.Screen
                    name="CreateNote"
                    component={CreateNotesScreen}
                />

                <Stack.Screen
                name="EditNote"
                component={EditNoteScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}