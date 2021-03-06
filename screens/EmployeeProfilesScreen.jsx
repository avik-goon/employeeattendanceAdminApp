
import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import setEmpInactive from '../controller/DeleteEmploye';
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
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import getAllEmployee from '../controller/GetallEmployee';
import RelaxSVG from '../components/RelaxSvg';
import { useToast } from 'native-base';
export default function EmployeeProfileScreen({ navigation }) {

    return (
        <Box
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}
            flex="1">
            <Heading p="4" size="lg">
                Employee
            </Heading>
            <Basic navigation={navigation} />
        </Box>
    );
}

function Basic({ navigation }) {
    const [listData, setListData] = useState([]);
    useEffect(() => {
        let isMounted = true;
        if (isMounted)
            getAllEmployee(setListData);
        return () => {
            isMounted = false;
        }
    }, []);


    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };



    const onRowDidOpen = (rowKey) => {
        console.log('This row opened', rowKey);
    };

    const renderItem = ({ item, index }) => {

        return (
            <Box >
                <Pressable onPress={() => navigation.navigate("EmployeeDetailsView", { id: item.id })} _dark={{ bg: "blueGray.900" }}
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
        )
    };
    const toast = useToast();

    const deleteRow = (rowMap, rowKey, id) => {
        setEmpInactive(id).then(r => {
            if (r === 1) {
                closeRow(rowMap, rowKey);
                const newData = [...listData];
                const prevIndex = listData.findIndex(item => item.key === rowKey);
                newData.splice(prevIndex, 1);
                setListData(newData);
            } else {
                toast.show({
                    description: "Deletion Failed!"
                })
            }
        })
    }


    const renderHiddenItem = (data, rowMap) => {
        return (
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
                <Pressable w="70" bg="red.500" justifyContent="center" onPress={() => deleteRow(rowMap, data.item.key, data.item.id)} _pressed={{
                    opacity: 0.5
                }}>
                    <VStack alignItems="center" space={2}>
                        <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
                        <Text color="white" fontSize="xs" fontWeight="medium">
                            Delete
                        </Text>
                    </VStack>
                </Pressable>
            </HStack>
        )
    }
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