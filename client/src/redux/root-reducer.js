//REDUX METHODS IMPORTS
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//REDUCERS IMPORTS
import userReducer from "./user/user.reducer";
import cartReducer from "./cart/cart.reducer";
import directoryReducer from "./directory/directory.reducer";
import shopReducer from "./shop/shop.reducer";
import likedReducer from "./liked/liked.reducer";
import sellerReducer from "./seller/seller.reducer";

//REDUX PERSIST
const persistConfig = {
  key: "root", //essentially at what point in our reducer we want to start storing -- from the root
  storage, //this is essentiall the same as writing storage: storage
  whitelist: ["cart"], //all we want to persist is the cart for now as the user is already handled by firebase
};

//ROOT REDUCER
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  directory: directoryReducer,
  shop: shopReducer,
  liked: likedReducer,
  seller: sellerReducer,
});

export default persistReducer(persistConfig, rootReducer);
