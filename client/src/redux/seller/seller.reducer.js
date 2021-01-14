import SellerActionTypes from "./seller.types";

const INITIAL_STATE = {
  progress: 0,
  imageUrl: "",
};

const sellerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SellerActionTypes.SELLER_FILE_UPLOAD_STATUS:
      return {
        ...state,
        progress: action.payload,
      };
    case SellerActionTypes.SELLER_FILE_UPLOAD_COMPLETE:
      return {
        ...state,
        imageUrl: action.payload,
      };
    default:
      return state;
  }
};

export default sellerReducer;
