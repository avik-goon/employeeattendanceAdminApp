import React, { useState, useEffect } from 'react';
import { Box, Text, ScrollView, VStack as Col, HStack as Row, Icon, Input, FormControl, Select, CheckIcon, WarningOutlineIcon, Container, Button, useColorModeValue, useToast, } from 'native-base';
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity, Image, Platform } from 'react-native';
import getLocationData from '../controller/GetLocationDetails';
import { employeeValidation } from '../config/validate';
import uploadEmployeeDetails from '../controller/EmployeeDetailsUpload';
import isUnique from '../controller/EmployeeIDUniqueChecker';
const AddEmployeeScreen = () => {

    const emptyEmpObject = {
        name: "",
        image_url: 'https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-add-user-icon-png-image_313043.jpg',
        email: "",
        emp_id: "",
        locationID: "",
    }
    const [employee, setEmployee] = useState(emptyEmpObject)
    const [locationData, setLocationData] = useState([]);
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState({})
    const toast = useToast();
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
        getLocationData().then(data => {
            setLocationData(data)
        })
    }, [])
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
    function removeKey(setState, state, key) {
        let tempState = { ...state };
        delete tempState[key]
        setState({ ...tempState })
    }
    function onSubmit() {
        if (employeeValidation(employee, error, setError)) {

            isUnique(employee.emp_id).then(status => {
                if (status) {
                    //success
                    setError({})
                    setIsUploading(true)
                    uploadEmployeeDetails(employee, setIsUploading).then().then(id => {
                        if (id !== undefined || id !== 'undefined' || id !== "") {
                            setIsUploading(false)

                            setEmployee(emptyEmpObject)
                            var str = 'Employee Details Uploadeded Successfully';
                            toast.show({
                                render: () => {
                                    return (<Box bg="dark.500" px="2" py="1" textAlign={'center'} w={'90%'} alignSelf={'center'} rounded="sm" mb={5}>
                                        {str}
                                    </Box>)
                                }
                            })
                        } else if (id === -1) {
                            toast.show({
                                render: () => {
                                    return (<Box bg="dark.500" px="2" py="1" textAlign={'center'} w={'90%'} alignSelf={'center'} rounded="sm" mb={5}>
                                        <Text>Employee Details Uploading Failed!</Text>
                                    </Box>)
                                }
                            })
                        }
                    })
                } else {
                    setError({
                        ...error,
                        emp_id: 'EmployeeId is already in use, by an employee!',
                    });
                }
            })
        }
        else { console.log("Failed!") }

    }
    return (
        <ScrollView flexGrow={1} _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }} >
            <Row py={3} alignItems="center" mt="4" justifyContent={"center"}>
                <Col space={2} >

                    <Box borderWidth="2" borderColor={"primary.500"} >
                        <TouchableOpacity onPress={pickImage}>
                            {<Image source={{ uri: employee.image_url }} style={{ width: 150, height: 150 }} alt='image' />}
                        </TouchableOpacity>
                    </Box>

                </Col>
            </Row>
            <Row >

                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
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
                </Col>
            </Row>
            <Row >

                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
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
                </Col>
            </Row>
            <Row >
                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
                    <FormControl w={"75%"} isInvalid={'password' in error}>
                        <Input
                            w={{
                                base: "100%",
                                md: "25%",
                            }}
                            value={employee.password}
                            keyboardType='default'
                            onChangeText={(val) => setEmployee({ ...employee, password: val.trim() })}
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
                </Col>
            </Row>
            <Row >
                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
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

                </Col>
            </Row>
            <Row >

                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
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
                                isUnique(employee.emp_id).then(status => {
                                    !status ? setError({
                                        ...error,
                                        emp_id: 'EmployeeId is already in use, by an employee!',
                                    }) : removeKey(setError, error, 'emp_id')
                                })
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
                </Col>
            </Row>
            <Row >

                <Col w={'full'} alignItems="center" mt="4" justifyContent={"center"}>
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

                </Col>
            </Row>
            <Row alignItems="center" mt="4" justifyContent={"center"}>
                <Col w="96%" alignSelf={"center"}>
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
                                selectedValue={employee.locationID}
                                onValueChange={(val) => setEmployee({ ...employee, locationID: val })}
                            >
                                <Select.Item label={"Choose Location"} value={""} />
                                {
                                    locationData.map((item, i) => {

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
                </Col>
            </Row>
            <Row alignItems="center" mt="4" justifyContent={"center"}>
                <Col w="full" alignSelf={"center"}>
                    <Container alignSelf={"center"}>
                        {!isUploading ?
                            <Button onPress={() => onSubmit()} colorScheme={useColorModeValue("primary", "amber")} size={"lg"} > ADD EMPLOYEE </Button>
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
                </Col>
            </Row>
        </ScrollView>
    );
}
export default AddEmployeeScreen;

