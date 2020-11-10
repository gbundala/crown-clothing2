import { CartActionTypes } from "./cart.types";

export const toggleCartHidden = () => ({
  type: CartActionTypes.TOGGLE_CART_HIDDEN,
});

export const addItem = (item) => ({
  type: CartActionTypes.ADD_ITEM,
  payload: item,
});

export const clearItemFromCart = (item) => ({
  type: CartActionTypes.CLEAR_ITEM_FROM_CART,
  payload: item,
});

export const removeItem = (item) => ({
  type: CartActionTypes.REMOVE_ITEM,
  payload: item,
});

export const clearCart = () => ({
  type: CartActionTypes.CLEAR_CART,
});

export const cartItemsStoreStart = () => ({
  type: CartActionTypes.CART_ITEMS_STORE_START,
});

export const cartItemsStoreSuccess = (cartItems) => ({
  type: CartActionTypes.CART_ITEMS_STORE_SUCCESS,
  payload: cartItems,
});

export const cartItemsStoreFailure = (error) => ({
  type: CartActionTypes.CART_ITEMS_STORE_FAILURE,
  payload: error,
});

export const fetchCartCollectionsSuccess = (collectionMap) => ({
  type: CartActionTypes.FETCH_CART_COLLECTION_SUCCESS,
  payload: collectionMap,
});

export const fetchCartCollectionsFailure = (error) => ({
  type: CartActionTypes.FETCH_CART_COLLECTION_FAILURE,
  payload: error,
});
