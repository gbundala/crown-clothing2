const SellerItem = ({ item }) => {
  const { name, price, imageUrl } = item;
  return (
    <div className="collection-item">
      <div
        className="image"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <div className="collection-footer">
        <span className="name">{name}</span>
        <span className="price">{price}</span>
      </div>
      {addLikedItemExists ? (
        <LikedIcon
          inverted
          toggleLikedItem
          onClick={() => {
            addLikedItem(item);
            toggleLikedItem();
          }}
        />
      ) : null}

      <CustomButton inverted onClick={() => addItem(item)}>
        Add to cart
      </CustomButton>
    </div>
  );
};
