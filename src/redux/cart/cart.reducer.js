import { CartActionTypes } from "./cart.types";
import { addItemToCart, removeItemFromCart } from "./cart.utils";

const INITIAL_STATE = {
    hidden: true,
    cartItems: [],
};

const cartReducer = ( state = INITIAL_STATE, action ) => {
    switch (action.type) {
        case CartActionTypes.TOGGLE_CART_HIDDEN:
            return {
                ...state,
                hidden: !state.hidden
            };
        case CartActionTypes.ADD_ITEM:
            return {
                ...state,//we spread everything in our state.
                cartItems: addItemToCart(state.cartItems, action.payload)
            };
        case CartActionTypes.CLEAR_ITEM_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    cartItem => cartItem.id !== action.payload.id
                )//filter gives us back a new array where the condition above is true
                //which is the array of cartItems which are not equal to the action.payload
                //for clearing items from cart as filter returns the array that aligns 
                //with the condition which is true -- hence the remained item are put in this new array
            };
        case CartActionTypes.REMOVE_ITEM:
            return {
                ...state,
                cartItems: removeItemFromCart(state.cartItems, action.payload)
            };
        default: 
            return state;
    }
}

export default cartReducer;