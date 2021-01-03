//IMPORT STATEMENTS
import ShopActionTypes from "./shop.types";
import {
  convertCollectionsSnapshotToMap,
  firestore,
} from "../../firebase/firebase.utils";

//ACTION METHODS TO FETCH COLLECTION ITEMS FROM FIREBASE
export const fetchCollectionsStart = () => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_START,
});

export const fetchCollectionsSuccess = (collectionsMap) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_SUCCESS,
  payload: collectionsMap,
});

export const fetchCollectionsFailure = (errorMessage) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_FAILURE,
  payload: errorMessage,
});

//ACTION METHODS TO STORE COLLECTION ITEMS TO FIREBASE
export const collectionItemsStoreStart = () => ({
  type: ShopActionTypes.COLLECTION_ITEMS_STORE_START,
});

export const collectionItemsStoreSuccess = (collectionItems) => ({
  type: ShopActionTypes.COLLECTION_ITEMS_STORE_SUCCESS,
  payload: collectionItems,
});

export const collectionItemsStoreFailure = (error) => ({
  type: ShopActionTypes.COLLECTION_ITEMS_STORE_FAILURE,
  payload: error,
});

//TODO: Code below is no longer relevant -- it was used when learning thunk -- revise and remove it
export const fetchCollectionsStartAsync = () => {
  return (dispatch) => {
    const collectionRef = firestore.collection("collections");
    dispatch(fetchCollectionsStart()); //we can do this becuause of redux-thunk

    collectionRef
      .get()
      .then((snapshot) => {
        const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
        dispatch(fetchCollectionsSuccess(collectionsMap));
      })
      .catch((error) => dispatch(fetchCollectionsFailure(error.message)));
  };
};

//if redux-thunk middleware is enabled, anytime you attempt to dispatch a function
//instead of an object, the middleware will call that function with dispatch method
//itself as the first argument.
