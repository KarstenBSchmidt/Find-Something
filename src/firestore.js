import { auth, db, collection, getDocs, query, orderBy} from './firebase';
import { addDoc } from "firebase/firestore";

// Store the current users generate challenge under their profile into firestore
export const storeChallenge= async(longitude, latitude, distance) => {
    // Don't add duplicate challenges
    if (getChallenges().includes({longitude, latitude, distance})) {
        console.log("Challenge already exists.");
        return;
    }

    try {
        
        const uid = auth.currentUser?.uid;
        if (!uid) {
            throw new Error("User not logged in.");
        }

        const challenges = collection(db, 'users', uid, 'challenges');

        await addDoc(challenges, {
            longitude: longitude,
            latitude: latitude,
            distance: distance,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get all the challenges that the current user has created
export const getChallenges = async() => {
    try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            throw new Error("User not logged in.");
        }

        const challenges = collection(db, 'users', uid, 'challenges');
        const challengeQuery = query(challenges, orderBy('createdAt', 'desc'));
        const challengesSnapshot = await getDocs(challengeQuery);
        return challengesSnapshot.docs.map(doc => doc.data());
    } catch (error) {
        throw new Error(error.message);
    }
}



