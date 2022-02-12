import React, { useState, useEffect } from 'react';
import { Box, ScrollView, HStack as Row, VStack as Col, Input, Icon, Button, useColorModeValue, FormControl, useToast } from 'native-base';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, Dimensions, TouchableOpacity, Alert } from 'react-native';
import GooglePlacesInput from '../Maps/GooglePlacesInput';
import * as Location from 'expo-location';
import getPlaceDetailsByLatLng from '../Maps/GetPlaceFromPin';
import validate from '../config/validate';
import uploadLocationDetails from '../controller/LocationUpload';
import { GOOGLE_PLACES_APIKEY as apikey } from '../config/apikey'

const AddOfficeLocationScreen = () => {
    const [location, setLocation] = useState({ lat: 37.78825, lng: -122.4324 });
    const initialLocation = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }


    const [placeDetails, setPlaceDetails] = useState({
        "city": "",
        "latitude": 37.78825,
        "longitude": -122.4324,
        "locationDescription": "",
        "plot": "",
        "postal_code": "",
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    const [errorMsg, setErrorMsg] = useState("");

    const [errors, setErrors] = React.useState({});

    const toast = useToast();

    const onSubmit = () => {
        if (validate(placeDetails, errors, setErrors)) {
            setErrors({})
            setIsUploading(true)
            uploadLocationDetails(placeDetails, setIsUploading).then((r) => {
                if (r !== -1) {
                    setIsUploading(false);
                    var str = 'Loaction Uploaded Successfully, with id: ' + r;
                    toast.show({
                        render: () => {
                            return (<Box bg="dark.500" px="2" py="1" textAlign={'center'} w={'90%'} alignSelf={'center'} rounded="sm" mb={5}>
                                {str}
                            </Box>)
                        }
                    })
                    setPlaceDetails({
                        ...placeDetails,
                        "city": "",
                        "latitude": 37.78825,
                        "longitude": -122.4324,
                        "locationDescription": "",
                        "plot": "",
                        "postal_code": "",
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    })
                }
            })
        }
        else {
            toast.show({
                render: () => {
                    return (<Box bg="dark.500" px="2" py="1" rounded="sm" mb={5}>
                        Validation Failed!
                    </Box>)
                }
            })
        }
    };


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            Location.setGoogleApiKey(apikey);
            let location = await Location.getCurrentPositionAsync();
            setLocation({
                ...location,
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
            setPlaceDetails({
                ...placeDetails,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        })();
    }, []);
    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    const [isUploading, setIsUploading] = useState(false)

    return (
        <Box flex={1} _dark={{ bg: "blueGray.900" }} _light={{ bg: "blueGray.50" }}>
            <Box h={5} justifyContent={'center'}  >
                <Row>
                    <GooglePlacesInput style={{ width: "100%" }} placeDetails={placeDetails} setPlaceDetails={setPlaceDetails} />
                </Row>
            </Box>
            <Box>
                <ScrollView flexGrow={1}>
                    {/* MapView Start*/}
                    <Row h={Dimensions.get('window').height / 1.8} style={styles.container}>
                        <Col>
                            <MapView style={styles.map}
                                initialRegion={{
                                    latitude: initialLocation.latitude,
                                    longitude: initialLocation.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                provider='google'
                                region={{
                                    latitude: placeDetails.latitude,
                                    longitude: placeDetails.longitude,
                                    latitudeDelta: placeDetails.latitudeDelta,
                                    longitudeDelta: placeDetails.longitudeDelta
                                }}
                            >
                                <Marker draggable
                                    coordinate={{
                                        latitude: placeDetails.latitude,
                                        longitude: placeDetails.longitude,
                                    }}
                                    onDragEnd={(e) => {

                                        setPlaceDetails({
                                            ...placeDetails,
                                            latitude: e.nativeEvent.coordinate.latitude,
                                            longitude: e.nativeEvent.coordinate.longitude
                                        })
                                        getPlaceDetailsByLatLng(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, placeDetails, setPlaceDetails)
                                    }}
                                />
                            </MapView>
                            <TouchableOpacity style={{
                                position: "absolute",
                                bottom: 10,
                                right: 10,
                                zIndex: 9
                            }} onPress={(e) => {
                                getPlaceDetailsByLatLng(location.lat, location.lng, placeDetails, setPlaceDetails)
                            }}>
                                <Icon as={<MaterialIcons name="gps-fixed" />} borderColor={"muted.500"} size={8} ml="2" color="muted.500" style={{

                                    borderWidth: 1,
                                    borderRadius: 50,
                                    zIndex: 1

                                }} />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    {/* MapView End*/}
                    <Row>
                        <Box py={5}>
                            {(errorMsg !== "") ? <Text style={{ color: "red", fontSize: 10, paddingHorizontal: 13 }} >{errorMsg}</Text> : <></>}
                            <Row>
                                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                                    <FormControl w="90%" isRequired isInvalid={'plot' in errors}>
                                        <Input
                                            variant={"underlined"}
                                            w={{
                                                base: "100%",
                                                md: "25%",
                                            }}
                                            value={placeDetails.plot}
                                            onChangeText={(value) => {
                                                setPlaceDetails({ ...placeDetails, plot: value })
                                            }}
                                            InputLeftElement={
                                                <Icon
                                                    as={<FontAwesome name="building" />}
                                                    size={5}
                                                    ml="2"
                                                    color="muted.400"
                                                />
                                            }
                                            placeholder="Plot Name or Number"
                                        />
                                        {'plot' in errors ?
                                            <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}>{errors.plot}</FormControl.ErrorMessage>
                                            :

                                            <FormControl.HelperText _text={{ fontSize: 'xs' }}>
                                                Plot Name or Number is required.
                                            </FormControl.HelperText>
                                        }
                                    </FormControl>
                                </Col>
                            </Row>

                            <Row>
                                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                                    <FormControl w="90%" isRequired isInvalid={'locationDescription' in errors}>
                                        <Input
                                            variant={"underlined"}
                                            w={{
                                                base: "100%",
                                                md: "25%",
                                            }}
                                            value={placeDetails.locationDescription}
                                            onChangeText={(value) => {
                                                setPlaceDetails({ ...placeDetails, locationDescription: value })
                                            }}
                                            InputLeftElement={
                                                <Icon
                                                    as={<FontAwesome name="location-arrow" />}
                                                    size={5}
                                                    ml="2"
                                                    color="muted.400"
                                                />
                                            }
                                            placeholder="Location"
                                        />
                                        {'locationDescription' in errors ?
                                            <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}>{errors.locationDescription}</FormControl.ErrorMessage>
                                            :

                                            <FormControl.HelperText _text={{ fontSize: 'xs' }}>
                                                Location is required.
                                            </FormControl.HelperText>
                                        }
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row>
                                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                                    <FormControl w="90%" isRequired isInvalid={'city' in errors}>
                                        <Input
                                            variant={"underlined"}
                                            w={{
                                                base: "100%",
                                                md: "25%",
                                            }}
                                            value={placeDetails.city}
                                            onChangeText={(value) => {
                                                setPlaceDetails({ ...placeDetails, city: value })
                                            }}
                                            InputLeftElement={
                                                <Icon
                                                    as={<MaterialCommunityIcons name="city-variant" />}
                                                    size={5}
                                                    ml="2"
                                                    color="muted.400"
                                                />
                                            }
                                            placeholder="City"
                                        />
                                        {'city' in errors ?
                                            <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}>{errors.city}</FormControl.ErrorMessage>
                                            :

                                            <FormControl.HelperText _text={{ fontSize: 'xs' }}>
                                                City is required and should contain atleast 3 letters.
                                            </FormControl.HelperText>
                                        }
                                    </FormControl>
                                </Col>
                            </Row>
                            <Row>
                                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                                    <FormControl w="90%" isRequired isInvalid={'postal_code' in errors}>
                                        <Input
                                            variant={"underlined"}
                                            w={{
                                                base: "100%",
                                                md: "25%",
                                            }}
                                            value={placeDetails.postal_code}
                                            onChangeText={(value) => {
                                                setPlaceDetails({ ...placeDetails, postal_code: value })
                                            }}
                                            InputLeftElement={
                                                <Icon
                                                    as={<MaterialCommunityIcons name="pin" />}
                                                    size={5}
                                                    ml="2"
                                                    color="muted.400"
                                                />
                                            }
                                            placeholder="Pin Code"
                                        />
                                        {'postal_code' in errors ?
                                            <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}>{errors.postal_code}</FormControl.ErrorMessage>
                                            :

                                            <FormControl.HelperText _text={{ fontSize: 'xs' }}>
                                                PostalCode is required and should contain atleast 6 digits.
                                            </FormControl.HelperText>
                                        }
                                    </FormControl>

                                </Col>
                            </Row>
                        </Box>

                    </Row>

                    <Box mb={2} pb={5}>
                        {
                            (!isUploading) ? <Button onPress={() => onSubmit()} size={"lg"} w={"90%"} alignSelf={"center"} colorScheme={useColorModeValue("primary", "amber")} >ADD LOCATION</Button> :
                                <Button isLoading
                                    size={"lg"} w={"90%"} alignSelf={"center"}
                                    _loading={{
                                        bg: "muted.700",
                                        _text: {
                                            color: "muted.50",
                                        },
                                    }}
                                    _spinner={{
                                        color: "white",
                                    }}
                                    isLoadingText="Please Wait"
                                >
                                    Please Wait
                                </Button>
                        }
                    </Box>
                </ScrollView>
            </Box>

        </Box>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 1.8,
    },
});



export default AddOfficeLocationScreen;