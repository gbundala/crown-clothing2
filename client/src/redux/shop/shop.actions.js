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

//ACTION METHODS TO STORE INDIVIDUAL COLLECTION ITEMS TO FIREBASE
export const collectionItemsStoreStart = (values) => ({
  type: ShopActionTypes.COLLECTION_ITEMS_STORE_START,
  payload: values,
});

export const collectionItemsStoreSuccess = (collectionItems) => ({
  type: ShopActionTypes.COLLECTION_ITEMS_STORE_SUCCESS,
  payload: collectionItems,
});

export const collectionItemsStoreFailure = (error) => ({
  type: ShopActionTypes.COLLECTION_ITEMS_STORE_FAILURE,
  payload: error,
});

//ACTION METHODS TO UPLOAD FILE/IMAGE ON SELLER PAGE
export const sellerFileUploadStart = (file) => ({
  type: ShopActionTypes.SELLER_FILE_UPLOAD_START,
  payload: file,
});

export const sellerFileUploadSuccess = (fileUrl) => ({
  type: ShopActionTypes.SELLER_FILE_UPLOAD_SUCCESS,
  payload: fileUrl,
});

export const sellerFileUploadFailure = (error) => ({
  type: ShopActionTypes.SELLER_FILE_UPLOAD_FAILURE,
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
