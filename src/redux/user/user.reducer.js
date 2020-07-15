//LEARN: A reducer is simply a function that received 2 things
//1. it receives the current/initial state
//2. it receives the action
//Actions just simply have type & payload.

import { UserActionTypes } from "./user.types";

const INITIAL_STATE = {
    currentUser: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.SET_CURRENT_USER:
            return {
                ...state, //we spread everything else in state prop
                currentUser: action.payload
            };
        default: 
            return state;
    };
};

export default userReducer;

//every single reducer gets every single action that gets fired 
//even if it does not relate to the reducer. Hence the default switch
//back to state (parameter).