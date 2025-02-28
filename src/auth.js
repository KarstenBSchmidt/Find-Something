// This file manages Firebase authentication. For documentation refer to: https://firebase.google.com/docs/auth/web/start#web

import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Registers a user using an asnychronous function & firebase auth register function. Returns the user
export const Register = async (username, email, password) => {
    if(username.length >= 3){
    try {
        const userDetails = await createUserWithEmailAndPassword(auth, email, password);
        return userDetails.user;
    } catch (error) {
        // error print
        console.log(error.messsage);
    }
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
    return signOut(auth);
};


