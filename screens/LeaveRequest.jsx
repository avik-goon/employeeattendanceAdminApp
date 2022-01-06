import React, { useState, useEffect } from 'react';
import { Box, Text, ScrollView, Heading, HStack, VStack, useColorModeValue, Pressable, Factory } from 'native-base';
import { Image } from 'react-native';
import getLeaveRecord from '../controller/getLeaveRecord';
import AlertDialogBox from '../components/AlertDialogBox';
import RelaxSVG from '../components/RelaxSvg';
import { Dimensions } from 'react-native';
const LeaveRequest = ({ navigation }) => {
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [unSubScribe, setUnSubScribe] = useState(null);
    useEffect(() => {
        const r = getLeaveRecord(setLeaveRecords);

        return r;
    }, []);

    //  console.log(leaveRecords);
    const borderColorval = useColorModeValue('#06b6d4', '#cffafe');
    const brdlftclr = useColorModeValue('#06b6d4', '#cffafe');
    const [ID, setID] = useState("")
    if (leaveRecords.length > 0) {
        return (
            <ScrollView _dark={{ bg: "blueGray.900" }}
                _light={{ bg: "blueGray.50" }} flexGrow={1}>
                <Box py={3} mb={'2'} pl={2}>
                    <Heading size={'sm'}> Showing Record:  </Heading>
                </Box>
                {
                    leaveRecords.map((record, index) => {
                        return (
                            <Pressable key={record.leaveRecordID} _pressed={{ opacity: 0.5 }} onPress={() => {
                                setID(record.userID);
                                setIsOpen(true);
                            }} >
                                <Box p={2} pl={'3'}>
                                    <HStack pl={'3'}>
                                        <VStack pr={'2.5'}>
                                            <Box mt={5} >
                                                {<Image source={{ uri: record.avatar_URL }} style={{ width: 50, height: 50, borderWidth: 2, borderRadius: 75, borderColor: borderColorval }} alt='image' />}
                                            </Box>
                                        </VStack>
                                        <VStack space={2} pl={2} borderLeftWidth={1 / 2} borderLeftColor={brdlftclr}  >
                                            <HStack>
                                                <Heading size={'xs'}> Name: {record.fullname} </Heading>
                                            </HStack>
                                            <HStack >
                                                <Heading size={'xs'}> Subject: {record.subject}</Heading>
                                            </HStack>
                                            <HStack >
                                                <Heading size={'xs'}> Office: {record.officename}</Heading>
                                            </HStack>
                                            <HStack >
                                                <Heading size={'xs'}> Leave Date: {record.proposedLeaveDate}</Heading>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </Pressable>
                        )

                    })
                }
                <AlertDialogBox isOpen={isOpen} setIsOpen={setIsOpen} leaveRecords={leaveRecords} id={ID} />
            </ScrollView>
        );
    } else {
        return (
            <Box
                _dark={{ bg: "blueGray.900" }}
                _light={{ bg: "blueGray.50" }}
                flex="1">
                <VStack flex={1} flexDir={'row'} justifyContent={'center'} alignItems={'center'}  >
                    <Box h="200px" w="200" alignSelf={'center'} flexDirection={'row'} justifyContent={'center'} alignSelf={'center'} alignItems={'center'} marginLeft={-12} mt={-10} >
                        <BrandIcon />
                    </Box>
                </VStack>

            </Box>
        )
    }
}
export default LeaveRequest;

function BrandIcon() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
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