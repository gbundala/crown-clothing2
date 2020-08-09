//LEARN: A reducer is simply a function that received 2 things
//1. it receives the current/initial state
//2. it receives the action
//Actions just simply have type & payload.

import UserActionTypes from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  error: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SIGN_IN_SUCCESS:
      return {
        ...state, //we spread everything else in state prop
        currentUser: action.payload,
        error: null, //say they go an error before then they redo the signIn we want the error to be reset to null now!
      };
    case UserActionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        currentUser: null,
        error: null,
      };
    case UserActionTypes.SIGN_IN_FAILURE:
    case UserActionTypes.SIGN_OUT_FAILURE:
      return {
        ...state, //we spread whatever other state is in here, inside of this
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;

//every single reducer gets every single action that gets fired
//even if it does not relate to the reducer. Hence the default switch
//back to state (parameter).
