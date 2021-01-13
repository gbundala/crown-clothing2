import SellerActionTypes from "./seller.types";

const INITIAL_STATE = {
  progress: 0,
};

const sellerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SellerActionTypes.SELLER_FILE_UPLOAD_STATUS:
      return {
        ...state,
        progress: action.payload,
      };
    default:
      return state;
  }
};

export default sellerReducer;
