import { all, call, put, select, takeLatest } from "redux-saga/effects";
import {
  convertCollectionsSnapshotToMap,
  firestore,
} from "../../firebase/firebase.utils";
import { selectCurrentUser } from "../user/user.selector";
import { fetchSellerCollectionsSuccess } from "./seller.actions";
import SellerActionTypes from "./seller.types";

//FETCH SELLER COLLECTIONS FROM THE USER(SELLER) DOCUMENT IN FIRESTORE
export function* fetchSellerCollectionsAsync() {
  try {
    const user = yield select(selectCurrentUser);
    if (!user) return;
    const collectionRef = firestore.collection(
      `users/${user.id}/sellerCollections`
    );
    const snapshot = yield collectionRef.get();
    const sellerCollectionsMap = yield call(
      convertCollectionsSnapshotToMap,
      snapshot
    );
    console.log("Lets see the sellerCollection snap: ", sellerCollectionsMap);
    yield put(fetchSellerCollectionsSuccess(sellerCollectionsMap));

    //TODO: Call the convertCollectionsSnapshotToMap method exactly as the one called in shop sagas and implement the View/UI layer similar to shopOverview page
  } catch (err) {
    console.error("Error in fetching seller collections: ", err);
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
