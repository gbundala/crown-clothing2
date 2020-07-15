export const setCurrentUser = user => ({
    type: 'SET_CURRENT_USER',//this string should never change (hence the use of capital & snake case_)
    payload: user
});