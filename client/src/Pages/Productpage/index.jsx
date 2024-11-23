import Button from "@mui/material/Button";
import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import Quantitybox from "../../Components/Quantitybox";
import { FaCartArrowDown } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import RelatedProducts from "./RelatedProducts";
import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import { Mycontext } from "../../App";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegCircleUser } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";

const ProductPage = () => {
  const [activeSize, setActive] = useState(null);
  const [activeWeight, setActiveSize] = useState(null);
  const [activeRam, setActiveRam] = useState(null);
  const [value, setValue] = useState(2);
  const [productData, setProductData] = useState({});
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [recentProducts, setRecentProducts] = useState({});
  const context = useContext(Mycontext);
  const [taberror, setTabError] = useState(null);
  const [call, setCall] = useState(true);
  const [prodReviews, setProdReviews] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const [addedWishList, setAddedWishList] = useState(false);

  const [activetabs, setActivetabs] = useState(0);
  const [reviews, setReviews] = useState({
    customerName: "",
    productId: "",
    review: "",
    customerId: "",
    customerRating: 1,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDataFromApi(`/api/mylist?prodId=${id}&userId=${user.userId}`).then(
        (res) => {
          console.log("T :" ,res);
          if (res.success ===false) {
            console.log("the list1:",res);
            setAddedWishList(false);
          }else{
            console.log("the list:",res);
            setAddedWishList(true);
          }
        }
      );
    }
  }, [location.pathname]);



  const addToMylist = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const fields = {
        name: productData.name,
        images: productData.images[0],
        rating: productData.rating,
        price: productData.discountPrice,
        prodId: id,
        userId: user.userId,
      };
      postData("/api/mylist/add", fields).then((res) => {
        if (res.success !== false) {
          context.setAlertBox({
            msg: res.msg,
            open: true,
            color: "success",
          });
          setAddedWishList(true);
        } else {
          context.setAlertBox({
            msg: res.msg,
            open: true,
            color: "error",
          });
        }
      });
    } else {
      context.setAlertBox({
        msg: "Please Login to Add to WishList",
        color: "error",
        open: true,
      });
    }
  };

  const AddToCart = (data) => {
    if (
      activeSize !== null ||
      activeRam !== null ||
      activeWeight !== null ||
      (productData?.productWEIGHT[0] === "" &&
        productData?.productRAM[0] === "" &&
        productData?.productSIZE[0] === "")
    ) {
      context.addToCart(data);
    } else {
      setTabError(true);
    }
  };

  useEffect(() => {
    // Reset the state when the URL changes
    setActive(null);
    setActiveSize(null);
    setActiveRam(null);
  }, [location.pathname]); // This effect runs every time the pathname changes



  const isActive = (ind) => {
    setActive(ind);
    setTabError(false);
  };
  const isActiveSize = (ind) => {
    setActiveSize(ind);
    setTabError(false);
  };
  const isActiveRam = (ind) => {
    setActiveRam(ind);
    setTabError(false);
  };

  const { id } = useParams();

  const inputChange = (e) => {
    setReviews({
      ...reviews,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name);
    }

    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      setProductData(res);
      console.log("res:",res);

      fetchDataFromApi(`/api/product?subCat=${res.subCatId}`).then((res) => {
        const filteredData = res?.product?.filter((item) => item.id !== id);
        console.log("filter:",res);
        setRelatedProductData(filteredData);
      });

      postData(`/api/product/recentlyProducts`, res) // Pass data instead of `res`
        .then(() => {
          fetchDataFromApi("/api/product/recentlyProducts/get").then((res) => {
            setRecentProducts(res);
          }); // Ensure this only runs if postData succeeds
        });
    });
  }, [id]);

  useEffect(() => {
    if (call === true) {
      fetchDataFromApi(`/api/review?productId=${id}`).then((res) => {
        if (res.success !== false && Array.isArray(res)) {
          setProdReviews(res);
          console.log("Fetched reviews:", res);
        } else {
          setProdReviews([]); // Handle cases where the response is not an array
        }
      });
    }
  }, [call, location.pathname]);

  const submitReview = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const fields = {
        ...reviews,
        productId: id,
        customerId: user.userId,
        customerRating: value,
      };

      setReviews(fields);
      console.log("this is the sent:", fields);

      postData("/api/review/add", fields).then((res) => {
        console.log("this is res:", res);
        setCall(true);
        setValue(2);

        setReviews({
          customerName: "",
          productId: "",
          review: "",
          customerId: "",
          customerRating: 1,
        });
        setTimeout(() => {
          setIsLoading(false);
          context.setAlertBox({
            msg: "The Review is Added",
            color: "success",
            open: true,
          });
        }, 1500);
      });
    } else {
      setIsLoading(false);
      setReviews({
        customerName: "",
        productId: "",
        review: "",
        customerId: "",
        customerRating: 1,
      });
      setValue(2);
      context.setAlertBox({
        msg: "Please LogIn to Add Review",
        color: "errpr",
        open: true,
      });
    }
    setCall(null);
  };
  return (
    <>
      <div
        className="productDetails section containerimpo"
        style={{ width: "1400px", marginLeft: "5%", marginRight: "5%" }}
      >
        <div className="row">
          <div className="col-md-4">
            <ProductZoom
              discount={productData.discount}
              imagesdata={productData.images}
            />
          </div>
          <div className="col-md-8 pr-5 pt-2">
            <div className="container">
              <h4 className="text-capitalize">{productData.name}</h4>
              <ul className="list list-inline mb-2 mt-2 d-flex align-items-center">
                <li className="list-inline-item ">
                  <div className="d-flex align-items-center">
                    <span className="text-lightdark mr-2">Brands :</span>
                    <span>{productData.brand}</span>
                  </div>
                </li>
                <li className="rating list-inline-item">
                  <div className="d-flex align-items-center">
                    <Rating
                      name="disabled"
                      value={parseInt(productData.rating)}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                    <span className="text-lightdark cursor ml-2">
                      {productData.numReviews} Review{" "}
                    </span>
                  </div>
                </li>
              </ul>
              <div className="d-flex info  align-items-center mb-2">
                <span className="oldprice mr-2 ">${productData.price}.00</span>
                <span className="netprice text-danger lg">
                  ${productData.discountPrice}.00
                </span>
              </div>
              <span
                className={`text-white p-1 ${
                  productData.stock === true ? "badge-success" : "badge-danger"
                }`}
                style={{ borderRadius: "10px" }}
              >
                {productData.stock === true ? "In Stock" : "Out Stock"}
              </span>
              <p className="mt-2">{productData.description}</p>

              {productData?.productWEIGHT?.length !== 0 && (
                <div className="productsize d-flex align-items-center">
                  <span className="mr-3">Weight:</span>
                  <ul className="list-inline d-flex align-items-center ulsize">
                    {productData?.productWEIGHT?.length !== 0 &&
                      productData?.productWEIGHT?.map((item, index) => (
                        <li>
                          <a
                            className={`tag ${
                              activeSize === index ? "active" : ""
                            } ${taberror === true ? "error" : ""}`}
                            onClick={() => isActive(index)}
                          >
                            {item}kg
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {productData?.productSIZE?.length !== 0 && (
                <div className="productsize d-flex align-items-center">
                  <span className="mr-3">Size :</span>
                  <ul className="list-inline d-flex align-items-center ulsize">
                    {productData?.productSIZE?.length !== 0 &&
                      productData?.productSIZE?.map((item, index) => (
                        <li>
                          <a
                            className={`tag ${
                              activeWeight === index ? "active" : ""
                            }  ${taberror === true ? "error" : ""}`}
                            onClick={() => isActiveSize(index)}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {productData?.productRAM?.length !== 0 && (
                <div className="productsize d-flex align-items-center">
                  <span className="mr-3">RAMs :</span>
                  <ul className="list-inline d-flex align-items-center ulsize">
                    {productData?.productRAM?.length !== 0 &&
                      productData?.productRAM?.map((item, index) => (
                        <li>
                          <a
                            className={`tag ${
                              activeRam === index ? "active" : ""
                            } ${taberror === true ? "error" : ""}`}
                            onClick={() => isActiveRam(index)}
                          >
                            {item}MB
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="quantitybox d-flex align-items-center mt-3">
                <Quantitybox />
                <Button
                  variant="contained"
                  className="ml-3 btn-round"
                  style={{ padding: "12px 25px" }}
                  onClick={() => AddToCart(productData)}
                >
                  {" "}
                  <FaCartArrowDown /> &nbsp; &nbsp;
                  {`${
                    context.addingCart === true ? "...Adding" : "Add To Cart"
                  }`}
                </Button>
              </div>

              <div className="wishlist mt-4">
                <Button
                  className="mr-4 "
                  onClick={() => {
                    addToMylist(productData.id);
                  }}
                >
                  {addedWishList === true ? (
                    <>
                      <GoHeartFill style={{ color: "rgb(255 38 77)" }} />{" "}
                      &nbsp;Added To WishList
                    </>
                  ) : (
                    <>
                      <FaHeart /> &nbsp;Wishlist
                    </>
                  )}
                </Button>
                <Button>
                  <MdOutlineCompareArrows /> &nbsp; Compare
                </Button>
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="card mt-5 p-5 detailsPageTabs">
          <div className="customtabs">
            <ul className="list list-inline">
              <li className="list-inline-item">
                <Button
                  className={`btn-round text-white activetabs === 0 ? "active" : ""`}
                  onClick={() => setActivetabs(0)}
                >
                  Description
                </Button>
              </li>
              <li className="list-inline-item">
                <Button
                  className={`btn-round text-white activetabs === 1 ? "active" : ""`}
                  onClick={() => setActivetabs(1)}
                >
                  Additional info
                </Button>
              </li>
              <li className="list-inline-item">
                <Button
                  className={`btn-round text-white activetabs === 2 ? "active" : ""`}
                  onClick={() => setActivetabs(2)}
                >
                  Reviews ({productData.numReviews})
                </Button>
              </li>
            </ul>

            <br />

            {activetabs === 0 && (
              <div className="tabContent">
                <p>{productData.description}</p>
              </div>
            )}

            {activetabs === 1 && (
              <div className="tabCont">
                <table className="table">
                  <tbody>
                    <tr className="stand-up">
                      <th>Stand Up</th>
                      <td>
                        <p>35"L x 24"W x 37-45"H(front to back wheel)</p>
                      </td>
                    </tr>
                    <tr className="folded-wo-wheels">
                      <th>Folded (w/o wheels)</th>
                      <td>
                        <p>32.5"L x 18.5"w x 16.5"H</p>
                      </td>
                    </tr>
                    <tr className="folded-w-wheels">
                      <th>Folded (w/ wheels)</th>
                      <td>
                        <p>32.5"L x 24"W x 18.5"H</p>
                      </td>
                    </tr>
                    <tr className="door-pass-through">
                      <th>Door pass through</th>
                      <td>
                        <p>24</p>
                      </td>
                    </tr>
                    <tr className="frame">
                      <th>Frame</th>
                      <td>
                        <p>Aluminum</p>
                      </td>
                    </tr>
                    <tr className="weight-wo-wheels">
                      <th>Weight (w/o wheels)</th>
                      <td>
                        <p>20 LBS</p>
                      </td>
                    </tr>
                    <tr className="weight-capacity">
                      <th>Weight Capacity</th>
                      <td>
                        <p>60 LBS</p>
                      </td>
                    </tr>
                    <tr className="width">
                      <th>Width</th>
                      <td>
                        <p>24"</p>
                      </td>
                    </tr>
                    <tr className="handle-height-ground-to-handle">
                      <th>Handle height (ground to handle)</th>
                      <td>
                        <p>37-45"</p>
                      </td>
                    </tr>
                    <tr className="wheels">
                      <th>Wheels</th>
                      <td>
                        <p>24"</p>
                      </td>
                    </tr>
                    <tr className="seat-back-height">
                      <th>Seat back height</th>
                      <td>
                        <p>21.5"</p>
                      </td>
                    </tr>
                    <tr className="head-room-inside-canopy">
                      <th>Head room (inside canopy)</th>
                      <td>
                        <p>25"</p>
                      </td>
                    </tr>
                    <tr className="pa-color">
                      <th>Color</th>
                      <td>
                        <p>Black,Blue,Red,White</p>
                      </td>
                    </tr>

                    <tr className="pa-size">
                      <th>Size</th>
                      <td>
                        <p>M, 5</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activetabs === 2 && (
              <div className="tabContent">
                <div className="row">
                  <div className="col-md-12 d-flex flex-column">
                    <h3>Customer Questions & Answers</h3>
                    <br />
                    {prodReviews?.length !== 0 &&
                      prodReviews
                        ?.slice()
                        ?.reverse()
                        ?.map((item, index) => (
                          <div
                            key={item.id}
                            className="card reviewscard p-4 flex-row"
                            style={{ backgroundColor: "white" }}
                          >
                            <div className="image d-flex align-items-center w-100">
                              <div className="rounded-circle d-flex flex-column align-items-center">
                                <FaRegCircleUser
                                  style={{
                                    fontSize: "50px",
                                    marginTop: "15px",
                                  }}
                                />
                                <span className="text d-block text-center font-weight-bold mt-2 mb-3">
                                  {item.customerName}
                                </span>
                              </div>
                              <div className="info pl-5">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                  <div>
                                    <h5 className="text-lightdark">
                                      {item?.dateCreated.substr(0, 20)}
                                    </h5>
                                  </div>
                                  <div className="ml-auto mb-2">
                                    <Rating
                                      name="half-rating-read"
                                      defaultValue={2.5}
                                      precision={0.5}
                                      readOnly
                                    />
                                  </div>
                                </div>
                                <p>{item.review}</p>
                              </div>
                            </div>
                            <br className="res-hide" />
                            <br className="res-hide" />
                          </div>
                        ))}
                    <form className="mt-5 reviewform" onSubmit={submitReview}>
                      <h4>Add a review</h4>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          placeholder="Write a Review"
                          name="review"
                          onChange={inputChange}
                          value={reviews.review ?? ""}
                        />
                      </div>

                      <div className="row d-flex align-items-center">
                        <div className="col-md-6">
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`Name Current (${userName})`}
                              name="customerName"
                              onChange={inputChange}
                              value={reviews.customerName ?? ""}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <Rating
                              className="mt-4"
                              name="customerRating"
                              value={value}
                              onChange={(event, newValue) => {
                                setValue(newValue);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <br />

                      <div className="form-group">
                        <Button
                          style={{
                            borderRadius: "10px",
                            outline: "none",
                            backgroundColor: "rgb(11 88 203)",
                            color: "white",
                            border: "1px solid black",
                          }}
                          type="submit"
                          className="btn-g btn-lg"
                        >
                          Submit Review &nbsp;
                          {isloading === true && (
                            <CircularProgress
                              color="inherit"
                              className="ml-2 load"
                            />
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <br />

        <div className="container">
          <RelatedProducts
            title="Related Products"
            relatedProductData={relatedProductData}
          />

          <RelatedProducts
            title="Recently Viewed Products"
            relatedProductData={recentProducts.product}
            viewedProuct={true}
          />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
