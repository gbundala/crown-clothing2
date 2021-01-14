// React--Redux Imports
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Imports from other files
import "./seller.styles.scss";
import CustomButton from "../../components/custom-button/custom-button.component";
import FormInput from "../../components/form-input/form-input.component";
import CollectionItem from "../../components/collection-item/collection-item.component";
import {
  collectionItemsStoreStart,
  sellerFileUploadStart,
} from "../../redux/shop/shop.actions";

//Formik Import
import { useField, Form, Formik } from "formik";
import * as Yup from "yup";

const Seller = () => {
  //Image file upload states and progressBar selector
  const [imageURI, setImageURI] = useState(null);
  const progressUpdate = useSelector((state) => state.seller.progress);

  //Input Fields
  const MyInputField = (props) => {
    const [field, meta] = useField(props);

    return (
      <>
        <FormInput {...field} {...props} />
        {meta.touched && meta.error ? <div>{meta.error}</div> : null}
      </>
    );
  };

  const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return (
      <div className="group">
        <select {...field} {...props} className="form-input" />
        {label ? (
          <label
            className={`${props.length ? "shrink" : "shrink"} form-input-label`}
          >
            {label}
          </label>
        ) : null}
        {meta.touched && meta.error ? <div>{meta.error} </div> : null}
      </div>
    );
  };

  //useDispatch react-redux binding
  const dispatch = useDispatch();

  //Formik Props
  const yupSchema = Yup.object({
    name: Yup.string()
      .max(30, "Must be at most 30 characters")
      .required("Required"),
    price: Yup.number()
      .required("Required")
      .integer("Must be an integer")
      .positive("Must be a positive integer"),
    imageUrl: Yup.string().url("Must be URL").required("Required"),
    collection: Yup.string()
      .oneOf(
        [
          "Czx1Zdbee5NA1rcKExMI",
          "ZsECPU5cs5rMJihxzgzh",
          "ELkNhPZaZMEFvMqnI8XP",
          "CUbKnZZ0qf0055Fz4K9h",
          "CeJTRVox79x7klhmsmBP",
        ],
        "Invalid Collection"
      )
      .required("Required"),
  });

  const initialValues = {
    name: "",
    price: "",
    imageUrl: "",
    collection: "",
  };

  const formikHandleSubmit = async (values, { setSubmitting }) => {
    //FIXME: Remove unnecessary dispatches here
    console.log("Storing action to be fired");
    dispatch(collectionItemsStoreStart(values));
    console.log("Storing start action fired: ", values);
    setSubmitting(false);
  };

  // const handleFileUploadSubmission = (event) => {
  //   // event.preventDefault();
  // };

  const handleFileUploadPreview = (event) => {
    //FIXME: Account for the momery leaks in using this API
    const file = URL.createObjectURL(event.target.files[0]);
    console.log(file);

    setImageURI(file);

    console.log(event.target.files[0]);
    const uploadFile = event.target.files[0];

    dispatch(sellerFileUploadStart(uploadFile));
    console.log("File uploaded: ", uploadFile);
  };

  //Rendering
  return (
    <div className="seller-page-setup">
      <div className="seller-form">
        <h2 className="title">
          I want to upload my products on Crown Clothing
        </h2>
        {/* TODO: Connect this feature to Firestore and set it live */}
        <span>Fill the form below below to upload you items</span>

        <Formik
          initialValues={initialValues}
          validationSchema={yupSchema}
          onSubmit={formikHandleSubmit}
        >
          {/* TODO: Confirm if the disable prop is actually working in the buttons */}
          {({ isSubmitting }) => (
            <Form className="sign-up-form">
              <MyInputField name="name" type="text" label="Item Name" />

              <MyInputField name="price" type="number" label="price" />

              {/* FIXME: Remove this and update the code */}
              <MyInputField name="imageUrl" type="url" label="Image Url" />

              <MySelect name="collection" label="Collection">
                <option value="">Select a collection</option>
                <option value="Czx1Zdbee5NA1rcKExMI">Hats</option>
                <option value="ZsECPU5cs5rMJihxzgzh">Jackets</option>
                <option value="ELkNhPZaZMEFvMqnI8XP">Sneakers</option>
                <option value="CUbKnZZ0qf0055Fz4K9h">Womens</option>
                <option value="CeJTRVox79x7klhmsmBP">Mens</option>
              </MySelect>

              <div className="seller-form-buttons">
                <CustomButton type="submit" disabled={isSubmitting}>
                  PREVIEW
                </CustomButton>
                <CustomButton type="submit" disabled={isSubmitting}>
                  UPLOAD
                </CustomButton>
              </div>
            </Form>
          )}
        </Formik>
        <br></br>
        {/* TODO: Should use Formik here and merge in the above form? */}
        <form className="uploader-form">
          <progress
            id="uploadProgress"
            name="uploadProgress"
            value={progressUpdate}
            max="100"
          >
            0%
          </progress>
          <FormInput
            id="fileButton"
            name="fileButton"
            type="file"
            onChange={handleFileUploadPreview}
          />
          <img src={imageURI} height="215px" width="165px" />
          <CustomButton type="submit">Upload photo</CustomButton>
        </form>
      </div>
      {/* <div className="new-items">
        {newItems.map((item) => (
          <CollectionItem item={item} />
        ))}
      </div> */}
    </div>
  );
};

export default Seller;
