import UserActionTypes from "./user.types";

//SIGN IN SUCCESS && FAILURE
export const signInSuccess = (user) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS, //this string should never change (hence the use of capital & snake case_)
  payload: user,
});

export const signInFailure = (error) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error,
});

//SIGN UP SUCCESS && FAILURE
export const signUpSuccess = ({ user, additionalData }) => ({
  type: UserActionTypes.SIGN_UP_SUCCESS,
  payload: { user, additionalData },
});

export const signUpFailure = (error) => ({
  type: UserActionTypes.SIGN_UP_FAILURE,
  payload: error,
});

//EMAIL SIGN IN START
export const emailSignInStart = (emailAndPassword) => ({
  type: UserActionTypes.EMAIL_SIGN_IN_START,
  payload: emailAndPassword,
});

//GOOGLE SIGN IN START
export const googleSignInStart = () => ({
  type: UserActionTypes.GOOGLE_SIGN_IN_START,
});

//SIGN UP START
export const signUpStart = (userCredentials) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: userCredentials, //we pass in email, password & displayName as an object called userCredentials as they will be needed later
});

//SESSION PERSISTENCE
export const checkUserSession = () => ({
  type: UserActionTypes.CHECK_USER_SESSION,
});

//SIGN OUT START, SUCCESS && FAILURE
export const signOutStart = () => ({
  type: UserActionTypes.SIGN_OUT_START,
});

export const signOutSuccess = () => ({
  type: UserActionTypes.SIGN_OUT_SUCCESS,
});

export const signOutFailure = (error) => ({
  type: UserActionTypes.SIGN_OUT_FAILURE,
  payload: error,
});
