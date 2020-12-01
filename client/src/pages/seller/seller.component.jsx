import React, { Component } from "react";
import "./seller.styles.scss";

import CustomButton from "../../components/custom-button/custom-button.component";
import FormInput from "../../components/form-input/form-input.component";
import CollectionItem from "../../components/collection-item/collection-item.component";

class Seller extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      price: "",
      imageUrl: "",
      collection: "",
    };
  }

  //LEARN: revisit how to implement this method.
  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, price, imageUrl, collection } = this.state;

    console.log("seller form submitted");
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { name, price, imageUrl, collection } = this.state;
    return (
      <div className="seller-page-setup">
        <div className="seller-form">
          <h2 className="title">
            I want to upload my products on Crown Clothing
          </h2>
          <span>Fill the form below below to upload</span>
          <form className="sign-up-form" onSubmit={this.handleSubmit}>
            <FormInput
              type="text"
              name="name" //this is the prop in the object.
              value={name}
              handleChange={this.handleChange}
              label="name"
              required
            />
            <FormInput
              type="number"
              name="price"
              value={price}
              handleChange={this.handleChange}
              label="price"
              required
            />
            <FormInput
              type="url"
              name="imageUrl"
              value={imageUrl}
              handleChange={this.handleChange}
              label="Image Url"
              required
            />
            <FormInput
              type="checkbox"
              name="collection"
              value={collection}
              handleChange={this.handleChange}
              label="Collection"
              required
            />
            <CustomButton type="submit">PREVIEW</CustomButton>
            <CustomButton type="submit">UPLOAD</CustomButton>
          </form>
        </div>
        {/* <div>create a separate component for the collection item to be used here</div> */}
      </div>
    );
  }
}

export default Seller;
