import { all, call, takeLatest, put } from "redux-saga/effects";
import UserActionTypes from "../user/user.types";
import { clearCart } from "./cart.actions";

//FUNCTION || ACTION SAGA (METHOD)
export function* clearCartOnSignOut() {
  yield put(clearCart());
}

//INITIALIZATION SAGA (LISTENER)
export function* onSignOutSuccess() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearCartOnSignOut);
}

//CART ROOT SAGA
export function* cartSagas() {
  yield all([call(onSignOutSuccess)]);
}
