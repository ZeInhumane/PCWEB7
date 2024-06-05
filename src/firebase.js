// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useState, useEffect } from "react";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, collection, query, where, onSnapshot, doc, updateDoc };

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed, user:", user);
            setCurrentUser(user);
        });

        return unsubscribe;
    }, []);

    const signup = (email, password, username) =>
        createUserWithEmailAndPassword(auth, email, password).then((result) => {
            if (auth.currentUser) {
                return updateProfile(auth.currentUser, {
                    displayName: username,
                }).then(() => {
                    setCurrentUser(auth.currentUser);
                });
            }
        });

    const login = (email, password) =>
        signInWithEmailAndPassword(auth, email, password).then(() => {
            setCurrentUser(auth.currentUser);
        });

    const logout = () =>
        signOut(auth).then(() => {
            setCurrentUser(null);
        });

    return {
        currentUser,
        signup,
        login,
        logout,
    };
};
