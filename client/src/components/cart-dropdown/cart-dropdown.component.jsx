import React from "react";
import "./cart-dropdown.styles.scss";
import CustomButton from "../custom-button/custom-button.component";
import { connect } from "react-redux";
import CartItem from "../cart-item/cart-item.component";
import { selectCartItems } from "../../redux/cart/cart.selectors";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";
import {
  cartItemsStoreStart,
  toggleCartHidden,
} from "../../redux/cart/cart.actions";

const CartDropdown = ({ cartItems, history, dispatch }) => {
  return (
    <div className="cart-dropdown">
      <div className="cart-items">
        {cartItems.length ? (
          cartItems.map((cartItem) => (
            <CartItem key={cartItem.id} item={cartItem} />
          ))
        ) : (
          <span className="empty-message">Your cart is empty</span>
        )}
      </div>
      <CustomButton
        onClick={() => {
          history.push("/checkout");
          dispatch(toggleCartHidden());
          dispatch(cartItemsStoreStart());
        }}
      >
        GO TO CHECKOUT
      </CustomButton>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
});

export default withRouter(connect(mapStateToProps, null)(CartDropdown));
//withRouter takes in the component that is returned from our connect call
//as its parameter/ prop
//withRouter will pass the 'match', 'history' & 'location' objects
//into the component that is being wrapped. Hence the order with
//which we wrap the above HOCs matters
//We want want comes out of the connect component to receive those props
//i.e. match, history & location
//The dispatch prop is automatically pulled from connect even
//without specificially mentioning it, that is why we have been
//able to use it in onClick toggleCartHidden after destructured
//dispatch off of props.
