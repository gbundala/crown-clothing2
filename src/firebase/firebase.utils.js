//this is where we store all firebase utilities files or methods
//below is the config object that we import from the firebase
//utilities library

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBjUDdfvHbQXYWM4_mypKG_JE2MIm9r7mU",
    authDomain: "crown-db2-79d4d.firebaseapp.com",
    databaseURL: "https://crown-db2-79d4d.firebaseio.com",
    projectId: "crown-db2-79d4d",
    storageBucket: "crown-db2-79d4d.appspot.com",
    messagingSenderId: "507911018338",
    appId: "1:507911018338:web:3c3d5c1c4aa9fad1b7be3b"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if(!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch(error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

//Gives us access to the auth provider class from authentication library
const provider = new firebase.auth.GoogleAuthProvider();
//prompt gives us the promp UI for user to select google account to authorise
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;