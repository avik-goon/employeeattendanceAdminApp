import dbh from "../config/db.config";

export default async function uploadLocationDetails(locationDetails, setIsUploading) {
    // Add a new document with a generated id.
    try {
        const res = await dbh.collection('locations').add(locationDetails);
        console.log('Added document with ID: ', res.id);
        if (res.id !== "" || res.id !== undefined || res.id !== null)
            return res.id
        else return -1;
    } catch (error) {
        setIsUploading(false)
    }

}