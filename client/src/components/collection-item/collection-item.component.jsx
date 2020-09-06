import React from "react";
import "./collection-item.styles.scss";
import CustomButton from "../custom-button/custom-button.component";
import { addItem } from "../../redux/cart/cart.actions";
import { connect } from "react-redux";
import LikedIcon from "../liked-icon/liked-icon.component";
import {
  addLikedItem,
  toggleLikedItem,
  toggleLikedHidden,
} from "../../redux/liked/liked.actions";
import { createStructuredSelector } from "reselect";
import { selectLikedItemToggle } from "../../redux/liked/liked.selectors";

const CollectionItem = ({
  item,
  addItem,
  addLikedItem,
  addLikedItemExists,
  toggleLikedItem,
}) => {
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

const mapStateToProps = createStructuredSelector({
  toggleLikedItem: selectLikedItemToggle,
});

const mapDispatchToProps = (dispatch) => ({
  addItem: (item) => dispatch(addItem(item)),
  addLikedItem: (item) => dispatch(addLikedItem(item)),
  toggleLikedItem: () => dispatch(toggleLikedItem()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionItem);
