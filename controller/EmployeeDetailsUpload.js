import dbh from "../config/db.config";
import * as Firebase from "firebase";
export default async function uploadEmployeeDetails(employeeDetails, setIsUploading) {
    // Add a new document with a generated id.
    employeeDetails = { ...employeeDetails, status: 'active' }
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
            setIsUploading(false)
            console.log(error);
            blob.close();
            return -1;
        },
        async () => {
            snapshot.snapshot.ref.getDownloadURL().then(async (url) => {
                //console.log(url);
                blob.close();
                employeeDetails = { ...employeeDetails, image_url: url };
                try {
                    const res = await dbh.collection('employee').add(employeeDetails);
                    console.log('Added document with ID: ', res.id);
                    if (res.id !== "" || res.id !== undefined || res.id !== null)
                        return res.id
                    else return -1;
                } catch (error) {
                    setIsUploading(false)
                }

            });
        }
    );

}

