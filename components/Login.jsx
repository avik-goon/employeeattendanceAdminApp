import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    FormControl,
    Input,
    useColorModeValue,
    Box,
    Heading,
    Icon,
    Stack,
    Pressable,
    WarningOutlineIcon
} from "native-base"
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createUser } from '../store/reducers/CreateUserDetails';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { auth } from '../config/db.config';
import registerAdminFirstTime, { isAdminAvailable } from '../controller/registerAdminForFirstTime';
const UserIcon = () => {
    return (
        <Box flexDir="row" justifyContent="center" alignItems="center" W="90%" >
            <FontAwesome name="user-circle-o" size={32} color={useColorModeValue("#333", "#fff")} />
            <Box px="1"></Box>
            <Heading fontSize={"2xl"}>LOGIN</Heading>
        </Box>
    )
}
const Login = ({ showModal, setShowModal, navigation, setIsSpinnerVisible }) => {
    const dispatch = useDispatch();
    const [show, setShow] = React.useState(false)
    const [emailError, setEmailError] = useState({});
    const handleClick = () => setShow(!show)
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const validate = (val) => {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(val) === false) {
            setEmailError({ ...emailError, email: "Email is not valid" })
            setUser({ ...user, email: val })
            return false;
        }
        else {
            setUser({ ...user, email: val })
            setEmailError({})
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const data = [{
                    email: user.email,
                    uid: user.uid
                }]

                dispatch(createUser(data));
                isAdminAvailable().then(r => {
                    if (r === -1) {
                        registerAdminFirstTime();
                    }
                    navigation.replace('DrawerRoutes', { screen: 'DashBoard' })
                })
            }
        })
        return () => {
            unsubscribe();
        }
    }, []);

    const signIn = (dispatch, setShowModal, setIsSpinnerVisible) => {
        var email = user.email;
        var password = user.password;
        setShowModal(false)
        setIsSpinnerVisible(true)
        if ('email' in emailError) {
            Alert.alert("Invalid Email!");
        } else {
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    setIsSpinnerVisible(false)
                    const data = [{
                        email: user.email,
                        uid: user.uid
                    }]
                    dispatch(createUser(data));
                    isAdminAvailable().then(r => {
                        if (r === -1) {
                            registerAdminFirstTime();
                        }
                    })
                })
                .catch((error) => {
                    setIsSpinnerVisible(false)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    Alert.alert(errorMessage)
                });
        }
    }


    return (
        <>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg"  >
                <Modal.Content _dark={{ backgroundColor: "blueGray.800" }} _light={{ backgroundColor: "blueGray.100" }}   >
                    <Modal.CloseButton />
                    <Modal.Header>
                        <Heading >
                            <UserIcon />
                        </Heading>
                    </Modal.Header>
                    <Modal.Body py="5">
                        <FormControl isInvalid={'email' in emailError}>
                            <FormControl.Label>E-Mail</FormControl.Label>
                            <Stack w="100%">
                                <Input
                                    w={{
                                        base: "100%",
                                        md: "25%",
                                    }}
                                    value={user.email}
                                    onChangeText={(val) => validate(val)}
                                    onBlur={() => setUser({ ...user, email: user.email.toLowerCase().trim() })}
                                    keyboardType='email-address'
                                    InputLeftElement={
                                        <Icon
                                            as={<MaterialIcons name="person" />}
                                            size={5}
                                            ml="2"
                                            color="muted.400"
                                        />
                                    }
                                    placeholder="Enter E-Mail Address"
                                />
                            </Stack>
                            {
                                'email' in emailError ?
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        {emailError.email}
                                    </FormControl.ErrorMessage> : <></>
                            }
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Password</FormControl.Label>
                            <Stack w="100%">
                                <Input
                                    w={{
                                        base: "100%",
                                        md: "25%",
                                    }}
                                    value={user.password}
                                    onChangeText={(val) => setUser({ ...user, password: val })}
                                    type={show ? "text" : "password"}
                                    overflow="visible"
                                    InputRightElement={
                                        <Pressable onPress={handleClick}>
                                            {
                                                !show ? <Icon
                                                    as={<MaterialIcons name="visibility-off" />}
                                                    size={5}
                                                    mr="2"
                                                    color="muted.400"
                                                /> : <Icon
                                                    as={<MaterialIcons name="visibility" />}
                                                    size={5}
                                                    mr="2"
                                                    color="muted.400"
                                                />
                                            }
                                        </Pressable>
                                    }
                                    placeholder="Enter Password"
                                />
                            </Stack>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer _dark={{ backgroundColor: "blueGray.800" }} _light={{ backgroundColor: "blueGray.100" }} >
                        <Button.Group space={2}>
                            <Button
                                size="lg"
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    setShowModal(false)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="lg"
                                colorScheme={"blueGray"}
                                onPress={() => {
                                    // setShowModal(false)
                                    // validateUser(user, setLoggedInUser).then(r => {
                                    //     if (r !== -1) {
                                    //         navigation.navigate('DrawerRoutes', { screen: 'DashBoard' })
                                    //     } else Alert.alert("Wrong username or password")
                                    // }) // 
                                    signIn(dispatch, setShowModal, setIsSpinnerVisible);
                                }}
                            >
                                Login
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}
export default Login;





