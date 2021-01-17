import { all, call, select, takeLatest } from "redux-saga/effects";
import { firestore } from "../../firebase/firebase.utils";
import { selectCurrentUser } from "../user/user.selector";
import SellerActionTypes from "./seller.types";

//FETCH SELLER COLLECTIONS FROM THE USER(SELLER) DOCUMENT IN FIRESTORE
export function* fetchSellerCollectionsAsync() {
  try {
    const user = yield select(selectCurrentUser);
    const collectionRef = firestore.collection(
      `users/${user.id}/sellerCollections`
    );
    const snapshot = yield collectionRef.get();
    console.log("Lets see the sellerCollection snap: ", snapshot);
  } catch (err) {
    console.error("Error in fetching seller collections", err);
  }
}

//INITIALIZING SAGA TO START FETCHING ITEMS UPLOADED BY THE SELLER
export function* onFetchSellerCollectionStart() {
  yield takeLatest(
    SellerActionTypes.FETCH_SELLER_COLLECTIONS_START,
    fetchSellerCollectionsAsync
  );
}

//ROOT SELLER SAGA
export function* sellerSagas() {
  yield all([call(onFetchSellerCollectionStart)]);
}
