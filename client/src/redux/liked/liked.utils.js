export const addItemToLiked = (likedItems, likedItemToAdd) => {
  const existingLikedItem = likedItems.find(
    (likedItem) => likedItem.id === likedItemToAdd.id
  );

  if (existingLikedItem) {
    alert("Wow! You love this item already😉");
    return likedItems.map((likedItem) =>
      likedItem.id === likedItemToAdd.id ? { ...likedItem } : likedItem
    );
  }

  return [...likedItems, { ...likedItemToAdd }];
};
