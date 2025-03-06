// This file manages Firebase authentication. For documentation refer to: https://firebase.google.com/docs/auth/web/start#web

import { auth, db, collection, doc, query, where, getDocs, setDoc} from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Registers a user using an asnychronous function & firebase auth register function. Returns the user
export const Register = async (username, email, password) => {

    try {
        // see if username is taken
        if(await checkUsername(username)){
            throw new Error("Username taken! Try another.");
        }
        
        const userDetails = await createUserWithEmailAndPassword(auth, email, password);

        if(!userDetails.user || !userDetails.user.uid){
            throw new Error("An error occurred. Please try again.");
        }

        console.log(userDetails.user);
        // Add user to the database
        await setDoc(doc(db, "users", userDetails.user.uid), {
            uid: userDetails.user.uid,
            email: email,
            username: username,
            lowercasedUsername: username.toLowerCase(),
            createdAt: new Date().toISOString(),
        });
        
    } catch (error) {
        console.log(error.message);
        throw new Error("Invalid email or password. Please try again.");
    }
};

// Login a user using an asnychronous function & firebase auth sign-in function. Returns the user
export const Login = async (email, password) => {
    try {
        const userDetails = await signInWithEmailAndPassword(auth, email, password);
        return userDetails.user;
    } catch (error) {
        console.log(error.messsage);
    }
};

export const Logout = async () => {
    try {
        await signOut(auth);
        console.log("User signed out");
      } catch (error) {
        console.error("Error during sign-out:", error.message);
      }
};

const checkUsername = async (username) => {
    const usersRef = collection(db, "users");
    const search = query(usersRef, where("lowercasedUsername", "==", username.toLowerCase()));
    const results = await getDocs(search);
    return !results.empty;
};


