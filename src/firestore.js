import { auth, db, addDoc, collection, getDocs, query, orderBy} from './firebase';

// Store the current users generate challenge under their profile into firestore
export const storeChallenge= async(longitude, latitude, distance) => {
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



