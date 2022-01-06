import dbh from "../config/db.config";
import store from "../store/store";
import { employeEvent } from "../store/reducers/EmployeeLists";
export default function getAllEmployee(setState) {
    const query = dbh.collection('employee');

    query.onSnapshot(querySnapshot => {
        const empList = [];
        const wholeEmpList = [];
        if (querySnapshot.size > 0) {
            setState([]);
            querySnapshot.forEach(emp => {
                empList.push({
                    id: emp.id,
                    fullName: emp.data().name,
                    timeStamp: emp.data().emp_id,
                    recentText: `Username: ${emp.data().email}`,
                    avatarUrl: emp.data().image_url
                })
                wholeEmpList.push({ ...emp.data(), empID: emp.id })
            });
            store.dispatch(employeEvent(wholeEmpList))
        }

        setState([...empList]);
    }, err => {
        //console.log(`Encountered error: ${err}`);

    });

}