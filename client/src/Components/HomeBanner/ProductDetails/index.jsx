import Dialog from "@mui/material/Dialog";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Quantitybox from "../../../Components/Quantitybox/index";
import { useContext, useEffect, useState } from "react";
import { Mycontext } from "../../../App";
import ProductZoom from "../../ProductZoom/index";

import { FaHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegCircleUser } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { postData, fetchDataFromApi } from "../../../utils/api";
import { GoHeartFill } from "react-icons/go";

const ProductDetails = (props) => {
  const context = useContext(Mycontext);
  const [isloading, setIsLoading] = useState(false);
  const { data } = props;
  const [taberror, setTabError] = useState(null);
  const [activeSize, setActive] = useState(null);
  const [activeWeight, setActiveSize] = useState(null);
  const [activeRam, setActiveRam] = useState(null);

  const [activetabs, setActivetabs] = useState(0);
  const [addedWishList, setAddedWishList] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDataFromApi(
        `/api/mylist?prodId=${data.id}&userId=${user.userId}`
      ).then((res) => {
        if (res.success === false) {
          console.log(res);
          setAddedWishList(false);
        } else {
          setAddedWishList(true);
        }
      });
    }
  }, [location.pathname]);

  const AddToCart = (data) => {
    if (
      activeSize !== null ||
      activeRam !== null ||
      activeWeight !== null ||
      (data?.productWEIGHT[0] === "" &&
        data?.productRAM[0] === "" &&
        data?.productSIZE[0] === "")
    ) {
      context.addToCart(data);
    } else {
      setTabError(true);
    }
  };

  const addToMylist = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const fields = {
        name: data.name,
        images: data.images[0],
        rating: data.rating,
        price: data.discountPrice,
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

  return (
    <>
      <div className="prodia">
        <Dialog
          open={true}
          className="prodia"
          onClose={() => context.setopenproduct(false)}
        >
          <Button
            onClick={() => context.setopenproduct(false)}
            className="close"
          >
            <IoMdClose />
          </Button>
          <h4 className="mb-2 font-weight-bold">{data.name}</h4>
          <div className="d-flex align-items-center">
            <div>
              <span>Brands:</span>
              <span className="ml-2">
                <b>{data.brand}</b>
              </span>
            </div>
            <div className="mt-2 ml-4">
              <Rating
                name="read-only"
                value={data.rating ?? null}
                readOnly
                size="small"
                defaultValue={2.5}
                precision={0.5}
              />
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-5">
              <ProductZoom
                discount={data.discount}
                imagesdata={data?.images || []}
              />
            </div>
            <div className="col-md-7">
              <div className="d-flex info  align-items-center mb-2">
                <span className="oldprice mr-2 lg">${data.price}.00</span>
                <span className="netprice text-danger lg">
                  ${data.discountPrice}.00
                </span>
              </div>

              <span className="badge bg-success text-white p-2 fs-2 fw-bold">
                {data.stock === true ? "StockIn" : "StockOut"}
              </span>
              <p className="mt-3">{data.description}</p>

              {data?.productWEIGHT?.length !== 0 && (
                <div className="productsize d-flex align-items-center">
                  <span className="mr-3">Weight:</span>
                  <ul className="list-inline d-flex align-items-center ulsize">
                    {data?.productWEIGHT?.length !== 0 &&
                      data?.productWEIGHT?.map((item, index) => (
                        <li key={index}>
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

              {data?.productSIZE?.length !== 0 && (
                <div className="productsize d-flex align-items-center">
                  <span className="mr-3">Size :</span>
                  <ul className="list-inline d-flex align-items-center ulsize">
                    {data?.productSIZE?.length !== 0 &&
                      data?.productSIZE?.map((item, index) => (
                        <li key={index}>
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

              {data?.productRAM?.length !== 0 && (
                <div className="productsize d-flex align-items-center">
                  <span className="mr-3">RAMs :</span>
                  <ul className="list-inline d-flex align-items-center ulsize">
                    {data?.productRAM?.length !== 0 &&
                      data?.productRAM?.map((item, index) => (
                        <li key={index}>
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

              <div className="d-flex align-items-center">
                <Quantitybox />
                <Button
                  className="btn-blue btn-lg btn-primary btn-lg rounded-pill pl-4 pr-4 ml-4"
                  variant="outlined"
                  onClick={() => AddToCart(data)}
                >
                  {" "}
                  Add to Cart
                </Button>
              </div>

              <div className="wishlist mt-4">
                <Button
                  className="mr-4 "
                  onClick={() => {
                    addToMylist(data.id);
                  }}
                >
                  {addedWishList === true ? (
                    <>
                      <GoHeartFill
                        style={{ color: "rgb(255 38 77)", fontSizeL: "30px" }}
                      />{" "}
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
        </Dialog>
      </div>
    </>
  );
};

export default ProductDetails;
