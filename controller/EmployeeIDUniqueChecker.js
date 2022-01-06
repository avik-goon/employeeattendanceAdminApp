import dbh from "../config/db.config";

export default async function isUnique(emp_id) {
    const employeeRef = dbh.collection('employee');
    const snapshot = await employeeRef.where('emp_id', '==', emp_id).get();
    if (snapshot.empty) {
        return true;
    } else return false;
}