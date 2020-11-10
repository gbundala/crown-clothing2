//ADD ITEM TO CART
export const addItemToCart = (cartItems, cartItemToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToAdd.id
  );

  //FIXME: Put a condition to return from this function is the user is not signed in or to redirect to signIn page
  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === cartItemToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...cartItemToAdd, quantity: 1 }];
};

//REMOVE ITEM FROM CART UTIL
export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }

  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

//...cartItem: Here we have spread the other cart item props
//i.e. name, price & imageUrl all remain the same on the state/view
//while the only one that changes is the quantity that is lowered by 1
//NOTE: the spread operator ... spreads the props within that prop/object
//in this case within the cartItem prop/object we have the props -- name, price, qty, imageUrl, etc
//so these are the ones being spread here or actually rendered in the view
