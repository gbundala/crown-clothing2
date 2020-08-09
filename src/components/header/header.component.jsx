import React from "react";
import "./header.styles.scss";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import { connect } from "react-redux";
import CartIcon from "../cart-icon/cart-icon.component";
import CartDropdown from "../cart-dropdown/cart-dropdown.component";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selector";
import { selectCartHidden } from "../../redux/cart/cart.selectors";
import { signOutStart } from "../../redux/user/user.actions";

const Header = ({ currentUser, hidden, signOutStart }) => {
  return (
    <div className="header">
      <Link className="logo-container" to="/">
        <Logo className="logo" />
      </Link>
      <div className="options">
        <Link className="option" to="/shop">
          SHOP
        </Link>
        <Link className="option" to="/contact">
          CONTACT
        </Link>
        {currentUser ? (
          <div className="option" onClick={signOutStart}>
            SIGN OUT
          </div>
        ) : (
          <Link className="option" to="/signin">
            SIGN IN
          </Link>
        )}
        <CartIcon />
      </div>
      {hidden ? null : <CartDropdown />}
    </div>
  );
};

//this is the function that allows us to access the state from reducers.
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden,
});

const mapDispatchToProps = (dispatch) => ({
  signOutStart: () => dispatch(signOutStart()),
});
// state.user.currentUser is destructured
//we destructure user off of state and what we want is currentUser

export default connect(mapStateToProps, mapDispatchToProps)(Header);

//connect is a higher order component (HOC) that lets us modify
//our react components to lets us have access to redux stuff in our
//react components (to things related to redux)
//a HOC is a component that takes in another component as its parameter
//and returns a 'supped up' component; in this case -- one that can
//take things related to redux hence the ability of the header component
//to connet to reducers and pull in the 'currentUser' state
//NOTE: we are getting the state from the root reducer, that pulls
//from the user reducer that ultimately gets its state updated from
//the actions of the 'user.actions.js'.
//the mapStateToProps and reducers we will use anywhere that
//we would need props from our reducers
