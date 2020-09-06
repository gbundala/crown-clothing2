import React from "react";
import "./liked-item.styles.scss";

const LikedItem = ({ item: { imageUrl, price, name, quantity } }) => {
  return (
    <div className="liked-item">
      <img src={imageUrl} alt="item" />
      <div className="item-details">
        <span className="name">{name}</span>
        <span className="price">
          {quantity} x ${price}
        </span>
      </div>
    </div>
  );
};

export default LikedItem;
