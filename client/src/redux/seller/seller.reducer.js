import Seller from "../../pages/seller/seller.component";
import SellerActionTypes from "./seller.types";

const INITIAL_STATE = {
  progress: 0,
  imageUrl: "",
  sellerCollections: null,
};

const sellerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //File upload reducers
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

    //Fetch seller collections reducers
    case SellerActionTypes.FETCH_SELLER_COLLECTIONS_SUCCESS:
      return {
        ...state,
        sellerCollections: action.payload,
      };

    //Default fall back
    default:
      return state;
  }
};

export default sellerReducer;
