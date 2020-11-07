import { all, call, takeLatest, put, select } from "redux-saga/effects";
import {
  addCartItemsCollectionAndDocuments,
  getCurrentUser,
} from "../../firebase/firebase.utils";
import UserActionTypes from "../user/user.types";
import {
  cartItemsStoreFailure,
  cartItemsStoreSuccess,
  clearCart,
} from "./cart.actions";
import { selectCartItems } from "./cart.selectors";
import { CartActionTypes } from "./cart.types";

//FUNCTION || ACTION SAGA (METHOD)
export function* clearCartOnSignOut() {
  yield put(clearCart());
}

//CALLING THE FIREBASE METHOD TO STORE CART ITEMS IN FIREBASE
export function* storeCartItemsInFirebase() {
  try {
    const cartItems = yield select(selectCartItems);
    // const userAuth = yield getCurrentUser();
    // if (!userAuth) return; //if user never signed in, end session
    console.log("this saga has been called");
    yield call(addCartItemsCollectionAndDocuments, "cartItems", cartItems);

    // yield put(cartItemsStoreSuccess());

    //plug into redux the state of the cartItems for the specific user from Firestore into the App
  } catch (error) {
    yield put(cartItemsStoreFailure(error));
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

//TODO: CREATE AN INITIALIZING SAGA WHEN USER MANUALLY CLICKS BUTTON TO CLEAR OUT THE ENTIRE CART

//CART ROOT SAGA
export function* cartSagas() {
  yield all([call(onSignOutSuccess), call(onCartItemsStoreStart)]);
}
