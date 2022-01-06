import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Box, useColorModeValue } from 'native-base';
import { View, StyleSheet, TextInput } from 'react-native';
import { GOOGLE_PLACES_APIKEY as apikey } from '../config/apikey'
const GOOGLE_PLACES_API_KEY = apikey // never save your real api key in a snack!

const GooglePlacesInput = ({ placeDetails, setPlaceDetails }) => {
    return (
        <Box backgroundColor={useColorModeValue("blueGray.50", "blueGray.900")} style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search For Places"
                query={{
                    key: GOOGLE_PLACES_API_KEY,
                    language: 'en', // language of the results
                    components: 'country:in',
                    type: 'establishment'
                }}
                GooglePlacesSearchQuery={
                    {
                        rankby: 'distance',
                    }
                }
                GooglePlacesDetailsQuery={
                    {
                        fields: ['formatted_address', 'geometry']
                    }
                }
                fetchDetails={true}
                onPress={(data, details = null) => {
                    const detailedAddress = getDetails(details.address_components);
                    const locationDescription = data.description;
                    let latitude = details.geometry.location.lat;
                    let longitude = details.geometry.location.lng;
                    const mergedAddress = { ...detailedAddress, locationDescription, latitude, longitude }
                    setPlaceDetails({ ...placeDetails, ...mergedAddress })

                }}
                onFail={(error) => console.error(error)}
                enablePoweredByContainer={false}
                enableHighAccuracyLocation={true}
            />
        </Box>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 0,
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 1,
        padding: 10,
    },
});
export default GooglePlacesInput;

export function getDetails(adresscomponent) {
    let details = {
        "city": "",
        "plot": "",
        "postal_code": "",
    };
    for (const key in adresscomponent) {
        if (Object.hasOwnProperty.call(adresscomponent, key)) {
            const element = adresscomponent[key];
            if (element.types.find((str) => str === "locality")) {
                details.city = element.long_name;
            }
            if (element.types.find((str) => str === "postal_code")) {
                details.postal_code = element.long_name;
            }
            if (element.types.find((str) => str === "street_number")) {
                details.plot = element.long_name;
            }
        }
    }
    return details;
}
