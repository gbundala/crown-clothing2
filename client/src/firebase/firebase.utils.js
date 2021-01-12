//IMPORTS
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

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

//SELLER ADDING INDIVIDUAL DOCUMENTS OF ITEMS TO SHOP COLLECTION IN FIRESTORE
export const addIndividualShopDocumentItems = async (
  collectionKey,
  clothesDocRef,
  name,
  price,
  imageUrl
) => {
  console.log(`firebase method called for ${clothesDocRef}: `, name);
  // const { imageUrl, name, price, collection } = objectToAdd;

  const collectionRef = firestore.collection(collectionKey);
  const documentRef = collectionRef.doc(clothesDocRef);

  await documentRef.update({
    items: firebase.firestore.FieldValue.arrayUnion({
      createdAt: new Date(),
      id: Math.random().toString(4).slice(2),
      imageUrl,
      name,
      price,
    }),
  });
};

//ADDING USER CARTITEMS TO FIRESTORE
export const addCartItemsCollectionAndDocuments = async (
  cartCollectionKey,
  cartDocsToAdd,
  user
) => {
  console.log("who is logged in?", user.id);
  const cartItemsCollectionRef = firestore.collection(
    `users/${user.id}/${cartCollectionKey}`
  );
  console.log(cartItemsCollectionRef);
  const cartItemsCollectionSnapshot = cartItemsCollectionRef.get();
  const cartItemsDocSnapshotObjects = (await cartItemsCollectionSnapshot).docs;

  //code checks whether all the items exists firebase
  const existingCartItemDocs = cartDocsToAdd.every((obj) =>
    cartItemsDocSnapshotObjects.find((docObj) => docObj.data().id === obj.id)
  );

  //Run this code only if the cartItems collection is empty
  if ((await cartItemsCollectionSnapshot).empty) {
    const cartBatch = firestore.batch();

    cartDocsToAdd.forEach((obj) => {
      const newCartDocRef = cartItemsCollectionRef.doc();
      cartBatch.set(newCartDocRef, obj);
    });
    return await cartBatch.commit();
  }

  //Run this code if we need to update the existing cartItemDoc
  //FIXME: This code always run even if there is no new qty to update, rectify
  if (existingCartItemDocs) {
    return cartItemsDocSnapshotObjects.forEach(async (docObj) => {
      const existingCartDocRef = firestore.doc(
        `users/${user.id}/${cartCollectionKey}/${docObj.id}`
      );

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
  return cartDocsToAdd.map(async (obj) => {
    if (
      cartItemsDocSnapshotObjects.find((docObj) => docObj.data().id === obj.id)
    )
      return;

    try {
      return await cartItemsCollectionRef.add(obj);
    } catch (error) {
      console.log("error in adding new cartItem in firestore", error);
    }
  });

  //TODO: Add a conditional to remove an item from firebase that had been removed from the client store
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

//TODO: PULLING DATA FROM CARTITEMS COLLECTION
export const convertCartCollectionSnapshotToMap = (collection) => {
  const transformedCollection = collection.docs.map((doc) => {
    return {
      ...doc.data(),
    };
  });

  return transformedCollection.reduce((accumulator, documents) => {
    return [...accumulator, documents];
  }, []);
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

//FIREBASE CONFIGS
firebase.initializeApp(config); //Initializes firebase

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

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
