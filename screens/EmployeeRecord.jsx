import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, ScrollView, useColorModeValue, HStack, VStack, Icon, Spinner, Divider } from 'native-base';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Calendar } from 'react-native-calendars';
import { getAttendenceByID } from '../controller/GetEmployeeAttendanceDetails'
import date from 'date-and-time';
import { Image, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import getEmployeeLoginLocations from '../controller/getEmployeeLoginLocations';
const EmployeeRecord = ({ route, navigation }) => {
    const empID = route.params.id;
    const empData = [...route.params.EMP_State_Data]
    const thisEmployee = empData.filter((emp) => empID === emp.id)[0];
    const [loginLocations, setLoginLocations] = useState([]);
    const now = new Date();
    const [attendanceRecord, setAttendanceRecord] = useState([]);
    const [attendanceCountByMonth, setAttendanceCountByMonth] = useState(0);
    const [attendanceView, setAttendanceView] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getAttendenceByID(empID).then(record => {
            if (record !== -1 && record !== undefined) {
                setAttendanceRecord([...record])
            } else return setAttendanceRecord([])
        })
    }, [])
    useEffect(() => {
        setAttendanceCountByMonth(getAttendanceCountByMonth(date.transform(date.format(now, 'DD/MM/YYYY'), 'DD/MM/YYYY', 'MM'), attendanceRecord))
        return () => {
            setAttendanceCountByMonth(0);
        }
    }, [attendanceRecord]);
    //console.log(attendanceRecord);
    var attendanceMarker = {};
    if (attendanceRecord.length > 0) {
        attendanceRecord.forEach((record) => {
            attendanceMarker = { ...attendanceMarker, [date.transform(record.logIndate, 'DD/MM/YYYY', 'YYYY-MM-DD')]: { selected: true, marked: true, selectedColor: '#0c4a6e' } }
        })
        //setAttendenceCount(getAttendanceCountByMonth(date.transform(date.format(now, 'DD/MM/YYYY'), 'DD/MM/YYYY', 'MM'), attendanceRecord), setAttendanceCountByMonth)
    }
    const brdrCLR = useColorModeValue('#06b6d4', '#cffafe');
    return (
        <Box
            _dark={{ bg: "blueGray.900" }}
            _light={{ bg: "blueGray.50" }}
            flex="1" safeArea>
            <Box borderBottomWidth={1 / 2} borderBottomColor={useColorModeValue("primary.500", "primary.50")}>
                <HStack w={'100%'} flexDir={'row'} justifyContent={'space-around'} alignSelf={'center'} >
                    <VStack justifyContent={'center'} alignItems={'center'} alignSelf={'center'} flexDir={'row'}>
                        {<Image source={{ uri: thisEmployee.avatarUrl }} style={{ width: 30, height: 30, borderWidth: 2, borderRadius: 75, borderColor: brdrCLR }} alt='image' />}
                    </VStack>
                    <VStack alignSelf={'flex-start'} alignItems={'flex-start'} alignContent={'flex-start'} >
                        <Heading p="4" size="sm" alignSelf={'flex-start'} textAlign={'left'}>
                            {thisEmployee.fullName}
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
            <Box py={3} justifyContent={'center'} alignItems={'center'}>
                <Heading size={'sm'} textAlign={'center'}>
                    Total Attendance: {attendanceCountByMonth} days
                </Heading>
            </Box>
            <Box pb={2} borderBottomWidth={1 / 2} borderBottomColor={useColorModeValue('cyan.900', 'cyan.100')}>
                <Calendar
                    horizontal={true}
                    enableSwipeMonths={true}
                    // Enable paging on horizontal, default = false
                    pagingEnabled={true}
                    onMonthChange={(month) => setAttendanceCountByMonth(getAttendanceCountByMonth(month.month.toString(), attendanceRecord))}
                    style={{
                        height: 350
                    }}
                    onDayPress={(day) => {
                        setLoading(true);
                        var convertedDate = date.transform(day.dateString, 'YYYY-MM-DD', 'DD/MM/YYYY')
                        var attendanceRecordOfPressedDate = attendanceRecord.filter((record) => record.logIndate === convertedDate);
                        if (attendanceRecordOfPressedDate.length > 0) {
                            // console.log(`attendanceRecordOfPressedDate.length = `, attendanceRecordOfPressedDate.length);
                            getEmployeeLoginLocations(convertedDate, empID).then(status => {
                                //console.log(status);
                                if (status === -1) {
                                    //no getEmployeeLoginLocations details
                                    setLoginLocations([]);
                                    setAttendanceView({ ...attendanceRecordOfPressedDate[0] })
                                    setLoading(false)
                                } else {
                                    if (status.length > 0) {
                                        setLoginLocations([...status]);
                                    } else setLoginLocations([]);
                                    setAttendanceView({ ...attendanceRecordOfPressedDate[0] })
                                    setLoading(false)
                                }
                            })
                        } else setLoading(false)

                    }}
                    hideExtraDays
                    markedDates={attendanceMarker}
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    theme={{
                        backgroundColor: useColorModeValue("#f8fafc", "#0f172a"),
                        calendarBackground: useColorModeValue("#f8fafc", "#0f172a"),
                        textSectionTitleColor: '#b6c1cd',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: useColorModeValue("#0f172a", "#f8fafc"),
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        disabledArrowColor: '#d9e1e8',
                        monthTextColor: useColorModeValue("#0f172a", "#f8fafc"),
                        indicatorColor: 'blue',
                        textDayFontFamily: 'monospace',
                        textMonthFontFamily: 'monospace',
                        textDayHeaderFontFamily: 'monospace',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
            </Box>
            <ScrollView flexGrow={1}>

                {
                    !loading ?
                        (Object.keys(attendanceView).length > 0) ? <AttendanceDetailsView thisEmployee={thisEmployee} attendanceDetails={attendanceView} loginLocations={loginLocations} brdrCLR={brdrCLR} /> : <></>
                        :
                        <Box my={8}>
                            <HStack space={5} alignItems={'center'} justifyContent={'center'}>
                                <VStack>
                                    <Spinner size="sm" />
                                </VStack>
                                <VStack>
                                    <Heading size={"sm"} >Fetching Records Please Wait! </Heading>
                                </VStack>
                            </HStack>
                        </Box>
                }
            </ScrollView>

        </Box>
    );
}
export default EmployeeRecord;

const AttendanceDetailsView = ({ thisEmployee, attendanceDetails, loginLocations, brdrCLR }) => {
    return (
        <Box p={2} pl={'3'}>
            <Box py={3} mb={'2'}>
                <Heading size={'sm'}> Showing Record: {attendanceDetails.logIndate} </Heading>
            </Box>
            <HStack pl={'3'} alignItems={'center'}>
                <VStack pr={'2.5'}>
                    <Box>
                        {<Image source={{ uri: thisEmployee.avatarUrl }} style={{ width: 50, height: 50, borderWidth: 2, borderRadius: 75, borderColor: brdrCLR }} alt='image' />}
                    </Box>
                </VStack>
                <VStack space={2} pl={2} borderLeftWidth={1 / 2} borderLeftColor={'#06b6d4'} _dark={{ borderLeftColor: '#cffafe' }} w={"80%"} >
                    <HStack>
                        <Heading size={'xs'}> LogIn Time: {attendanceDetails.logInTime}  </Heading>
                    </HStack>
                    <HStack >
                        <Heading size={'xs'}> LogOut Time: {(attendanceDetails.logOutTime === "") ? 'Not Available' : attendanceDetails.logOutTime}  </Heading>
                    </HStack>
                    <Divider my="2" />
                    <HStack >
                        <Heading size={'xs'}> LogOut Location: {(attendanceDetails.logOutLocation === "") ? 'Not Available' : attendanceDetails.logOutLocation}  </Heading>
                    </HStack>
                    <HStack >
                        <Heading size={'xs'}> LogOut Date: {(attendanceDetails.logOutDate === "") ? 'Not Available' : attendanceDetails.logOutDate}  </Heading>
                    </HStack>
                    <HStack >
                        <Heading size={'xs'}> LogOut Time: {(attendanceDetails.logOutTime === "") ? 'Not Available' : attendanceDetails.logOutTime}  </Heading>
                    </HStack>
                </VStack>
            </HStack>
            <Box my={2} borderTopWidth={1 / 2} borderTopColor={'muted.600'} >
                <HStack mt={1} py={1}>
                    <VStack>
                        <Heading size={'xs'} >Visited Locations Record:  </Heading>
                    </VStack>
                </HStack>
                {loginLocations.length > 0 ?
                    loginLocations.map((loc, index) => {
                        return (
                            <VStack my={2} key={index.toString()} space={2} pl={2} borderLeftWidth={1 / 2} borderLeftColor={'#06b6d4'} _dark={{ borderLeftColor: '#cffafe' }}  >
                                <HStack>
                                    <Heading size={'xs'}> LogIn Place: {loc.plot}  </Heading>
                                </HStack>
                                <HStack >
                                    <Heading size={'xs'}> LogIn Time: {(loc.loginTime === "") ? 'Not Available' : loc.loginDate + " | " + loc.loginTime}  </Heading>
                                </HStack>
                                <HStack >
                                    <Heading size={'xs'}> LogOut Time: {(loc.logOutTime === "") ? 'Not Available' : loc.logOutDate + " | " + loc.logOutTime}  </Heading>
                                </HStack>
                            </VStack>
                        )
                    })
                    :
                    <Box my={3} ml={2}>
                        <HStack alignItems={'center'} >
                            <VStack w={"10%"}>
                                <Icon
                                    as={MaterialCommunityIcons}
                                    name="history"
                                    color="coolGray.800"
                                    _dark={{
                                        color: "warmGray.50",
                                    }}
                                    size={'sm'}
                                />
                            </VStack>
                            <VStack w={"90%"}>
                                <Heading size={'sm'}>No Login History Found For External Locations!</Heading>
                            </VStack>
                        </HStack>
                    </Box>
                }
            </Box>
        </Box>
    )
}

const getAttendanceCountByMonth = (monthNumber, attendanceRecords) => (attendanceRecords.filter((record) => monthNumber === date.transform(record.logIndate, 'DD/MM/YYYY', 'MM')).length)
