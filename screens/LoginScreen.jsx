import React, { useState } from "react";
import {
    Text,
    Spinner,
    HStack,
    Center,
    Heading,
    Switch,
    useColorMode,
    Box,
    VStack,
    Code,
    Factory,
    useColorModeValue,
    Pressable
} from "native-base";
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    Oswald_200ExtraLight,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
} from '@expo-google-fonts/oswald';
import {
    CourierPrime_400Regular,
    CourierPrime_400Regular_Italic,
    CourierPrime_700Bold,
    CourierPrime_700Bold_Italic,
} from '@expo-google-fonts/courier-prime';
import SvgComponent from "../components/SvgComponent";
import Login from "../components/Login";


export default LoginScreen = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false)
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false)
    const background_color = useColorModeValue("blueGray.50", "blueGray.900");
    let [fontsLoaded] = useFonts({
        Oswald_200ExtraLight,
        Oswald_300Light,
        Oswald_400Regular,
        Oswald_500Medium,
        Oswald_600SemiBold,
        Oswald_700Bold,
        CourierPrime_400Regular,
        CourierPrime_400Regular_Italic,
        CourierPrime_700Bold,
        CourierPrime_700Bold_Italic,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <Center
                bg={background_color}
                px={4}
                flex={1}
            >
                <VStack space={5} alignItems="center">
                    <Box h="200px" w="100%">
                        <BrandIcon />
                    </Box>
                    <BrandHeading />
                    <HStack space={1} mt="-2" alignItems="center">
                        <Text>Your</Text>
                        <Text>Partner For</Text>
                        <Code>GREENER TOMORROW</Code>
                    </HStack>
                    {
                        !isSpinnerVisible ?
                            <Pressable onPress={() => {
                                setShowModal(true)
                                //getLocationPermission();
                            }} >
                                {({ isPressed }) => {
                                    return (
                                        <Box
                                            p="5"
                                            rounded="8"
                                            style={{
                                                transform: [
                                                    {
                                                        scale: isPressed ? 0.96 : 1,
                                                    },
                                                ],
                                            }}
                                        >
                                            <Text pb="2.5" letterSpacing="2" color="primary.500" underline fontSize={"xl"} fontWeight={800} fontFamily={"heading"} _dark={{ color: "#fff" }} _light={{ color: "primary.500" }}>
                                                LOGIN
                                            </Text>
                                        </Box>
                                    )
                                }}
                            </Pressable>
                            :
                            <HStack space={2} alignItems="center">
                                <Spinner accessibilityLabel="Loading posts" _dark={{ color: "amber.500" }} _light={{ color: "primary.500" }} />
                                <Heading _dark={{ color: "amber.500" }} _light={{ color: "primary.500" }} fontSize="md">
                                    Please Wait
                                </Heading>
                            </HStack>
                    }
                    <Login showModal={showModal} setShowModal={setShowModal} navigation={navigation} setIsSpinnerVisible={setIsSpinnerVisible} />

                    <ToggleDarkMode />
                </VStack>
            </Center>
        );
    }
}


// Color Switch Component
function ToggleDarkMode() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <HStack space={2} alignItems="center">
            <Text>Dark</Text>
            <Switch
                isChecked={colorMode === "light" ? true : false}
                onToggle={toggleColorMode}
            />
            <Text>Light</Text>
        </HStack>
    );
}

function BrandIcon() {
    const BrandIcon = Factory(SvgComponent)
    let cl_val = useColorModeValue('light', 'dark')
    let icon_fill_color = useColorModeValue("#333", "#fff")

    return (
        <BrandIcon w="200px" h="200px" fillcolor={icon_fill_color} />
    )
}
function BrandHeading() {
    return (
        <Heading size="lg" py="2" borderBottomWidth="0.5" borderBottomColor={useColorModeValue("#333", "#fff")}>Welcome to Kohsa Analytics</Heading>
    )
}