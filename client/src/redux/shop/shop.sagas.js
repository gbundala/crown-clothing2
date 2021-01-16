//IMPORTS
import { takeLatest, call, put, all, select } from "redux-saga/effects";
import ShopActionTypes from "./shop.types";
import {
  addIndividualShopDocumentItems,
  addIndividualShopDocumentItemsToMyUserDoc,
  convertCollectionsSnapshotToMap,
  firestore,
  uploadSellerImageFileToStorage,
} from "../../firebase/firebase.utils";
import {
  fetchCollectionsSuccess,
  fetchCollectionsFailure,
} from "./shop.actions";
import {
  onCartItemsStoreStart,
  storeCartItemsInFirebase,
} from "../cart/cart.sagas";
import { sellerFileUploadStatus } from "../seller/seller.actions";
import { selectCurrentUser } from "../user/user.selector";

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
  payload: { name, price, collection },
}) {
  console.log("Saga is fired");

  try {
    const user = yield select(selectCurrentUser);
    if (!user) return;

    yield all([
      call(
        addIndividualShopDocumentItems,
        "collections",
        collection,
        name,
        price
      ),
      call(
        addIndividualShopDocumentItemsToMyUserDoc,
        user,
        "sellerCollections",
        collection,
        name,
        price
      ),
    ]);
    console.log("Successsfully stored data in firestore");
  } catch (error) {
    // FIXME: Put the redux action for failure
    console.error("Error in storing to Firebase: ", error);
  }
}

//SELLER FILE UPLOAD TO FIREBASE STORAGE
export function* uploadSellerFileToStorageAsync({ payload }) {
  console.log("Saga is fired: ", payload);

  try {
    yield call(uploadSellerImageFileToStorage, payload);

    console.log("Successfully uploaded an image");
  } catch (error) {
    //TODO: Insert a put method to throw the error
    console.error("Error in uploading file to Storage: ", error);
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

//INITIALIZATION SAGA TO START FILE UPLOAD BY SELLER
export function* onSellerFileUploadStart() {
  yield takeLatest(
    ShopActionTypes.SELLER_FILE_UPLOAD_START,
    uploadSellerFileToStorageAsync
  );
}

//ROOT SHOP SAGA
export function* shopSagas() {
  yield all([
    call(fetchCollectionsStart),
    call(onCollectionItemsStoreStart),
    call(onSellerFileUploadStart),
  ]);
}
