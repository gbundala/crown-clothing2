import React from "react";
import "./liked.styles.scss";
import CollectionItem from "../../components/collection-item/collection-item.component";
import { createStructuredSelector } from "reselect";
import { selectLikedItems } from "../../redux/liked/liked.selectors";
import { connect } from "react-redux";

const LikedItemsPage = ({ likedItems }) => {
  return (
    <div className="liked-items-page">
      <div className="items">
        {" "}
        {likedItems.map((likedItem) => (
          <CollectionItem key={likedItem.id} item={likedItem} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  likedItems: selectLikedItems,
});

export default connect(mapStateToProps)(LikedItemsPage);
