import db from "../config/db.config";
import store from "../store/store";
import { leaveCounterHandler } from "../store/reducers/leaveRecordCounter";
import { leaveRecordsHandler } from "../store/reducers/leaveRecords";
export default function getLeaveRecord(setState) {
    const ref = db.collection('leaveRecords');
    const query = ref.where('status', '==', 'pending');
    const query2 = ref.where('status', '==', 'granted');

    const observer = query.onSnapshot(querySnapshot => {
        setState([])
        const arr = [];
        querySnapshot.forEach(record => {
            arr.push({ ...record.data(), leaveRecordID: record.id })
        });
        setState([...arr])
        store.dispatch(leaveCounterHandler(arr.length))
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
    query2.onSnapshot(querySnapshot => {
        const arr = [];
        querySnapshot.forEach(record => {
            arr.push({ ...record.data(), leaveRecordID: record.id })
        });
        store.dispatch(leaveRecordsHandler(arr))
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
    return observer;
}