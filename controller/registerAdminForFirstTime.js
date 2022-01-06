import db from "../config/db.config";
import store from "../store/store";
import { createAdminData } from "../store/reducers/CreateAdminData";
export async function isAdminAvailable() {
    const adminRef = db.collection('adminDetails').doc('admin');
    store.dispatch(createAdminData([]))
    let doc;
    try {
        doc = await adminRef.get();
    } catch (err) {
        console.error(err)
    }
    if (!doc.exists) {

        return -1;
    } else {

        store.dispatch(createAdminData([
            {
                email: doc.data().email,
                fileName: doc.data().fileName,
                imageURL: doc.data().imageURL,
                name: doc.data().name,
                id: 'admin'
            }
        ]))
        return 1;
    }
}

export default async function registerAdminFirstTime() {
    const data = {
        name: '',
        imageURL: '',
        fileName: ''
    };
    const res = await db.collection('adminDetails').doc('admin').set(data);
} 