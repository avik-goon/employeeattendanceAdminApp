import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, ScrollView, useColorModeValue, Input, HStack, VStack, Icon, FormControl, Select, Container, Button, useToast, CheckIcon, WarningOutlineIcon } from 'native-base';
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import getLocationData from '../controller/GetLocationDetails';
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { useDispatch } from 'react-redux';
import { employeeValidation } from '../config/validate';
import updateEmployeeProfile from '../controller/updateEmployeeProfile';
import isUnique from '../controller/EmployeeIDUniqueChecker';
const EmployeeDetailsView = ({ route, navigation }) => {
    const empID = route.params.id;
    let thisEmployee = useSelector((state) => state.employeeState.employee.filter((record) => record.empID === empID)[0]);
    const [locationDetails, setLocationDetails] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState({})
    const toast = useToast();
    const [employee, setEmployee] = useState(thisEmployee);
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);
    useEffect(() => {
        getLocationData().then((locationRecord) => {
            if (locationRecord !== undefined && locationRecord.length > 0) {
                setLocationDetails([...locationRecord])
            } else return (setLocationDetails([]))
        })
    }, []);

    const employeeCurrentLocation = locationDetails.filter((location) => location.id === thisEmployee.locationID)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            let localUri = result.uri;
            let filename = localUri.split('/').pop();
            setEmployee({ ...employee, image_url: result.uri, filename });
        }
    };
    const brdrCLR = useColorModeValue('#06b6d4', '#cffafe');

    function onSubmit() {
        if (employeeValidation(employee, error, setError)) {
            setError({})
            setIsUploading(true)
            updateEmployeeProfile(empID, employee).then(status => {
                if (status !== -1) {
                    var str = 'Employee Details Updated Successfully';
                    setIsUploading(false)
                    toast.show({
                        render: () => {
                            return (<Box bg="dark.500" px="2" py="1" textAlign={'center'} w={'90%'} alignSelf={'center'} rounded="sm" mb={5}>
                                {str}
                            </Box>)
                        }
                    })
                } else {
                    setIsUploading(false)
                    toast.show({
                        render: () => {
                            return (<Box bg="dark.500" px="2" py="1" textAlign={'center'} w={'90%'} alignSelf={'center'} rounded="sm" mb={5}>
                                <Text>Employee Details Uploading Failed!</Text>
                            </Box>)
                        }
                    })
                }
            })
        }


    }



    return (
        <Box
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}
            flex="1" safeArea>
            <Box borderBottomWidth={1 / 2} borderBottomColor={useColorModeValue("primary.500", "primary.50")}>
                <HStack w={'100%'} flexDir={'row'} justifyContent={'space-around'} alignSelf={'center'} >
                    <VStack justifyContent={'center'} alignItems={'center'} alignSelf={'center'} flexDir={'row'}>
                        {<Image source={{ uri: employee.image_url || thisEmployee.image_url }} style={{ width: 30, height: 30, borderWidth: 2, borderRadius: 75, borderColor: brdrCLR }} alt='image' />}
                    </VStack>
                    <VStack alignSelf={'flex-start'} alignItems={'flex-start'} alignContent={'flex-start'} >
                        <Heading p="4" size="sm" alignSelf={'flex-start'} textAlign={'left'}>
                            {thisEmployee.name}
                        </Heading>
                    </VStack>
                    <VStack justifyContent={'flex-end'} alignItems={'flex-end'} alignSelf={'center'} flexDir={'row'}  >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.dispatch(CommonActions.goBack())
                            }}
                        >
                            <Icon
                                as={Ionicons}
                                name="arrow-back-circle-outline"
                                color="coolGray.800"
                                size={'sm'}
                                _dark={{
                                    color: "warmGray.50",
                                }}
                            />
                        </TouchableOpacity>
                    </VStack>
                </HStack>
            </Box>

            <ScrollView flexGrow={1} _dark={{ bg: "blueGray.900" }}
                _light={{ bg: "blueGray.50" }} >
                <HStack py={3} alignItems="center" mt="4" justifyContent={"center"}>
                    <VStack space={2} >

                        <Box borderWidth="2" borderColor={"primary.500"} >
                            <TouchableOpacity onPress={pickImage}>
                                {<Image source={{ uri: employee.image_url || thisEmployee.image_url }} style={{ width: 150, height: 150 }} alt='image' />}
                            </TouchableOpacity>
                        </Box>

                    </VStack >
                </HStack>
                <HStack>

                    <VStack w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                        <FormControl w={"75%"} isInvalid={'name' in error}>
                            <Input
                                w={{
                                    base: "100%",
                                    md: "25%",
                                }}
                                value={employee.name}
                                onChangeText={(val) => setEmployee({ ...employee, name: val })}
                                onBlur={(e) => setEmployee({ ...employee, name: employee.name.trim() })}
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialIcons name="person" />}
                                        size={5}
                                        ml="2"
                                        color="muted.400"
                                    />
                                }
                                placeholder="Full Name"
                            />
                            {
                                'name' in error ?
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.name}
                                    </FormControl.ErrorMessage> : <></>
                            }
                        </FormControl>
                    </VStack >
                </HStack>
                <HStack>
                    <VStack w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                        <FormControl w={"75%"} isInvalid={'email' in error}>
                            <Input
                                w={{
                                    base: "100%",
                                    md: "25%",
                                }}
                                value={employee.email}
                                onChangeText={(val) => {
                                    setEmployee({ ...employee, email: (val.trim()) })
                                }}
                                onBlur={(e) => setEmployee({ ...employee, email: (employee.email.toLowerCase()) })}

                                keyboardType='email-address'
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialCommunityIcons name="email-plus-outline" />}
                                        size={5}
                                        ml="2"
                                        color="muted.400"
                                    />
                                }
                                placeholder="Email ID"
                            />
                            {
                                'email' in error ?
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.email}
                                    </FormControl.ErrorMessage> : <></>
                            }
                        </FormControl>
                    </VStack >
                </HStack>
                <HStack>
                    <VStack w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                        <FormControl w={"75%"} isInvalid={'password' in error}>
                            <Input
                                w={{
                                    base: "100%",
                                    md: "25%",
                                }}
                                value={employee.password}
                                onChangeText={(val) => setEmployee({ ...employee, password: val.trim() })}
                                keyboardType='default'
                                onChangeText={(val) => {
                                    setEmployee({ ...employee, password: (val.trim()) })
                                }}
                                InputLeftElement={
                                    <Icon
                                        as={<MaterialCommunityIcons name="lock" />}
                                        size={5}
                                        ml="2"
                                        color="muted.400"
                                    />
                                }
                                placeholder="Password"
                            />
                            {
                                'password' in error ?
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.password}
                                    </FormControl.ErrorMessage> : <></>
                            }
                        </FormControl>
                    </VStack >
                </HStack>
                <HStack>
                    <VStack w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                        <Input
                            w={{
                                base: "75%",
                                md: "25%",
                            }}
                            value={employee.phone}
                            keyboardType='phone-pad'
                            onChangeText={(val) => setEmployee({ ...employee, phone: val.trim() })}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialCommunityIcons name="phone" />}
                                    size={5}
                                    ml="2"
                                    color="muted.400"
                                />
                            }
                            placeholder="Mobile Number"
                        />

                    </VStack >
                </HStack>
                <HStack>

                    <VStack w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                        <FormControl w={"75%"} isInvalid={'emp_id' in error}>
                            <Input
                                w={{
                                    base: "100%",
                                    md: "25%",
                                }}
                                value={employee.emp_id}
                                onChangeText={(val) => setEmployee({ ...employee, emp_id: val })}
                                onBlur={(e) => {
                                    setEmployee({ ...employee, emp_id: (employee.emp_id.trim()).toUpperCase() })
                                }}
                                InputLeftElement={
                                    <Icon
                                        as={<AntDesign name="idcard" />}
                                        size={5}
                                        ml="2"
                                        color="muted.400"
                                    />
                                }
                                placeholder="Employee ID"
                            />
                            {
                                'emp_id' in error ?
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {error.emp_id}
                                    </FormControl.ErrorMessage> : <></>
                            }
                        </FormControl>
                    </VStack >
                </HStack>
                <HStack>

                    <VStack w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                        <Input
                            w={{
                                base: "75%",
                                md: "25%",
                            }}
                            value={employee.address}
                            onChangeText={(val) => setEmployee({ ...employee, address: val })}
                            InputLeftElement={
                                <Icon
                                    as={<MaterialIcons name="location-city" />}
                                    size={5}
                                    ml={"2"}
                                    color="muted.400"
                                />
                            }
                            placeholder="Address"
                        />

                    </VStack >
                </HStack>
                <HStack alignItems="center" mt="4" justifyContent={"center"}>
                    <VStack w="96%" alignSelf={"center"}>
                        <Container alignSelf={"center"}>
                            <FormControl isInvalid={'locationData' in error}>
                                <Select
                                    minW={"full"}
                                    accessibilityLabel="Choose Location"
                                    placeholder="Choose Location"
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <CheckIcon size={5} />,
                                    }}
                                    mt="1"
                                    selectedValue={employee.locationID || thisEmployee.locationID}
                                    onValueChange={(val) => setEmployee({ ...employee, locationID: val })}
                                >
                                    <Select.Item label={"Choose Location"} value={""} />
                                    {
                                        locationDetails.map((item, i) => {

                                            return (
                                                <Select.Item key={i.toString()} label={item.plot} value={item.id} />
                                            )
                                        })
                                    }
                                </Select>
                                {
                                    'locationData' in error ?
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            Please make a selection!
                                        </FormControl.ErrorMessage> : <></>
                                }
                            </FormControl>
                        </Container>
                    </VStack >
                </HStack>
                <HStack alignItems="center" mt="4" justifyContent={"center"}>
                    <VStack w="full" alignSelf={"center"}>
                        <Container alignSelf={"center"}>
                            {!isUploading ?
                                <Button onPress={() => onSubmit()} colorScheme={useColorModeValue("primary", "amber")} size={"lg"} > UPDATE EMPLOYEE DETAILS </Button>
                                :
                                <Button isLoading
                                    size={"lg"} alignSelf={"center"}
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
                        </Container>
                    </VStack >
                </HStack>
            </ScrollView>
        </Box>
    );
}
export default EmployeeDetailsView;