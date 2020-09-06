import React from "react";
import "./liked-dropdown.styles.scss";
import LikedItem from "../liked-item/liked-item.component";
import { connect } from "react-redux";
import { selectLikedItems } from "../../redux/liked/liked.selectors";
import { createStructuredSelector } from "reselect";
import { toggleLikedHidden } from "../../redux/liked/liked.actions";
import CustomButton from "../custom-button/custom-button.component";
import { withRouter } from "react-router-dom";

const LikedDropdown = ({ likedItems, history, dispatch }) => {
  return (
    <div className="liked-dropdown">
      <div className="liked-items">
        {likedItems.length ? (
          likedItems.map((likedItem) => (
            <LikedItem key={likedItem.id} item={likedItem} />
          ))
        ) : (
          <span className="empty-message">
            Your list of liked items is empty{" "}
          </span>
        )}
      </div>
      <CustomButton
        onClick={() => {
          history.push("/likeditems");
          dispatch(toggleLikedHidden());
        }}
      >
        LIKED ITEMS
      </CustomButton>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  likedItems: selectLikedItems,
});

export default withRouter(connect(mapStateToProps)(LikedDropdown));
