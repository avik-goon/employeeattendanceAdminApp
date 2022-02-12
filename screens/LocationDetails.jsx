import React, { useEffect, useState, useCallback } from 'react';
import { Box, Factory, useColorModeValue, VStack, ScrollView } from 'native-base';
import getLocationData from '../controller/GetLocationDetails';
import { Dimensions, RefreshControl } from 'react-native';
import RelaxSVG from '../components/RelaxSvg';
import LocationList from '../components/LocationList';

const LocationDetails = () => {
    const onRefresh = React.useCallback(() => {
        addLocationToState();
    }, []);
    const [refreshing, setRefreshing] = React.useState(false);
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            addLocationToState();
        }
        return () => {
            isMounted = false;
        }
    }, []);
    const addLocationToState = useCallback(async () => {
        setRefreshing(true);
        let data = await getLocationData();
        if (data.length > 0) {
            setLocations(data);
            setRefreshing(false);
        }
    }, [locations])

    return (
        <Box _dark={{ bg: "blueGray.900" }} _light={{ bg: "blueGray.50" }} flex={1}>
            {
                locations.length > 0 ?
                    <ScrollView
                        _dark={{ bg: "blueGray.900" }}
                        _light={{ bg: "blueGray.50" }}
                        flexGrow={1}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />}
                    >
                        {
                            locations.map((loc, index) => {
                                return (<LocationList location={loc} key={index.toString()} refresh={onRefresh} />)
                            })
                        }
                    </ScrollView>
                    :
                    <VStack flex={1} flexDir={'row'} justifyContent={'center'} alignItems={'center'}  >
                        <Box h="200px" w="200" alignSelf={'center'} flexDirection={'row'} justifyContent={'center'} alignSelf={'center'} alignItems={'center'} marginLeft={-12} mt={-10} >
                            <BrandIcon />
                        </Box>
                    </VStack>
            }
        </Box>

    );
}
export default LocationDetails;
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