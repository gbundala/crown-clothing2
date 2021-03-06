import React, { Component } from "react";

import "./App.css";
import HomePage from "./pages/homepage/homepage.component";
import Header from "./components/header/header.component";
import ShopPage from "./pages/shop/shop.component";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import CheckoutPage from "./pages/checkout/checkout.component";

import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "./redux/user/user.selector";
import { checkUserSession } from "./redux/user/user.actions";
import LikedItemsPage from "./pages/liked/liked.component";
import Seller from "./pages/seller/seller.component";

class App extends Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { checkUserSession } = this.props;
    checkUserSession();
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route exact path="/likeditems" component={LikedItemsPage} />
          <Route
            exact
            path="/signin"
            render={() =>
              currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />
            }
          />
          <Route exact path="/seller" component={Seller} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  checkUserSession: () => dispatch(checkUserSession()),
});

//STUDYME: This was the initial implementation before reselect
//Reselect is a library for memoization so as to cache the output
//here in order not to fire mapStateToProps each time the App is re-rendered
//even if it has not been directly triggered
// const mapStateToProps = ({ user }) => ({
//   currentUser: user.currentUser//we get access to this.props.currrentUser after putting into connect below
// });

//No need for mapDispatchToProps for setting current user as our Saga is now handling our setCurrent user

export default connect(mapStateToProps, mapDispatchToProps)(App);

//connect has two arguments
//mapDispatchToProps is the second argument
//we have put the first argument to null as we dont need
//mapStateToProps in Appjs as there is no where in here
//that we have used the state of the current user
//hence what we only need here is to send the update of the state
//to the 'user.actions.js'
//we dont need the constructor anymore, hence we have remove it!
//UPDATE: Initially we had null as the first argument in connect()
//but since we have implemented React Router Redirect to have
//the app remove the signIn page after use signs in we have
//therefore needed state in the Appjs file there the
//mapStateToProp function and implementation.
