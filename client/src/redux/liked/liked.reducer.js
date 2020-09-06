import { addItemToLiked } from "./liked.utils";
import LikedActionTypes from "./liked.types";

const INITIAL_STATE = {
  hiddenLiked: true,
  likedItems: [],
  likedItemToggle: false,
};

const likedReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LikedActionTypes.TOGGLE_LIKED_HIDDEN:
      return {
        ...state,
        hiddenLiked: !state.hiddenLiked,
      };
    case LikedActionTypes.ADD_LIKED_ITEM:
      return {
        ...state,
        likedItems: addItemToLiked(state.likedItems, action.payload),
      };
    case LikedActionTypes.TOGGLE_LIKED_ITEM:
      return {
        ...state,
        likedItemToggle: !state.likedItemToggle,
      };
    default:
      return state;
  }
};

export default likedReducer;
