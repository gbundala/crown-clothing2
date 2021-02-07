//Imports
import SellerActionTypes from "./seller.types";

//Seller file upload actions
export const sellerFileUploadStatus = (progressStatus) => ({
  type: SellerActionTypes.SELLER_FILE_UPLOAD_STATUS,
  payload: progressStatus,
});

export const sellerFileUploadComplete = (imageUrl) => ({
  type: SellerActionTypes.SELLER_FILE_UPLOAD_COMPLETE,
  payload: imageUrl,
});

//Fetch Seller Collections actions
export const fetchSellerCollectionsStart = () => ({
  type: SellerActionTypes.FETCH_SELLER_COLLECTIONS_START,
});

export const fetchSellerCollectionsSuccess = (collectionsMap) => ({
  type: SellerActionTypes.FETCH_SELLER_COLLECTIONS_SUCCESS,
  payload: collectionsMap,
});
