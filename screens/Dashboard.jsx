import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
    Box,
    Text,
    Pressable,
    Heading,
    Icon,
    HStack,
    Avatar,
    VStack,
    Spacer,
    Factory,
    useColorModeValue
} from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Entypo } from '@expo/vector-icons';
import getEmployeeAttendanceDetails from '../controller/GetEmployeeAttendanceDetails';
import RelaxSVG from '../components/RelaxSvg';
import getLeaveRecord from '../controller/getLeaveRecord';
export default function Dashboard({ navigation }) {
    const [mode, setMode] = useState('Basic');
    const [leaveRecords, setLeaveRecords] = useState([]);
    useEffect(() => {
        const r = getLeaveRecord(setLeaveRecords);
        return r;
    }, []);

    return (
        <Box
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}
            flex="1">
            <Heading p="4" size="lg">
                Today's Login Records
            </Heading>
            <Basic navigation={navigation} />
        </Box>
    );
}

function Basic({ navigation }) {
    const [listData, setListData] = useState([]);
    useEffect(() => {
        getEmployeeAttendanceDetails(listData, setListData);
    }, []);


    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };



    const onRowDidOpen = (rowKey) => {
        //console.log('This row opened', rowKey);
    };

    const renderItem = ({ item, index }) => (
        <Box >
            <Pressable _dark={{ bg: "blueGray.900" }}
                _light={{ bg: "blueGray.50" }}>
                <Box
                    pl="4"
                    pr="5"
                    py="3"
                >
                    <HStack alignItems="center" space={3}>
                        <Avatar size="48px" source={{ uri: item.avatarUrl }} />
                        <VStack>
                            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold>
                                {item.fullName}
                            </Text>
                            <Text color="coolGray.600" _dark={{ color: 'warmGray.200' }}>{item.recentText}</Text>
                        </VStack>
                        <Spacer />
                        <Text fontSize="xs" color="coolGray.800" _dark={{ color: 'warmGray.50' }} alignSelf="flex-start">
                            {item.timeStamp}
                        </Text>
                    </HStack>
                </Box>
            </Pressable>
        </Box>
    );

    const renderHiddenItem = (data, rowMap) => (
        <HStack flex="1" pl="2">
            <Pressable
                w="70"
                ml="auto"
                bg="coolGray.200"
                justifyContent="center"
                onPress={() => {
                    closeRow(rowMap, data.item.key)
                    navigation.navigate("EmployeeRecord", { id: data.item.id, EMP_State_Data: listData })
                }}
                _pressed={{
                    opacity: 0.5,
                }}>
                <VStack alignItems="center" space={2}>
                    <Icon
                        as={<Entypo name="text-document" />}
                        size="xs"
                        color="coolGray.800"
                    />
                    <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                        Records
                    </Text>
                </VStack>
            </Pressable>
        </HStack>
    );

    if (listData.length > 0) {
        return (
            <Box _dark={{ bg: "blueGray.900" }}
                _light={{ bg: "blueGray.50" }} flex="1">
                <SwipeListView
                    data={listData}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-130}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onRowDidOpen={onRowDidOpen}
                    keyExtractor={(item, index) => index.toString()}
                />
            </Box>
        );
    } else {
        return (
            <VStack flex={1} flexDir={'row'} justifyContent={'center'} alignItems={'center'}  >
                <Box h="200px" w="200" alignSelf={'center'} flexDirection={'row'} justifyContent={'center'} alignSelf={'center'} alignItems={'center'} marginLeft={-12} mt={-10} >
                    <BrandIcon />
                </Box>
            </VStack>
        )
    }
}
function BrandIcon() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    //console.log(windowWidth);
    const BrandIcon = Factory(RelaxSVG)
    let icon_fill_color = useColorModeValue("#333", "#fff")

    return (
        <BrandIcon style={{
            alignSelf: "center",
            height: "100%",
            width: windowWidth,
        }} fillcolor={icon_fill_color} />
    )
}