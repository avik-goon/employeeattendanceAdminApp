import Geocoder from 'react-native-geocoding';
import { getDetails } from './GooglePlacesInput'
import Constants from 'expo-constants';
import { GOOGLE_PLACES_APIKEY as apikey } from '../config/apikey'
// Initialize the module (needs to be done only once)
Geocoder.init(apikey, { language: "en" }); // use a valid API key
// With more options
// Geocoder.init("xxxxxxxxxxxxxxxxxxxxxxxxx", {language : "en"}); // set the language

// Search by address
// Geocoder.from("Colosseum")
// 		.then(json => {
// 			var location = json.results[0].geometry.location;
// 			console.log(location);
// 		})
// 		.catch(error => console.warn(error));

// // Search by address, with a biased geo-bounds
// Geocoder.from("Pyramid", {
// 		southwest: {lat: 36.05, lng: -115.25},
// 		northeast: {lat: 36.16, lng: -115.10}})
// 		.then(json => {
// 			var location = json.results[0].geometry.location;
// 			console.log(location);
// 		})
// 		.catch(error => console.warn(error));

// Search by geo-location (reverse geo-code)

// // Works as well :
// // ------------

// // location object
// Geocoder.from({
// 	latitude : 41.89,
// 	longitude : 12.49
// });

// // latlng object
// Geocoder.from({
// 	lat : 41.89,
// 	lng : 12.49
// });

// // array
// Geocoder.from([41.89, 12.49]);

export default function getPlaceDetailsByLatLng(lat, lng, placeDetails, setPlaceDetails) {

    Geocoder.from({
        latitude: lat,
        longitude: lng
    })
        .then(json => {
            var addressComponent = json.results[0].address_components[0];
            var formatted_address = json.results[0].formatted_address;
            var addressComponent = json.results[0].address_components;
            var formattedDetails = getDetails(addressComponent)
            setPlaceDetails({
                ...placeDetails, locationDescription: formatted_address, ...formattedDetails, latitude: lat,
                longitude: lng
            })

        })
        .catch(error => console.warn(error));
}