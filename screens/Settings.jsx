import React, { useState, useEffect } from 'react';
import { Box, TextArea, ScrollView, FormControl, Input, WarningOutlineIcon, HStack as Row, VStack as Col, Icon, Heading, Button, useColorModeValue, Text, Pressable, Container } from 'native-base';
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { useSelector } from 'react-redux';
import { TouchableOpacity, Image, Platform, Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from 'react-redux';
import { createAdminData } from '../store/reducers/CreateAdminData';
import { auth } from '../config/db.config';
import { validateEmail } from '../config/validate';
import updateAdminProfileImage from '../controller/updateAdminProfileImage';
const Settings = ({ navigation }) => {
    const r_adminData = useSelector((state) => state.admin.adminData[0])
    const [isUploading, setIsUploading] = useState(false);
    const handleClick = () => setShow(!show)
    const [show, setShow] = React.useState(false)
    const [password, setPassword] = useState({});
    const [errors, setErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const user = auth.currentUser;
    const dispatch = useDispatch()
    const [isUploading2, setIsUploading2] = useState(false);
    const [isImageSelected, setIsImageSelected] = useState(false);

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
            var data = [{ ...r_adminData, imageURL: result.uri, fileName: filename }];
            dispatch(createAdminData(data))
            setIsImageSelected(true)
        }
    };

    function validate() {
        if (r_adminData.name === "" || r_adminData.name.length < 3) {
            setErrors({ ...errors, name: "Name is either empty or less than 3 charectars! " })
            return false;
        }
        if (r_adminData.email === "") {
            setErrors({ ...errors, email: "Email is either empty or Invalid! " })
            return false;
        } else if (!validateEmail(r_adminData.email)) {
            setErrors({ ...errors, email: "Email is either empty or Invalid! " })
            return false;
        }
        return true;
    }


    const passwordValidate = () => {
        if (password.old_password === undefined || password.old_password.length < 6) {
            setPasswordErrors({ ...passwordErrors, old_password: "Password is either empty or less than 6 charectars! " })
            return false;
        }
        if (password.new_password === undefined || password.new_password.length < 6) {
            setPasswordErrors({ ...passwordErrors, new_password: "Password is either empty or less than 6 charectars! " })
            return false;
        }
        return true;
    }
    const onSubmitPassword = () => {
        if (passwordValidate()) {
            setPasswordErrors({})
            //proceed
            setIsUploading2(true)
            auth.signInWithEmailAndPassword(r_adminData.email, password.old_password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    var obj = { ...passwordErrors };
                    try {
                        delete obj.old_password;
                    } catch (error) {
                        Alert.alert(error);
                    }
                    setPasswordErrors({ ...obj })
                    user.updatePassword(password.new_password).then(() => {
                        Alert.alert("Password Changed!")
                        setPassword({})
                        setIsUploading2(false);
                    }).catch((error) => {
                        setIsUploading2(false);
                        setErrors({ ...errors, new_password: error.message })
                        setTimeout(() => {
                            setErrors({})
                        }, 7000);
                    });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setPasswordErrors({ ...passwordErrors, old_password: "Password Mismatch!" })
                    Alert.alert("Old Password is Wrong, Please Try Again!")
                    setIsUploading2(false);
                });
        }
    }

    const onSubmit = () => {
        let imgurl;
        if (r_adminData.imageURL === "") {
            imgurl = 'https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-add-user-icon-png-image_313043.jpg';

        } else imgurl = r_adminData.imageURL;

        if (validate()) {
            setErrors({})
            if (isImageSelected) {
                updateAdminProfileImage(r_adminData, user, setIsUploading, Alert, navigation);
                setIsImageSelected(false)
            } else {
                setIsUploading(true);
                user.updateEmail(r_adminData.email).then(() => {
                    user.updateProfile({
                        displayName: r_adminData.name,
                    }).then((r) => {
                        Alert.alert("User Updation Successfull!")
                        setIsUploading(false);
                        dispatch(createAdminData([{
                            name: auth.currentUser?.displayName,
                            imageURL: imgurl,
                            email: auth.currentUser?.email
                        }]))
                        setIsImageSelected(false)
                    }).catch((error) => {
                        setIsImageSelected(false)
                        Alert.alert(error.message)
                        setIsUploading(false);
                    });
                }).catch((error) => {
                    if (error.code === "auth/requires-recent-login") {
                        Alert.alert(
                            "SignOut Now?",
                            `${error.message}`,
                            [
                                {
                                    text: "No",
                                    style: "cancel"
                                },
                                {
                                    text: "Sign Out",
                                    onPress: () => {
                                        auth.signOut().then(() => {
                                            navigation.replace("LoginScreen");
                                        }).catch((error) => {
                                            Alert.alert(error.message)
                                            setIsUploading(false);
                                        });
                                    }
                                }
                            ]
                        )
                    }
                    setIsUploading(false);
                    setIsImageSelected(false)
                });
            }
        }

    }


    return (
        <ScrollView _dark={{ bg: "blueGray.900" }} _light={{ bg: "blueGray.50" }} flexGrow={1}>
            <Box flex={1} _dark={{ bg: "blueGray.900" }} _light={{ bg: "blueGray.50" }}>
                <Box borderWidth={1 / 2} borderColor={'gray.100'} mx={5} pt={5} pb={10} borderRadius={25} my={10}>
                    <Row pb={5} alignItems="center" justifyContent={"center"}>
                        <Col space={2} >

                            <Box borderWidth="2" borderColor={"primary.500"} >
                                <TouchableOpacity onPress={pickImage}>
                                    {<Image source={{ uri: r_adminData.imageURL || 'https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-add-user-icon-png-image_313043.jpg' }} style={{ width: 150, height: 150 }} alt='image' />}
                                </TouchableOpacity>
                            </Box>

                        </Col>
                    </Row>
                    <Row w={'90%'} alignSelf={'center'}>
                        <Col w={'100%'}>
                            <FormControl isInvalid={'name' in errors}>
                                <FormControl.Label>Enter Full Name</FormControl.Label>
                                <Input
                                    w={{
                                        base: "100%",
                                        md: "25%",
                                    }}
                                    autoCapitalize='words'
                                    value={r_adminData.name}
                                    onChangeText={(val) => dispatch(createAdminData([{ ...r_adminData, name: val }]))}
                                    onEndEditing={() => dispatch(createAdminData([{ ...r_adminData, name: r_adminData.name.trim() }]))}
                                    InputLeftElement={
                                        <Icon
                                            as={<AntDesign name="idcard" />}
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                    placeholder="John Doe"
                                />
                                {
                                    'name' in errors ?
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.name}
                                        </FormControl.ErrorMessage> : <></>
                                }
                            </FormControl>
                        </Col>
                    </Row>
                    <Row w={'90%'} alignSelf={'center'} my={3}>
                        <Col w={'100%'}>
                            <FormControl isInvalid={'email' in errors}>
                                <FormControl.Label>Change Email</FormControl.Label>
                                <Input
                                    w={{
                                        base: "100%",
                                        md: "25%",
                                    }}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    value={r_adminData.email}
                                    onChangeText={(val) => dispatch(createAdminData([{ ...r_adminData, email: val }]))}
                                    onEndEditing={() => dispatch(createAdminData([{ ...r_adminData, email: r_adminData.email.trim() }]))}
                                    InputLeftElement={
                                        <Icon
                                            as={<MaterialCommunityIcons name="email" />}
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                    placeholder="Enter New Email"
                                />
                                {
                                    'email' in errors ?
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {errors.email}
                                        </FormControl.ErrorMessage> : <></>
                                }
                            </FormControl>
                        </Col>
                    </Row>
                    <Box p={3}></Box>
                    <Row alignItems="center" mt="4" justifyContent={"center"}>
                        <Col w="full" alignSelf={"center"}>
                            <Container alignSelf={"center"}>
                                {!isUploading ?
                                    <Button onPress={() => onSubmit()} colorScheme={useColorModeValue("primary", "amber")} size={"lg"} > Update My Details </Button>
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
                </Box>
                <Box borderWidth={1 / 2} borderColor={'gray.100'} mx={5} pt={5} pb={10} borderRadius={25} my={10}>
                    <Heading size={'sm'} p={2} ml={2}>Change Password</Heading>
                    <Row w={'90%'} alignSelf={'center'} my={2}>
                        <Col w={'100%'}>
                            <FormControl isInvalid={'old_password' in passwordErrors}>
                                <FormControl.Label>Enter Old Password</FormControl.Label>
                                <Input
                                    w={{
                                        base: "100%",
                                        md: "25%",
                                    }}
                                    type={show ? "text" : "password"}
                                    value={password.old_password}
                                    onChangeText={(val) => { setPassword({ ...password, old_password: val }) }}

                                    InputRightElement={
                                        <Pressable _pressed={{ opacity: 0.3 }} onPress={handleClick}>
                                            <Icon
                                                as={<MaterialIcons name="visibility-off" />}
                                                size={5}
                                                mr="2"
                                                color="muted.400"
                                            />
                                        </Pressable>
                                    }
                                    placeholder="Old Password"
                                />
                                {
                                    'old_password' in passwordErrors ?
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {passwordErrors.old_password}
                                        </FormControl.ErrorMessage> : <></>
                                }
                            </FormControl>
                        </Col>
                    </Row>

                    <Row w={'90%'} alignSelf={'center'} my={3}>
                        <Col w={'100%'}>
                            <FormControl isInvalid={'new_password' in passwordErrors}>
                                <FormControl.Label>Enter New Password</FormControl.Label>
                                <Input
                                    w={{
                                        base: "100%",
                                        md: "25%",
                                    }}
                                    type={show ? "text" : "password"}
                                    value={password.new_password}
                                    onChangeText={(val) => { setPassword({ ...password, new_password: val }) }}

                                    InputRightElement={
                                        <Pressable _pressed={{ opacity: 0.3 }} onPress={handleClick}>
                                            <Icon
                                                as={<MaterialIcons name="visibility-off" />}
                                                size={5}
                                                mr="2"
                                                color="muted.400"
                                            />
                                        </Pressable>
                                    }
                                    placeholder="New Password"
                                />
                                {
                                    'new_password' in passwordErrors ?
                                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                            {passwordErrors.new_password}
                                        </FormControl.ErrorMessage> : <></>
                                }
                            </FormControl>
                        </Col>
                    </Row>
                    <Row alignItems="center" mt="4" justifyContent={"center"}>
                        <Col w="full" alignSelf={"center"}>
                            <Container alignSelf={"center"}>
                                {!isUploading2 ?
                                    <Button onPress={() => onSubmitPassword()} colorScheme={useColorModeValue("primary", "amber")} size={"lg"} > Update Password </Button>
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
                </Box>
            </Box>
        </ScrollView>
    );
}
export default Settings;

