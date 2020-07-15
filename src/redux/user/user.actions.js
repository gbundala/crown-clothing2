import { UserActionTypes } from "./user.types";

export const setCurrentUser = user => ({
    type: UserActionTypes.SET_CURRENT_USER,//this string should never change (hence the use of capital & snake case_)
    payload: user
});