import { FaStar } from "react-icons/fa";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { IoExpand } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import ProductDetails from "../ProductDetails/index";
import { useState, useEffect, useContext, useRef } from "react";
import { Mycontext } from "../../../App";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { GoHeartFill } from "react-icons/go";
import { postData, fetchDataFromApi } from "../../../utils/api";

const apiUrl = import.meta.env.VITE_BASE_URL;

const Homeproducts = (props) => {
  const { viewedProuct, data, check } = props;
  const [addedWishList, setAddedWishList] = useState(false);

  const [isHoveredProduct, setIsHoveredProduct] = useState(false);

  const sliderRef = useRef();
  var settings = {
    dots: true,
    infinite: false,
    loop: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const handleMouseEnter = (id) => {
    setIsHoveredProduct(true);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickPlay();
      }
    }, 5);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDataFromApi(`/api/mylist?prodId=${id}&userId=${user.userId}`).then(
        (res) => {
          if (res.success === false) {
            
              console.log(res);
              setAddedWishList(false);
            
          }
          else{
            setAddedWishList(true);
          }
        }
      );
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

  const handleMouseLeave = () => {
    setIsHoveredProduct(false);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickPause();
      }
    }, 20);
  };

  // Destructure properties from `data`
  const {
    images,
    name,
    rating,
    price,
    discountPrice,
    isFeatured,
    category,
    discount,
    stock,
    id,
  } = data || {};

  const context = useContext(Mycontext);

  const viewProductsDetails = (idx) => {
    context.setopenproduct({
      id: idx,
      open: true,
    });
  };

  const closeProduct = () => {
    context.setopenproduct(false);
  };

  const [isHovered, setIsHovered] = useState(false);

  const defaultStyle = {
    fontWeight: "750",
    color: "gray",
    paddingLeft: "10px",
    transition: "color 0.3s ease", // Smooth color transition
  };

  const hoverStyle = {
    ...defaultStyle,
    color: "rgb(11 88 203)", // Change to the desired color on hover
  };

  return (
    <>
      <div
        className="item d-flex flex-column justify-content-between"
        onMouseEnter={() =>
          handleMouseEnter(`${viewedProuct === true ? data.prodId : id}`)
        }
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="imagewrapper w-100 h-50 mb-2 part1"
          style={{
            padding: "10px",
            position: "relative",
            width: "100%",
          }}
        >
          <div className="img" style={{ height: "250px" }}>
            {isHoveredProduct === true ? (
              <Slider {...settings} ref={sliderRef}>
                {images?.length !== 0 &&
                  images.map((item, index) => (
                    <div className="slick-slide" key={index}>
                      <img
                        style={{ width: "100%", height: "100%" }}
                        src={item ? item : "default-image-path.jpg"}
                        alt=""
                      />
                    </div>
                  ))}
              </Slider>
            ) : (
              <img
                src={
                  images?.length !== 0 && images?.[0]
                    ? images[0]
                    : "default-image-path.jpg"
                }
                style={{ width: "100%", height: "100%" }}
                alt=""
              />
            )}
          </div>
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "6px",
              backgroundColor: "rgb(59, 125, 200)",
              padding: "3px",
              color: "white",
              borderRadius: "6px",
            }}
          >
            <span className="ml-1" style={{ fontSize: "14px" }}>
              {discount}%
            </span>
          </div>
          <div
            className="d-flex flex-column"
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            <IoExpand
              className="custom-icon mb-2"
              style={{ fontSize: "28px", backgroundColor: "white" }}
              onClick={() =>
                viewProductsDetails(
                  `${viewedProuct === true ? data.prodId : id}`
                )
              }
            />

            <div
              onClick={() =>
                addToMylist(`${viewedProuct === true ? data.prodId : id}`)
              }
            >
              {addedWishList === true ? (
                <GoHeartFill className="custom-icon" style={{color:"rgb(255 38 77)"}}/>
              ) : (
                <FaRegHeart className="custom-icon" />
              )}
            </div>
          </div>
        </div>

        <div className="part2">
          <Link
            to={check === true ? `/product/${data.prodId}` : `/product/${id}`}
          >
            <h6
              style={isHovered ? hoverStyle : defaultStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {name?.length >= 30 ? name.substr(0, 18) + "..." : name}
            </h6>
          </Link>
          <div className="content">
            <p
              style={{
                color: stock === true ? "green" : "red",
                paddingLeft: "12px",
              }}
            >
              {stock === true ? "In Stock" : "Out Of Stock"}
            </p>
            <div className="rating d-flex mb-2 ml-2">
              <Rating
                name="read-only"
                value={rating}
                readOnly
                precision={0.5}
                size="small"
              />
            </div>
            <div className="rate d-flex align-items-center ml-3">
              <p
                style={{
                  textDecoration: "line-through",
                  fontSize: "13px",
                  marginRight: "8px", // Use CSS for spacing instead of className
                }}
              >
                ${price}.00
              </p>
              <p style={{ fontSize: "16px", color: "red" }}>
                ${discountPrice}.00
              </p>
            </div>
            {/* <div style={{ padding: "0 15px 15px" }}>
              <Button
                className="w-100"
                style={{
                  borderRadius: "10px",
                  color: "rgb(59, 125, 151)", // Removed the semicolon
                  border: "1px solid rgb(59, 125, 151)",
                  fontWeight: "800",
                }}
              >
                Add To Cart
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Homeproducts;
