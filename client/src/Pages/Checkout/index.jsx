import React from "react";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect, useContext } from "react";
import { Mycontext } from "../../App";
import { FaCalendarCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { postData } from "../../utils/api";
const Razor_key = import.meta.env.VITE_RAZORPAY_KEY_ID;
const Razor_Secret = import.meta.env.VITE_RAZORPAY_KEY_SECRET;
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const Checkout = () => {
  const [con, setcon] = useState("");
  const [fields, setFields] = useState({
    name: "",
    country: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    paymentId: "",
  });

  const history = useNavigate();

  const validateForm = (updatedform) => {
    const fields = updatedform;
    if (!fields.name) return "Please fill the name";
    if (!fields.country) return "Please fill the country";
    if (!fields.address) return "Please fill the address";
    if (!fields.apartment) return "Please provide apartment";
    if (fields.city === "") return "Please provide your city";
    if (fields.state === "") return "Please provide your state";
    if (fields.zipCode === "") return "Please provide your zipCode";
    if (fields.phoneNumber === "") return "Please provide your phoneNumber";
    if (fields.email === "") return "Please provide your email";

    return null; // Valid
  };

  const onChangeInput = (e) => {
    const {
      target: { name, value },
    } = e;

    setFields((prevs) => ({
      ...prevs,
      [name]: value,
    }));
  };

  const context = useContext(Mycontext);

  const handleChangeCountry = (event) => {
    setcon(event.target.value);
    setFields({
      ...fields,
      country: event.target.value,
    });
  };



  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 200, // Set max height for the dropdown
        width: 250, // Set width for dropdown items
      },
    },
  };

  const Checkout = (e) => {
    e.preventDefault();

    console.log("the form:", fields);
    fields.amount = context.totalcost;
    const user = JSON.parse(localStorage.getItem("user"));

    if(user){
      fields.userId = user.userId;
    }

    const validationMessage = validateForm(fields);
    if (validationMessage) {
      context.setAlertBox({
        open: true,
        msg: validationMessage,
        color: "error",
      });
      return;
    }

    context.setOrderData(fields);
    context.setCheckOut(true);
    history("/cart");
  };

  return (
    <>
      <div className="section">
        <div className="container1 checkout-page">
          <form action="" className="form-section" onSubmit={Checkout}>
            <div className="row">
              <div className="col-md-8">
                <h5 className="hd">Billing Details</h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-2">
                      <TextField
                        className="w-100"
                        name="name"
                        label="First name"
                        value={fields.name ?? ""}
                        variant="outlined"
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-2">
               <FormControl
                        className="w-100"
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Country
                        </InputLabel>
                        <TextField
                          className="country"
                          name="country"
                          value={con}
                          label="Country"
                          variant="outlined"
                          onChange={handleChangeCountry}
                        />
                      </FormControl>
                    </div>
                  </div>
                </div>

                <h6 className="hd">Address/Street</h6>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mt-2">
                      <TextField
                        className="w-100"
                        value={fields.address ?? ""}
                        name="address"
                        label="House number and street name"
                        variant="outlined"
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mt-1">
                      <TextField
                        className="w-100"
                        name="apartment"
                        value={fields.apartment ?? ""}
                        label="Apartment , suits, unit(optional) etc"
                        variant="outlined"
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                </div>

                <h6 className="hd">Town/City</h6>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mt-2">
                      <TextField
                        className="w-100"
                        value={fields.city ?? ""}
                        name="city"
                        label="City"
                        variant="outlined"
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                </div>

                <h6 className="hd">State/Central*</h6>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mt-2">
                      <TextField
                        className="w-100"
                        value={fields.state ?? ""}
                        name="state"
                        label="State"
                        variant="outlined"
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                </div>

                <h6 className="hd">postcode /ZIP*</h6>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group mt-2">
                      <TextField
                        className="w-100"
                        name="zipCode"
                        value={fields.zipCode ?? ""}
                        label="postcode"
                        variant="outlined"
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                </div>

                <h6 className="hd">phone Number/Email:</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-2">
                      <TextField
                        className="w-100"
                        name="phoneNumber"
                        value={fields.phoneNumber ?? ""}
                        label="phone"
                        variant="outlined"
                        style={{ height: "10px" }}
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-2">
                      <TextField
                        className="w-100"
                        name="email"
                        value={fields.email ?? ""}
                        label="email"
                        type="email"
                        variant="outlined"
                        onChange={onChangeInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card order-info">
                  <h4 style={{ color: "green" }}>Your Orders</h4>
                  <div className="table-responsive mt-3">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>SubTotal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {context.totalCartData?.length !== 0 &&
                          context.totalCartData?.map((item, index) => (
                            <tr key={item._id}>
                              <td>
                                {item.name.substr(0, 20)}{" "}
                                <b className="text-primary">^{item.quantity}</b>
                              </td>
                              <td>₹{parseInt(item.price) * item.quantity}</td>
                            </tr>
                          ))}

                        <tr>
                          <td style={{ fontWeight: "800" }}>Total</td>
                          <td
                            className="text-danger"
                            style={{ fontWeight: "bold" }}
                          >
                            ₹{context.totalcost}.00
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="">
                      <Button
                        type="submit"
                        className="button-cart p-2 mt-1 w-100 text-white d-flex"
                        style={{ backgroundColor: "rgb(11 88 203)" }}
                      >
                        <FaCalendarCheck
                          className="mr-2"
                          style={{ fontSize: "15px", marginBottom: "3px" }}
                        />
                        <span>Click to Buy</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Checkout;
