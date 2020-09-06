import LikedActionTypes from "./liked.types";

export const toggleLikedHidden = () => ({
  type: LikedActionTypes.TOGGLE_LIKED_HIDDEN,
});

export const addLikedItem = (item) => ({
  type: LikedActionTypes.ADD_LIKED_ITEM,
  payload: item,
});

export const toggleLikedItem = (item) => ({
  type: LikedActionTypes.TOGGLE_LIKED_ITEM,
  payload: item,
});
