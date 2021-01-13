import SellerActionTypes from "./seller.types";

export const sellerFileUploadStatus = (progressStatus) => ({
  type: SellerActionTypes.SELLER_FILE_UPLOAD_STATUS,
  payload: progressStatus,
});
