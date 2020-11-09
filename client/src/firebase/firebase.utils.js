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

//ADDING SHOP COLLECTION DATA AGAIN AFTER MISTAKENLY DELETING😜
export const addShopCollectionsAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const shopCollectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();

  objectsToAdd.forEach((obj) => {
    const newShopDocRef = shopCollectionRef.doc();
    batch.set(newShopDocRef, obj);
  });

  await batch.commit();
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

//ADDING USER CARTITEMS TO FIRESTORE -- 2ND DRAFT
export const addCartItemsCollectionAndDocuments = async (
  cartCollectionKey,
  cartDocsToAdd
) => {
  const cartItemsCollectionRef = firestore.collection(cartCollectionKey);
  const cartItemsCollectionSnapshot = cartItemsCollectionRef.get();
  const cartItemsDocSnapshotObjects = (await cartItemsCollectionSnapshot).docs;

  //code checks whether all the items exists firebase
  const existingCartItemDocs = cartDocsToAdd.every((obj) =>
    cartItemsDocSnapshotObjects.find((docObj) => docObj.data().id === obj.id)
  );

  //Capture & store the new cartItem to be added as a doc in firestore
  const newCartItemDoc = cartItemsDocSnapshotObjects.map(async (docObj) =>
    cartDocsToAdd.find((obj) => docObj.data().id === obj.id)
  );

  const newCartItemDoc1 = cartDocsToAdd.map(async (obj) =>
    cartItemsDocSnapshotObjects.filter((docObj) => docObj.data().id !== obj.id)
  );
  console.log("new cartItem doc stored!", newCartItemDoc1);

  //Run this code only if the cartItems collection is empty
  if ((await cartItemsCollectionSnapshot).empty) {
    const cartBatch = firestore.batch();

    cartDocsToAdd.forEach((obj) => {
      const newCartDocRef = cartItemsCollectionRef.doc();
      const cartDocSnapshot = newCartDocRef.get();

      cartBatch.set(newCartDocRef, obj);
    });

    return await cartBatch.commit();
  }

  //Run this code if we need to update the existing cartItemDoc
  if (existingCartItemDocs) {
    return cartItemsDocSnapshotObjects.forEach(async (docObj) => {
      console.log(docObj);
      const existingCartDocRef = firestore.doc(`cartItems/${docObj.id}`);
      console.log(existingCartDocRef);

      cartDocsToAdd.map(async (obj) => {
        if (docObj.data().id === obj.id) {
          try {
            return await existingCartDocRef.update({
              ...docObj.data(),
              quantity: obj.quantity,
            });
          } catch (error) {
            console.log("error in setting qty:", error.message);
          }
        }
      });
    });
  }

  //Run this code if the is a new item to be added in firebase
  //TODO: Put a try catch block for adding the obj in firebase & replace the console log
  console.log("does it ever reach here?");
  return cartDocsToAdd.map(async (obj) =>
    cartItemsDocSnapshotObjects.find((docObj) => docObj.data().id === obj.id)
      ? console.log("it exists in firebase")
      : await cartItemsCollectionRef.add(obj)
  );

  //TODO: Add a conditional to remove an item from firebase that had been removed from the client store
};

//ADDING USER CARTITEMS TO FIRESTORE -- 1ST DRAFT
export const addCartItemsCollectionAndDocuments1 = async (
  collectionKey,
  objectsToAdd
) => {
  const cartItemsRef = firestore.collection(collectionKey);
  console.log(cartItemsRef);
  const cartItemsSnapshot = cartItemsRef.limit(1).get();
  console.log(cartItemsSnapshot);

  if (cartItemsSnapshot.size === 0) {
    console.log("this empty block is called");
    const batch = firestore.batch();

    objectsToAdd.forEach((obj) => {
      const newDocRef = cartItemsRef.doc();
      const newDocSnapshot = newDocRef.get();
      console.log(newDocSnapshot);

      batch.set(newDocRef, obj);
    });

    return await batch.commit();
  }

  //otherwise if it is not empty we set transactionally the docs  i.e. one after another not in batch -- put in the code here for this
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
