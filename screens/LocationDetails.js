import React, { useEffect, useState } from 'react';
import { Box, ScrollView, Text } from 'native-base';
import getLocationData from '../controller/GetLocationDetails';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
const LocationDetails = () => {
    useEffect(() => {
        getLocationData()
    }, []);
    return (
        <ScrollView _dark={{ bg: "blueGray.900" }} _light={{ bg: "blueGray.50" }} flexGrow={1}>
            <Box>
                <Text>In LocationDetails File</Text>
            </Box>
        </ScrollView>
    );
}
export default LocationDetails;