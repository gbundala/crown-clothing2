//FIREBASE IMPORTS
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

//REDUX IMPORTS
import { store } from "../redux/store";
import {
  sellerFileUploadComplete,
  sellerFileUploadStatus,
} from "../redux/seller/seller.actions";

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
  rawClothesDocRef,
  name,
  price
) => {
  const mappedDocRef = {
    womens: "CUbKnZZ0qf0055Fz4K9h",
    mens: "CeJTRVox79x7klhmsmBP",
    hats: "Czx1Zdbee5NA1rcKExMI",
    sneakers: "ELkNhPZaZMEFvMqnI8XP",
    jackets: "ZsECPU5cs5rMJihxzgzh",
  };

  const clothesDocRef = mappedDocRef[`${rawClothesDocRef}`];
  const collectionRef = firestore.collection(collectionKey);
  const documentRef = collectionRef.doc(clothesDocRef);
  function select(state) {
    return state.seller.imageUrl;
  }
  const imageUrl = select(store.getState());

  function selectUser(state) {
    return state.user.currentUser.email;
  }
  const uploadedBy = selectUser(store.getState());
  console.log("UPLOADED BY: ", uploadedBy);

  // TODO: Consider the quantity in store field if necessary
  await documentRef.update({
    items: firebase.firestore.FieldValue.arrayUnion({
      createdAt: new Date(),
      id: Math.random().toString(4).slice(2),
      imageUrl,
      name,
      price,
      uploadedBy, //TODO: store the email only in this field
      // qtyInStore,
    }),
  });
};

//SELLER ADDING INDIVIDUAL DOCUMENTS OF SHOP ITEMS TO HIS/HER USER DOC AS A SEPARATE COLLECTION
export const addIndividualShopDocumentItemsToMyUserDoc = async (
  user,
  sellerCollectionKey,
  rawClothesDocRef,
  name,
  price
) => {
  if (!user) return;

  const sellerCollectionRef = firestore.collection(
    `users/${user.id}/${sellerCollectionKey}`
  );
  const documentRef = sellerCollectionRef.doc(rawClothesDocRef);
  const documentSnapshot = await documentRef.get();

  const select = (state) => state.seller.imageUrl;
  const imageUrl = select(store.getState());

  //Run if the document does not exist to set it
  if (!documentSnapshot.exists) {
    try {
      await documentRef.set(
        {
          items: [
            {
              createdAt: new Date(),
              id: Math.random().toString(4).slice(2),
              imageUrl,
              name,
              price,
              // qtyInStore,
            },
          ],
          title: rawClothesDocRef,
        },
        { merge: true }
      );
    } catch (error) {
      console.error(
        "Error in creating a new seller doc in user",
        error.message
      );
    }
  }

  // FIXME: Check if this code runs immediately after the above. Maybe use an else statement for the below code
  //Run if the document exists to update the items array
  try {
    await documentRef.update({
      items: firebase.firestore.FieldValue.arrayUnion({
        createdAt: new Date(),
        id: Math.random().toString(4).slice(2),
        imageUrl,
        name,
        price,
        // qtyInStore,
      }),
    });
  } catch (error) {
    console.error(
      "Error in creating updating the seller doc in user",
      error.message
    );
  }
};

//UPLOADING SELLER IMAGE/FILE TO STORAGE
export const uploadSellerImageFileToStorage = async (imageFile) => {
  console.log("Firebase method called: ", imageFile);

  const imageRef = storage.ref(`sellerImage/${imageFile.name}`);

  const uploadTask = imageRef.put(imageFile);

  console.log("Upload task called: ", uploadTask);

  const next = (snapshot) => {
    const { bytesTransferred, totalBytes } = snapshot;
    const progress = (bytesTransferred / totalBytes) * 100;
    console.log("UPLOAD IN PROGRESS: ", progress);
    store.dispatch(sellerFileUploadStatus(progress));
  };

  const error = (error) => {
    //TODO: Call the shop saga for error here
    console.error("Error in uploading progress: ", error);
  };

  const complete = () => {
    uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
      console.log("File is available through URL: ", downloadUrl);
      store.dispatch(sellerFileUploadComplete(downloadUrl));
    });
  };

  //ALTERNATIVE APPROACH
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
    next: next,
    error: error,
    complete: complete,
  });

  // const task = uploadTask.on(
  //   "state_changed",
  //   //upload in progress
  //   (snapshot) => {
  //     const { bytesTransferred, totalBytes } = snapshot;
  //     const progress = (bytesTransferred / totalBytes) * 100;
  //     console.log("UPLOAD IN PROGRESS: ", progress);
  //     return progress;
  //   },
  //   //on error
  //   (error) => {
  //     console.error("Error in uploading progress: ", error);
  //   },
  //   //on successful upload
  //   () => {
  //     uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
  //       console.log("File is available through URL: ", downloadUrl);
  //     });
  //   }
  // );
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
