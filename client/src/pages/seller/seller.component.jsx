import React, { useState } from "react";
import "./seller.styles.scss";

import CustomButton from "../../components/custom-button/custom-button.component";
import FormInput from "../../components/form-input/form-input.component";
import CollectionItem from "../../components/collection-item/collection-item.component";
import { selectCartItems } from "../../redux/cart/cart.selectors";

const Seller = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [collection, setCollection] = useState("");
  const [newItems, setNewItems] = useState([]);

  //LEARN: revisit how to implement this method.
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("seller form submitted");
    setNewItems([name]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setName(value);
    setPrice(value);
    setImageUrl(value);

    // this.setState({ [name]: value });
  };

  return (
    <div className="seller-page-setup">
      <div className="seller-form">
        <h2 className="title">
          I want to upload my products on Crown Clothing
        </h2>
        {/* TODO: Connect this feature to Firestore and set it live */}
        <span>Fill the form below below to upload you items</span>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <FormInput
            type="text"
            name="name" //this is the prop in the object.
            value={name}
            handleChange={handleChange}
            label="name"
            required
          />
          <FormInput
            type="number"
            name="price"
            value={price}
            handleChange={handleChange}
            label="price"
            required
          />
          <FormInput
            type="url"
            name="imageUrl"
            value={imageUrl}
            handleChange={handleChange}
            label="Image Url"
            // required
          />
          <FormInput
            type="select"
            name="collection"
            value={collection}
            handleChange={handleChange}
            label="Collection"
            // required
          />
          <select id="collection" name="collection">
            <option value="Hats">Hats</option>
            <option value="Jackets">Jackets</option>
            <option value="Sneakers">Sneakers</option>
            <option value="Womens">Womens</option>
            <option value="Mens">Mens</option>
          </select>
          <div className="seller-form-buttons">
            <CustomButton type="submit">PREVIEW</CustomButton>
            <CustomButton type="submit">UPLOAD</CustomButton>
          </div>
        </form>
      </div>
      <div className="new-items">
        {newItems.map((item) => (
          <CollectionItem item={item} />
        ))}
      </div>
    </div>
  );
};

export default Seller;
