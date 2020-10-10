//IMPORTS
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

//MAIN CONFIG OBJECT FROM FIREBASE TO LINK OUR APP WITH OUR FIREBASE PROJECT
const config = {
  apiKey: "AIzaSyBjUDdfvHbQXYWM4_mypKG_JE2MIm9r7mU",
  authDomain: "crown-db2-79d4d.firebaseapp.com",
  databaseURL: "https://crown-db2-79d4d.firebaseio.com",
  projectId: "crown-db2-79d4d",
  storageBucket: "crown-db2-79d4d.appspot.com",
  messagingSenderId: "507911018338",
  appId: "1:507911018338:web:3c3d5c1c4aa9fad1b7be3b",
};

//CREATING USER INTO OUR FIRESTORE DATABASE
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

//ADDING OUR COLLECTION TO FIRESTORE
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);
  console.log(collectionRef);

  const batch = firestore.batch();

  //forEach is similar to map but does not create a new array. we want to call the function on each obj
  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

//PULLING DATA FROM FIRESTORE 'COLLECTIONS' COLLECTION INTO REDUX THEN INTO RESPECTIVE REACT COMPONENTS/CONTAINERS THAT NEED IT
export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title, //then we pass in our title and items as we have destructured them above
      items,
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

//USER SESSION PERSISTENCE UTIL
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

firebase.initializeApp(config); //Initializes firebase

export const auth = firebase.auth();
export const firestore = firebase.firestore();

//Gives us access to the auth Googleprovider class from authentication library
export const googleProvider = new firebase.auth.GoogleAuthProvider();

//FACEBOOK AUTH PROVIDER
export const facebookProvider = new firebase.auth.FacebookAuthProvider();

//prompt gives us the promp UI for user to select google account to authorise
googleProvider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

//SIGN IN WITH FACEBOOK
facebookProvider.setCustomParameters({
  display: "popup",
});
export const signInWithFacebook = () => auth.signInWithPopup(facebookProvider);

export default firebase;

//https://crown-db2-79d4d.firebaseapp.com/__/auth/handler

//OTHER INFORMATION
//this is where we store all firebase utilities files or methods
//above is the config object that we import from the firebase
//utilities library
