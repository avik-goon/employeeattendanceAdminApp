import db from "../config/db.config";

export default async function setEmpInactive(empID) {
    const employeeRef = await db.collection('employee').doc(empID);
    try {
        await employeeRef.update({ status: 'inactive' });
        return 1;
    } catch (error) {
        return -1;
    }

}