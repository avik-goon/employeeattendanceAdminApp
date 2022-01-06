import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AntIcon from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import { MaterialIcons } from "@expo/vector-icons";
import { HStack, VStack, Text, Box } from "native-base";
import AdminDrawerContent from "./MainDrawerContent";
import Dashboard from "../../screens/Dashboard";
const Drawer = createDrawerNavigator();
import { useColorModeValue, MoonIcon, SunIcon, Pressable, useColorMode } from "native-base";
import AddEmployeeScreen from "../../screens/AddEmployeeScreen";
import AddOfficeLocationScreen from "../../screens/AddOfficeLocationScreen";
import EmployeeProfileScreen from "../../screens/EmployeeProfilesScreen";
import LeaveRequest from "../../screens/LeaveRequest";
import Settings from "../../screens/Settings";
import { useSelector } from "react-redux";

export default function DrawerRoutes() {
    const { colorMode, toggleColorMode } = useColorMode();
    const leaveCounter = useSelector((state) => state.leaveRecordCounter.leaveCounter)

    function GetIcon() {
        if (useColorModeValue("light", "dark") === "dark") {
            return (<SunIcon size="5" mt="0.5" color="primary.50" />)
        } else return (<MoonIcon size="5" mt="0.5" color="primary.50" />)
    }

    return (
        <Drawer.Navigator drawerContent={(props) => <AdminDrawerContent {...props} />}
            screenOptions={{
                headerTitleStyle: {
                    fontFamily: "Oswald_600SemiBold",
                    color: "#fff"
                },
                headerStyle: {
                    backgroundColor: useColorModeValue("#3e3d70", "#0f172a")
                },
                headerTintColor: '#fff',
                drawerActiveBackgroundColor: "#cdcce1",
                headerBackgroundContainerStyle: {
                    borderBottomColor: "#94a3b8",
                    borderBottomWidth: 0.5
                },
                drawerStyle: {
                    backgroundColor: useColorModeValue("#fff", "#0f172a"),
                    width: 240,
                },
                headerRight: () => (
                    <Pressable mr="1" px="1" onPress={() => toggleColorMode()} >
                        <GetIcon />
                    </Pressable>
                )
            }}
        >
            <Drawer.Screen name="DashBoard" component={Dashboard}

                options={{
                    title: "DashBoard",
                    drawerIcon: ({ focused, size }) => {
                        if (colorMode === "light")
                            return <Icon name="home-outline" size={size} color={focused ? "#3e3d70" : "#433d70"} />
                        else return <Icon name="home-outline" size={size} color={focused ? "#3e3d70" : "#fff"} />
                    },
                    drawerLabel: ({ focused }) => {
                        if (colorMode === 'light') {
                            return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#433d70"}  >
                                DashBoard
                            </Text>)
                        } else {
                            return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#fff"}  >
                                DashBoard
                            </Text>)
                        }

                    },
                    unmountOnBlur: true
                }} />
            <Drawer.Screen name="AddEmployee" component={AddEmployeeScreen} options={{
                title: "Add Employee",
                drawerIcon: ({ focused, size }) => {
                    if (colorMode === "light")
                        return <AntIcon name="user-plus" size={size} color={focused ? "#3e3d70" : "#433d70"} />
                    else return <AntIcon name="user-plus" size={size} color={focused ? "#3e3d70" : "#fff"} />
                },
                drawerLabel: ({ focused }) => {
                    if (colorMode === 'light') {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#433d70"}  >
                            Add Employee
                        </Text>)
                    } else {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#fff"}  >
                            Add Employee
                        </Text>)
                    }

                },

            }} />

            <Drawer.Screen name="AddOfficeLocationScreen" component={AddOfficeLocationScreen} options={{
                title: "Add Loaction",
                drawerIcon: ({ focused, size }) => {
                    if (colorMode === "light")
                        return <AntIcon name="map" size={size} color={focused ? "#3e3d70" : "#433d70"} />
                    else return <AntIcon name="map" size={size} color={focused ? "#3e3d70" : "#fff"} />
                },
                drawerLabel: ({ focused }) => {
                    if (colorMode === 'light') {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#433d70"}  >
                            Add Loaction
                        </Text>)
                    } else {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#fff"}  >
                            Add Loaction
                        </Text>)
                    }

                },

            }} />

            <Drawer.Screen name="EmployeeProfileScreen" component={EmployeeProfileScreen} options={{
                title: "Employee",
                drawerIcon: ({ focused, size }) => {
                    if (colorMode === "light")
                        return <MaterialIcons name="people-outline" size={size} color={focused ? "#3e3d70" : "#433d70"} />
                    else return <MaterialIcons name="people-outline" size={size} color={focused ? "#3e3d70" : "#fff"} />
                },
                drawerLabel: ({ focused }) => {
                    if (colorMode === 'light') {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#433d70"}  >
                            Employee
                        </Text>)
                    } else {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#fff"}  >
                            Employee
                        </Text>)
                    }

                },

            }} />
            <Drawer.Screen name="LeaveRequest" component={LeaveRequest} options={{
                title: "Leave Request",
                drawerIcon: ({ focused, size }) => {
                    if (colorMode === "light")
                        return <Icon name="door-closed-lock" size={size} color={focused ? "#3e3d70" : "#433d70"} />
                    else return <Icon name="door-closed-lock" size={size} color={focused ? "#3e3d70" : "#fff"} />
                },
                drawerLabel: ({ focused }) => {
                    if (colorMode === 'light') {
                        var clr = focused ? "#3e3d70" : "#433d70";
                        return (
                            <Box>
                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                    <VStack>
                                        <Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#433d70"}  >
                                            Leave Request
                                        </Text>
                                    </VStack>
                                    <VStack w={5} h={5} borderWidth={1 / 2} borderRadius={10} alignItems={'center'} borderColor={clr}>
                                        <Text mt={-1 / 2} pb={1} ml={-1 / 9} textAlign={'center'} color={focused ? "#3e3d70" : "#433d70"} >{leaveCounter !== null ? leaveCounter : 0}</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        )
                    } else {
                        clr = focused ? "#3e3d70" : "#fff";
                        return (
                            <Box>
                                <HStack justifyContent={'space-between'} alignItems={'center'}>
                                    <VStack>
                                        <Text style={{ fontFamily: "Oswald_600SemiBold" }} color={clr} >
                                            Leave Request
                                        </Text>
                                    </VStack>
                                    <VStack w={5} h={5} borderWidth={1 / 2} borderRadius={10} alignItems={'center'} borderColor={clr}>
                                        <Text mt={-1 / 2} pb={1} ml={-1 / 9} textAlign={'center'} color={clr} >{leaveCounter !== null ? leaveCounter : 0}</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        )
                    }

                },

            }} />
            {/* <Drawer.Screen name="LocationDetails" component={LocationDetails} options={{
                title: "Location Details",
                drawerIcon: ({ focused, size }) => {
                    if (colorMode === "light")
                        return <AntIcon name="map-pin" size={size} color={focused ? "#3e3d70" : "#433d70"} />
                    else return <AntIcon name="map-pin" size={size} color={focused ? "#3e3d70" : "#fff"} />
                },
                drawerLabel: ({ focused }) => {
                    if (colorMode === 'light') {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#433d70"}  >
                            Location Details
                        </Text>)
                    } else {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#fff"}  >
                            Location Details
                        </Text>)
                    }

                },

            }} /> */}
            <Drawer.Screen name="Settings" component={Settings} options={{
                title: "Settings",
                drawerIcon: ({ focused, size }) => {
                    if (colorMode === "light")
                        return <AntIcon name="settings" size={size} color={focused ? "#3e3d70" : "#433d70"} />
                    else return <AntIcon name="settings" size={size} color={focused ? "#3e3d70" : "#fff"} />
                },
                drawerLabel: ({ focused }) => {
                    if (colorMode === 'light') {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#433d70"}  >
                            Settings
                        </Text>)
                    } else {
                        return (<Text style={{ fontFamily: "Oswald_600SemiBold" }} color={focused ? "#3e3d70" : "#fff"}  >
                            Settings
                        </Text>)
                    }

                },

            }} />

        </Drawer.Navigator >
    );
}