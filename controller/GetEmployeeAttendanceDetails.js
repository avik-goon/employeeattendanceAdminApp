import dbh from "../config/db.config";
import date from 'date-and-time';
export default async function getEmployeeAttendanceDetails(attendanceDetails, setattendanceDetails) {
    const now = new Date();
    const today = (date.format(now, 'DD/MM/YYYY'));
    const attendanceDetailsRef = dbh.collection('attendanceDetails').where('logIndate', '==', today);
    const attendanceData = []
    await attendanceDetailsRef.get().then((snapshot) => {
        snapshot.forEach(async (attendanceDetails) => {
            await dbh.collection('employee').where('emp_id', '==', attendanceDetails.data().empId).get().then(async (employeeDetailsSnapshot) => {
                employeeDetailsSnapshot.forEach(employee => {
                    attendanceData.push({
                        id: attendanceDetails.data().userID,
                        fullName: attendanceDetails.data().name,
                        timeStamp: attendanceDetails.data().logInTime,
                        recentText: `Last LogIn Date: ${attendanceDetails.data().logIndate}`,
                        avatarUrl: employee.data().image_url
                    })
                });
            }).then(r => {
                setattendanceDetails([...attendanceData])
            })
        });
    }).then(r => {

    })

}

export const getAttendenceByID = async (emp_ID) => {
    const attendanceDetailsRef = dbh.collection('attendanceDetails').where('userID', '==', emp_ID);
    const attendanceRecords = [];
    await attendanceDetailsRef.get().then((snapshot) => {
        snapshot.forEach(attendanceRecord => {
            attendanceRecords.push({ ...attendanceRecord.data() })
        });
    }).catch(err => { return -1 })
    return attendanceRecords;
}