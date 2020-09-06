import React from "react";
import "./liked-icon.styles.scss";
import { ReactComponent as Heart } from "../../assets/heart.svg";

const LikedIcon = ({ inverted, toggleLikedItem, ...otherProps }) => {
  return (
    <div className="liked-icon" {...otherProps}>
      <Heart
        className={`${inverted ? "inverted" : ""} ${
          toggleLikedItem ? "toggle-liked-item" : ""
        } heart-icon`}
      />
    </div>
  );
};

export default LikedIcon;
