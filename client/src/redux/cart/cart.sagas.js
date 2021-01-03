// IMPORTS
import { all, call, takeLatest, put, select } from "redux-saga/effects";
import {
  addCartItemsCollectionAndDocuments,
  convertCartCollectionSnapshotToMap,
  firestore,
  getCurrentUser,
} from "../../firebase/firebase.utils";
import { selectCurrentUser } from "../user/user.selector";
import UserActionTypes from "../user/user.types";
import {
  cartItemsStoreFailure,
  cartItemsStoreSuccess,
  clearCart,
  fetchCartCollectionsFailure,
  fetchCartCollectionsSuccess,
} from "./cart.actions";
import { selectCartItems } from "./cart.selectors";
import { CartActionTypes } from "./cart.types";

//FUNCTION || ACTION SAGA (METHOD)
export function* clearCartOnSignOut() {
  yield put(clearCart());
}

//CALLING THE FIREBASE METHOD TO STORE CART ITEMS IN FIREBASE
//FIXME: Remove the console log here
//FIXME: Find a way to put in the cartItemsStoreSuccess action - as in what do we to the client once we successfuly store to firebase -- maybe somekind of a redirect to another page
export function* storeCartItemsInFirebase() {
  try {
    const cartItems = yield select(selectCartItems);
    const user = yield select(selectCurrentUser);
    // const userAuth = yield getCurrentUser();
    // if (!userAuth) return; //if user never signed in, end session
    if (!user) return;
    yield call(
      addCartItemsCollectionAndDocuments,
      "cartItems",
      cartItems,
      user
    );
    console.log("this saga has been called");

    // yield put(cartItemsStoreSuccess());

    //plug into redux the state of the cartItems for the specific user from Firestore into the App -- UPDATE: we don't want to do this as it is irrelevant as data is already in redux store
  } catch (error) {
    yield put(cartItemsStoreFailure(error));
  }
}

//ASYNC FUNC TO PULL CARTITEMS COLLECTION FROM FIRESTORE -- FOR RESPECTIVE SIGNED IN USER
export function* fetchCartCollectionAsync() {
  try {
    const user = yield select(selectCurrentUser);
    const collectionRef = firestore.collection(`users/${user.id}/cartItems`);
    const snapshot = yield collectionRef.get();
    // console.log(
    //   "how does the pulled data from cartitems look like",
    //   snapshot.docs

    // );
    console.log("snapshot", snapshot.docs);
    const collectionMap = yield call(
      convertCartCollectionSnapshotToMap,
      snapshot
    );
    console.log(collectionMap);
    yield put(fetchCartCollectionsSuccess(collectionMap));
  } catch (error) {
    yield put(fetchCartCollectionsFailure(error.message));
  }
}

//INITIALIZATION SAGA (LISTENER) WHEN USER SIGNS OUT
export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

//INITIALIZATION SAGA WHEN WE START TO STORE CART ITEMS IN FIREBASE
export function* onCartItemsStoreStart() {
  yield takeLatest(
    CartActionTypes.CART_ITEMS_STORE_START,
    storeCartItemsInFirebase
  );
}

//INITIALIZATION SAGA WHEN USER SIGN IN TO PULL IT THEIR CART ITEMS
export function* onSignInSuccess() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, fetchCartCollectionAsync);
}

//TODO: CREATE AN INITIALIZING SAGA WHEN USER MANUALLY CLICKS BUTTON TO CLEAR OUT THE ENTIRE CART

//CART ROOT SAGA
export function* cartSagas() {
  yield all([
    call(onSignOutSuccess),
    call(onCartItemsStoreStart),
    call(onSignInSuccess),
  ]);
}
