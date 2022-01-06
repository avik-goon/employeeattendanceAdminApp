import db from "../config/db.config";

export default async function getEmployeeLoginLocations(date, userID) {

    const employeeLoginLocationsRef = db.collection('employeeLoginLocations');
    const snapshot = await employeeLoginLocationsRef.where('userID', '==', userID).where('loginDate', '==', date).get();
    if (snapshot.empty) {

        return -1;
    }

    let arr = []
    snapshot.forEach(doc => {
        arr.push({ ...doc.data(), EmployeeLoginLocationRecordId: doc.id })
    });
    return arr;
}