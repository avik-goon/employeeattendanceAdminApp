import dbh from "../config/db.config";

export default async function getLocationData() {
    const locationArray = new Array();
    const locationsRef = dbh.collection('locations').where('status', '==', 'active');
    const snapshot = await locationsRef.get();
    snapshot.forEach(doc => {
        var temp = {
            ...doc.data(),
            id: doc.id
        }
        locationArray.push(temp)
    });
    // const batch = dbh.batch()
    // locationsRef.get().then(function (querySnapshot) {
    //     querySnapshot.forEach(function (doc) {
    //         const docRef = dbh.collection('locations').doc(doc.id)
    //         batch.update(docRef, { status: 'active' })
    //     });

    //     batch.commit();
    // });

    return (locationArray);
}

export const deleteLocation = async (locID) => {
    try {
        const docRef = dbh.collection('locations').doc(locID)
        await docRef.update({ status: 'inactive' });
        return 1;
    } catch (error) {
        return -1;
    }
}