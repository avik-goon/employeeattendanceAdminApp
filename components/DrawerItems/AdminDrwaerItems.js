import React from "react";
import { StyleSheet } from "react-native";
import { DrawerItem } from "@react-navigation/drawer";
import { Box, Avatar, Text } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useColorModeValue } from "native-base";
const AdminDrawerItems = (props) => {

  return (
    <DrawerItem
      labelStyle={{ fontFamily: "Oswald_600SemiBold" }}
      icon={({ color, size, focused }) => (
        <Icon name={props.icon} color={useColorModeValue("#3e3d70", "#fff")} size={size} />
      )}
      label={({ focused, color }) => (
        <Text
          style={{ fontFamily: "Oswald_600SemiBold" }}
          _dark={{ bg: "blueGray.900" }}
          _light={{ bg: "blueGray.50" }}
        >
          {props.label}
        </Text>
      )}
      onPress={props.onSelect}
      activeBackgroundColor={"#cdcce1"}
    />
  );
};
export function ProfileAvatar(props) {

  return (
    <Box style={styles.userInfoSection}>
      <Box style={{ flexDirection: "row", alignItems: "center" }}>
        <Box>
          <Avatar
            size="lg"
            source={{
              uri: props.uri,
            }}
          >
            AK
          </Avatar>
        </Box>
        <Box >
          <Text style={({ ...styles.title }, { color: props.colorCode, fontSize: 22, marginLeft: 10, fontFamily: "Oswald_600SemiBold", paddingTop: 5 })}>
            {props.name}
          </Text>
          <Text
            style={
              ({ ...styles.caption },
                { fontSize: 15, marginLeft: 10, color: "#D7D8D7", fontFamily: "Oswald_200ExtraLight" })
            }
          >
            {props.username}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,

  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
});

export default AdminDrawerItems;
