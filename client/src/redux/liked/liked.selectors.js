import { createSelector } from "reselect";

const selectLiked = (state) => state.liked;

export const selectLikedHidden = createSelector(
  [selectLiked],
  (liked) => liked.hiddenLiked
);

export const selectLikedItems = createSelector(
  [selectLiked],
  (liked) => liked.likedItems
);

export const selectLikedItemToggle = createSelector(
  [selectLiked],
  (liked) => liked.likedItemToggle
);
