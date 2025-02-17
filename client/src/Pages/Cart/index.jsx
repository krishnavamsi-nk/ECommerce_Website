import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Quantitybox from "../../Components/Quantitybox";
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { FaCartArrowDown } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Mycontext } from "../../App";
import { FaCalendarCheck } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { SiPaypal } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const VITE_STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const apiUrl = import.meta.env.VITE_BASE_URL;

const Cart = () => {
  const [updatedCart, setUpdateCart] = useState({});
  const context = useContext(Mycontext);
  const history = useNavigate();

  const removeItem = (id) => {
    deleteData("/api/cart/", id).then((res) => {
      if (res.success !== false) {
        context.setAlertBox({
          msg: "The Item removed from Cart!",
          color: "success",
          open: true,
        });

        fetchDataFromApi("/api/cart").then((ress) => {
          console.log("res:", ress);
          context.setTotalCartsData(ress);
        });
      } else {
        context.setAlertBox({
          msg: res.msg,
          color: "error",
          open: true,
        });
      }
    });
  };

  const checkoutLink = () => {
    history("/checkout");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
        console.log("res:", res);
        context.setTotalCartsData(res);
      });
    } else {
      context.setTotalCartsData([]);
    }
  }, [context.quantity, context.user]);

  useEffect(() => {
    console.log("All Context Data:", {
      checkOut: context.checkOut,
      totalCartData: context.totalCartData,
      totalItems: context.totalItems,
      totalCost: context.totalCost,
    });
  }, [context]); // The dependency array includes 'context' to ensure effect runs when context changes.

  useEffect(() => {
    const items =
      context.totalCartData?.length !== 0 &&
      context.totalCartData
        ?.map((item) => item.quantity)
        .reduce((total, value) => total + value, 0);
    context.setTotalItems(items);
    // console.log("the items:",items);
    const itemscost =
      context.totalCartData?.length !== 0 &&
      context.totalCartData
        ?.map((item) => parseInt(item.quantity * item.price))
        .reduce((total, value) => total + value, 0);
    // console.log("the cost:",itemscost);
    context.setTotalCost(itemscost);
  }, [context.totalCartData]);

  const checkout = async () => {
    const stripe = await loadStripe(VITE_STRIPE_PUBLISHABLE_KEY);

    const cartProducts = context.totalCartData.map((product) => ({
      productId: product?.prodId,
      name: product?.name,
      images: product?.images,
      price: product?.price,
      quantity: product?.quantity,
      total: parseInt(product?.quantity * product?.price),
    }));

    const user = JSON.parse(localStorage.getItem("user"));

    const body = {
      products: cartProducts,
      userId: user.userId,
      data: context.orderData,
    };

    console.log("this is the Body:", body);

    const response = await fetch(`${apiUrl}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const session = await response.json();
    console.log("the Pay:", session);
    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    } else {
      localStorage.setItem("mainloader", "false");
      history("/order");
    }

    deleteData("/api/cart", "/deletecart/all");
    context.setCheckOut(false);
    context.setTotalCartsData([]);
    context.setTotalItems(0);
    context.setTotalCost(0);
  };

  return (
    <>
      <section className="section p-4 cart-page">
        <div
          className="container"
          style={{ maxWidth: "1260px", border: "1px solid rgba(0,0,0,0.3)" }}
        >
          <h2 className="mt-4 mb-2">Cart Details</h2>
          <p>
            There are{" "}
            <b className="text-danger">{context.totalCartData?.length}</b>{" "}
            Products in the cart
          </p>

          <div className="row">
            <div className="col-md-9">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Sub Total</th>
                      <th>Remove</th>
                    </tr>
                  </thead>

                  <tbody>
                    {context.totalCartData?.length !== 0 &&
                      context.totalCartData?.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <Link to={`/product/${item.prodId}`}>
                              <div className="cartitemimg d-flex align-items-center">
                                <div className="imgwrapper">
                                  <img
                                    src={item.images}
                                    alt=""
                                    className="w-100"
                                  />
                                </div>

                                <div className="info">
                                  <h6>{item.name.substr(0, 30) + "..."}</h6>
                                  <Rating
                                    name="read-only"
                                    value={4}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                  />
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td>${item.price}.00</td>
                          <td className="table-qbox">
                            <Quantitybox
                              value={item.quantity}
                              cartdata={item}
                            />
                          </td>
                          <td>${item.subTotal}.00</td>
                          <td>
                            <Button
                              className="remove"
                              onClick={() => removeItem(item.id)}
                            >
                              <IoClose />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-3 pl-1">
              <div className="card border p-3 cartdetails">
                <h4>CART TOTALS</h4>
                <div className="d-flex flex-column" style={{ gap: "20px" }}>
                  <div className="d-flex align-items-center">
                    <span>SubTotal</span>
                    <span className="ml-auto text-danger font-weight-bold">
                      $
                      {context.totalCartData?.length !== 0 &&
                        context.totalCartData
                          ?.map((item) => parseInt(item.price) * item.quantity)
                          .reduce((total, value) => total + value, 0)}
                      .00
                    </span>
                  </div>

                  <div className="d-flex align-items-center">
                    <span>Shipping</span>
                    <span className="ml-auto font-weight-bold">Free</span>
                  </div>

                  <div className="d-flex align-items-center">
                    <span>Estimate For</span>
                    <span className="ml-auto">
                      <b>United Kingdom</b>
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span>Total</span>
                    <span className="ml-auto text-danger font-weight-bold">
                      $
                      {context.totalCartData?.length !== 0 &&
                        context.totalCartData
                          ?.map((item) => parseInt(item.price) * item.quantity)
                          .reduce((total, value) => total + value, 0)}
                      .00
                    </span>
                  </div>
                  <div className="pl-2 ">
                    {context.checkOut !== true ? (
                      <Button
                        onClick={checkoutLink}
                        className="button-cart p-2 mt-1 w-100 text-white d-flex"
                        style={{ backgroundColor: "rgb(11 88 203)" }}
                      >
                        <FaCalendarCheck
                          className="mr-2"
                          style={{ fontSize: "15px", marginBottom: "3px" }}
                        />
                        <span>Click to CheckOut</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={checkout}
                        className="button-cart red p-2 mt-1 w-100 text-white d-flex"
                      >
                        <SiPaypal
                          className="mr-2"
                          style={{ fontSize: "15px", marginBottom: "3px" }}
                        />
                        <span>Payment</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
