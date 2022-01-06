import db from "../config/db.config";

export default async function validateUser(user, setState) {
    console.log(user);
    const adminRef = db.collection('admin');
    let tempUser = {}
    setState({});
    const snapshot = await adminRef.where('username', '==', user.email).where('password', '==', user.password).get();
    if (snapshot.empty) {

        return -1;
    }

    snapshot.forEach((doc) => {
        tempUser = { ...doc.data(), id: doc.id }
    });
    setState(tempUser)
}