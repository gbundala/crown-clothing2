import ShopActionTypes from "./shop.types";

const INITAL_STATE = {
  collections: null,
  isFetching: false,
  errorMessage: undefined,
};

const shopReducer = (state = INITAL_STATE, action) => {
  switch (action.type) {
    // Fetch Collections Reducers
    case ShopActionTypes.FETCH_COLLECTIONS_START:
      return {
        ...state,
        isFetching: true,
      };
    case ShopActionTypes.FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        collections: action.payload,
      };
    case ShopActionTypes.FETCH_COLLECTIONS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload,
      };

    // Store Collections Reducers
    case ShopActionTypes.COLLECTION_ITEMS_STORE_FAILURE:
      return {
        ...state,
        errorMessage: action.payload,
      };

    // Default fall back
    default:
      return state;
  }
};

export default shopReducer;
