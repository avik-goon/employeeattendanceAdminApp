import React, { } from 'react';
import { Heading, HStack, Icon, useColorModeValue, VStack } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { deleteLocation } from '../controller/GetLocationDetails';
const LocationList = ({ location, refresh }) => {
    const office_building_color = useColorModeValue("primary.900", "#fff");
    const trash_can_color = useColorModeValue("red.600", "#fff");
    const onDelete = async (locID) => {
        const status = await deleteLocation(locID);
        if (status !== -1)
            refresh();
    }
    return (
        <HStack w={'100%'} justifyContent={'space-between'} my={5}  >
            <VStack w={"15%"} justifyContent={'center'} alignItems={'center'} borderRightWidth={1 / 2} borderRightColor={'muted.500'} >
                <Icon
                    as={<MaterialCommunityIcons name="office-building" />}
                    size={'lg'}
                    ml="2"
                    color={office_building_color}
                />
            </VStack>
            <VStack w={"70%"} pl={2} space={2} >
                <HStack alignItems={'center'} space={2}>
                    <Icon
                        as={<Ionicons name="podium" />}
                        size={4}
                        color={office_building_color}
                    />
                    <Heading size={'sm'} fontSize='sm' >{location.plot}</Heading>
                </HStack>
                <Heading flexWrap={'wrap'} size={'sm'} fontSize='sm' >{location.locationDescription}</Heading>
            </VStack>
            <VStack w={"15%"} justifyContent={'center'} alignItems={'center'}>
                <TouchableOpacity onPress={() => onDelete(location.id)} >
                    <Icon
                        as={<MaterialCommunityIcons name="trash-can" />}
                        size={'sm'}
                        ml="2"
                        color={trash_can_color}
                    />
                </TouchableOpacity>
            </VStack>
        </HStack>
    );
}
export default LocationList;