import { auth, db, collection, getDocs, query, orderBy} from './firebase';
import { addDoc } from "firebase/firestore";

// Store the current users generate challenge under their profile into firestore
export const storeChallenge= async(longitude, latitude, distance) => {
    try {
        // Fetch existing challenges
        const existingChallenges = await getChallenges();

        // Check if challenge already exists
        const challengeExists = existingChallenges.some(challenge => 
            challenge.longitude === longitude && 
            challenge.latitude === latitude && 
            challenge.distance === distance
        );

        if (challengeExists) {
            //console.log("Challenge already exists.");
            return;
        }

        const challenges = collection(db, 'users', uid, 'challenges');

        await addDoc(challenges, {
            longitude: longitude,
            latitude: latitude,
            distance: distance,
            createdAt: new Date().toISOString(),
        });
        //console.log("New challenge stored successfully.");
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



