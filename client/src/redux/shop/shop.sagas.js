//IMPORTS
import { takeLatest, call, put, all } from "redux-saga/effects";
import ShopActionTypes from "./shop.types";
import {
  addIndividualShopDocumentItems,
  convertCollectionsSnapshotToMap,
  firestore,
} from "../../firebase/firebase.utils";
import {
  fetchCollectionsSuccess,
  fetchCollectionsFailure,
} from "./shop.actions";
import {
  onCartItemsStoreStart,
  storeCartItemsInFirebase,
} from "../cart/cart.sagas";

//FETCH COLLECTIONS FROM FIREBASE TO THE APP
export function* fetchCollectionsAsync() {
  try {
    const collectionRef = firestore.collection("collections");
    const snapshot = yield collectionRef.get();
    const collectionsMap = yield call(
      convertCollectionsSnapshotToMap,
      snapshot
    );
    yield put(fetchCollectionsSuccess(collectionsMap));
  } catch (error) {
    yield put(fetchCollectionsFailure(error.message));
  }
}

//STORING NEW COLLECTION ITEMS TO FIREBASE
export function* storeCollectionItemsInFirebaseAsync({
  payload: { name, price, imageUrl, collection },
}) {
  console.log("Saga is fired");
  try {
    yield call(
      addIndividualShopDocumentItems,
      "collections",
      collection,
      name,
      price,
      imageUrl
    );
    console.log("Successsfully stored data in firestore");
  } catch (error) {
    console.error("Error in storing to Firebase: ", error);
  }
}

//INITIALIZATION SAGA TO FETCH DATA FROM FIREBASE
export function* fetchCollectionsStart() {
  yield takeLatest(
    ShopActionTypes.FETCH_COLLECTIONS_START,
    fetchCollectionsAsync
  );
}

//INITIALIZATION SAGA (LISTENER) TO START STORING COLLECTION ITEMS IN FIREBASE
export function* onCollectionItemsStoreStart() {
  yield takeLatest(
    ShopActionTypes.COLLECTION_ITEMS_STORE_START,
    storeCollectionItemsInFirebaseAsync
  );
}

//ROOT SHOP SAGA
export function* shopSagas() {
  yield all([call(fetchCollectionsStart), call(onCollectionItemsStoreStart)]);
}
