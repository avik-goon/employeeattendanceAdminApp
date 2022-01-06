import dbh from "../config/db.config";

export default async function getLocationData() {
    const locationArray = new Array();
    const locationsRef = dbh.collection('locations');
    const snapshot = await locationsRef.get();
    snapshot.forEach(doc => {
        var temp = {
            ...doc.data(),
            id: doc.id
        }
        locationArray.push(temp)
    });

    return (locationArray);
}