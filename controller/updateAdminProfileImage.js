import db from "../config/db.config";
import * as Firebase from "firebase";
import store from '../store/store';
import { createAdminData } from "../store/reducers/CreateAdminData";
import { auth } from "../config/db.config";
export default async function updateAdminProfileImage(adminData, user, setIsUploading, Alert, navigation) {
    setIsUploading(true);
    if (adminData.fileName === undefined) {
        return Promise.resolve(200);
    } else {
        const filename = 'img_' + adminData.fileName;
        const image_url = adminData.imageURL;

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
            (url) => {
                //console.log(`url1=> `, url);
            },
            (error) => {
                blob.close();
                setIsUploading(false);
                Alert.alert(`${error.message}`)
                return -1;
            },
            async () => {
                snapshot.snapshot.ref.getDownloadURL().then(async (url) => {

                    blob.close();
                    var newAdminData = {
                        email: adminData.email,
                        filename,
                        imageURL: url,
                        name: adminData.name,
                    }

                    const adminRef = db.collection('adminDetails').doc('admin');
                    try {
                        const res = await adminRef.update(newAdminData);
                    } catch (err) {

                        Alert.alert('Unknown Error Occured!')
                        return -1;
                    }
                    user.updateEmail(adminData.email).then(() => {
                        user.updateProfile({
                            displayName: adminData.name,
                            photoURL: url
                        }).then((r) => {
                            Alert.alert("User Updation Successfull!")
                            setIsUploading(false);
                            store.dispatch(createAdminData([{
                                name: auth.currentUser?.displayName,
                                imageURL: url,
                                email: auth.currentUser.email
                            }]))
                        }).catch((error) => {

                            Alert.alert(error.message)
                            setIsUploading(false);
                        });
                    }).catch((error) => {
                        if (error.code === "auth/requires-recent-login") {
                            Alert.alert(
                                "SignOut Now?",
                                `${error.message}`,
                                [
                                    {
                                        text: "No",
                                        style: "cancel"
                                    },
                                    {
                                        text: "Sign Out",
                                        onPress: () => {
                                            auth.signOut().then(() => {
                                                navigation.replace("LoginScreen");
                                            }).catch((error) => {
                                                Alert.alert(error.message)
                                                setIsUploading(false);
                                            });
                                        }
                                    }
                                ]
                            )
                        }
                        setIsUploading(false);
                    });
                    // console.log(url);
                    return 1;
                });
            }
        );
    }

}