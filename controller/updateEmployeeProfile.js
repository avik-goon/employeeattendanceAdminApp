import db from "../config/db.config";
import * as Firebase from "firebase";
export default async function updateEmployeeProfile(empID, employeeDetails) {
    const filename = 'img_' + employeeDetails.filename;
    const image_url = employeeDetails.image_url;
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image_url, true);
        xhr.send(null);
    });
    const ref = Firebase.storage().ref().child(filename.toString());
    const snapshot = ref.put(blob);

    snapshot.on(
        Firebase.storage.TaskEvent.STATE_CHANGED,
        () => {

        },
        (error) => {
            blob.close();
        },
        async () => {
            snapshot.snapshot.ref.getDownloadURL().then(async (url) => {
                //console.log(url);
                blob.close();
                employeeDetails = { ...employeeDetails, image_url: url };
                const employeeRef = await db.collection('employee').doc(empID);
                try {
                    await employeeRef.update({ ...employeeDetails });
                } catch (error) {
                    return -1;
                }

            });
        }
    );

}