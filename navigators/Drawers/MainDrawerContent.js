import React, { useState } from "react";
import { StyleSheet, BackHandler } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { NativeBaseProvider, Box, Text, VStack, Divider, Center } from "native-base";
import DrawerItems, { ProfileAvatar } from "../../components/DrawerItems/AdminDrwaerItems";
import { useColorModeValue } from "native-base";
import { auth } from "../../config/db.config";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { createUser } from "../../store/reducers/CreateUserDetails";
import { useSelector } from "react-redux";
import { createAdminData } from "../../store/reducers/CreateAdminData";

const AdminDrawerContent = (props) => {

  const dispatch = useDispatch();
  const userData = useSelector(state => state.loggedInUser.user);
  const adminData = useSelector((state) => state.admin.adminData[0])

  let username = auth.currentUser?.email;
  const authUserOBJ = auth.currentUser;
  const displayName = authUserOBJ?.displayName;

  const photoURL = authUserOBJ?.photoURL;

  if (username !== undefined) {
    username = username.split("@")[0]
  } else if (userData.length < 1) {
    auth.signOut().then(() => {
      props.navigation.replace("LoginScreen");
    })
  } else username = userData[0].email.split("@")[0];

  return (
    <Box style={{ flex: 1 }} safeArea>
      <DrawerContentScrollView {...props}>

        <Box style={styles.drawerContent}>
          <ProfileAvatar
            uri={photoURL}
            name={displayName || 'Admin'}
            username={"@" + username}
            colorCode={useColorModeValue("#000", "#fff")}
          />
          <Center m={1} p={1}>
            <Divider my={2} w={'100%'} />
          </Center>
          <VStack>
            <Box style={styles.drawerSection}>
              <DrawerItemList {...props} />

            </Box>
          </VStack>
        </Box>
      </DrawerContentScrollView>
      <VStack divider={<Divider />} space={4}>
        <Box>
          <DrawerItems
            label={"Sign Out"}
            icon={"exit-to-app"}
            onSelect={() => {
              Alert.alert(
                "Are you sure?",
                "You'll be logged out!",
                [
                  {
                    text: "No",
                    style: "cancel"
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      auth.signOut().then(() => {
                        const data = [{
                          email: "",
                          uid: ""
                        }]
                        dispatch(createUser(data));
                        dispatch(createAdminData([{
                          "email": "",
                          "fileName": "",
                          "imageURL": "",
                          "name": "",
                        }]))
                        Alert.alert(
                          "Success",
                          "Successfully Logged Out!",
                          [
                            {
                              text: "Okay",
                              onPress: () => {
                                props.navigation.replace("LoginScreen");
                              }
                            }
                          ]
                        )

                      }).catch((err) => {
                        Alert.alert(err.message)
                      })
                    }
                  }
                ]
              )
            }}

          />
        </Box>
      </VStack>
    </Box>

  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  drawerSection: {
    marginTop: -10
  }
});

export default AdminDrawerContent;
