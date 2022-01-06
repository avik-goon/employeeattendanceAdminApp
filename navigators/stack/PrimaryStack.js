import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerRoutes from "../Drawers/MainDrawer";
import LoginScreen from "../../screens/LoginScreen";
import EmployeeRecord from '../../screens/EmployeeRecord'
import EmployeeDetailsView from '../../screens/EmployeeDetailsView'
const Primarystack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />
                <Stack.Screen name="EmployeeRecord" component={EmployeeRecord} />
                <Stack.Screen name="EmployeeDetailsView" component={EmployeeDetailsView} />

            </Stack.Navigator>
        </NavigationContainer>
    );

}


export default Primarystack;


