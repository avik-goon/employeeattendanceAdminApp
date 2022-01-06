import db from "../config/db.config";

export default async function updateLeaveRecordID(recordID, updateString) {
    const leaveRecordsRef = db.collection('leaveRecords').doc(recordID);

    const res = await leaveRecordsRef.update({ status: updateString });
}