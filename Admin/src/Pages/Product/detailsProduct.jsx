import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Rating from "@mui/material/Rating";
import ProductZoom from "../../Components/ProductZoom";

import React, { useRef } from "react";
import { useState, useEffect } from "react";

// icons
import { SiBrandfolder } from "react-icons/si";
import { MdCategory } from "react-icons/md";
import { IoPricetags } from "react-icons/io5";
import { IoColorPalette } from "react-icons/io5";
import { MdOutlinePhotoSizeSelectLarge } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { VscPreview } from "react-icons/vsc";
import { MdOutlinePublish } from "react-icons/md";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular, // Corrected here
    "&:hover,&:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1], // Corrected here
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductDetails = () => {
  const [productData, setProductData] = useState({});
  const { id } = useParams();
  const [prodReviews, setProdReviews] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      console.log("detrails", res);
      setProductData(res);
    });

    fetchDataFromApi(`/api/review?productId=${id}`).then((res) => {
      if (res.success !== false && Array.isArray(res)) {
        setProdReviews(res);
        console.log("Fetched reviews:", res);
      } else {
        setProdReviews([]); // Handle cases where the response is not an array
      }
    });
  }, [id]);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  var settingsmall = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <div className="right-content w-100">
        <div
          className="card shadow m-4 p-4 d-flex align-items-center  flex-row justify-content-between"
          style={{ borderRadius: "10px" }}
        >
          <h5 className="mb-0">Product List</h5>

          <div>
            <Breadcrumbs
              arial-label="breadcrumb "
              className="ml-auto breadcrumbs_"
            >
              <StyledBreadcrumb
                component="a"
                href="/"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="Productsview"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>
        </div>

        <div
          className="card ml-4 mr-4 mt-3 p-3 productDetailSection"
          style={{ borderRadius: "10px" }}
        >
          <div className="row">
            <div className="col-md-5">
              <div className="sliderwrapper p-4">
                <ProductZoom
                  discount={productData.discount}
                  imagesdata={productData.images}
                />
              </div>
            </div>

            <div className="col-md-7">
              <div className="product-detail mt-4 ml-2">
                <h6>Product Details</h6>
                <h4 className="mt-3">{productData?.name}</h4>

                <div className="product-info">
                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <SiBrandfolder />
                      </span>
                      <span className="name ml-3">Brand</span>
                    </div>
                    <span>:</span>
                    <div className="col-sm-8">
                      <span>{productData.brand}</span>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <MdCategory />
                      </span>
                      <span className="name ml-3">Category</span>
                    </div>
                    <span>:</span>
                    <div className="col-sm-8">
                      <span>{productData.catName}</span>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <MdCategory />
                      </span>
                      <span className="name ml-3">SubCategory</span>
                    </div>
                    <span>:</span>
                    <div className="col-sm-8">
                      <span>{productData.subCat?.subCat}</span>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <IoPricetags />
                      </span>
                      <span className="name ml-3">Tags</span>
                      <span style={{ marginLeft: "70px" }}>:</span>
                    </div>

                    <div className="col-sm-9 pl-1">
                      <span className="ml-3">
                        <Button> Suite </Button>
                        <Button> Party </Button>
                        <Button> Dress </Button>
                        <Button> Smart </Button>
                        <Button> Man </Button>
                      </span>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <IoColorPalette />
                      </span>
                      <span className="name ml-3">Color</span>
                      <span style={{ marginLeft: "63px" }}>:</span>
                    </div>

                    <div className="col-sm-9 pl-1">
                      <span className="ml-3">
                        <Button>Red</Button>

                        <Button> Blue </Button>
                        <Button> Green </Button>
                        <Button> Yellow </Button>
                        <Button> Violet </Button>
                      </span>
                    </div>
                  </div>

                  {productData?.productWEIGHT?.length !== 0 && (
                    <div className="row d-flex align-items-center">
                      <div className="col-sm-3 d-flex align-items-center">
                        <span className="icon">
                          <MdOutlinePhotoSizeSelectLarge />
                        </span>
                        <span className="name ml-3">Weight</span>
                        <span style={{ marginLeft: "74px" }}>:</span>
                      </div>

                      <div className="col-sm-9 pl-1">
                        <span className="ml-3">
                          {productData?.productWEIGHT?.length !== 0 &&
                            productData?.productWEIGHT?.map((item, index) => (
                              <Button key={index}>{item}Kg</Button>
                            ))}
                        </span>
                      </div>
                    </div>
                  )}

                  {productData?.productSIZE?.length !== 0 && (
                    <div className="row d-flex align-items-center">
                      <div className="col-sm-3 d-flex align-items-center">
                        <span className="icon">
                          <MdOutlinePhotoSizeSelectLarge />
                        </span>
                        <span className="name ml-3">Size</span>
                        <span style={{ marginLeft: "74px" }}>:</span>
                      </div>

                      <div className="col-sm-9 pl-1">
                        <span className="ml-3">
                          {productData?.productSIZE?.length !== 0 &&
                            productData?.productSIZE?.map((item, index) => (
                              <Button key={index}>{item}</Button>
                            ))}
                        </span>
                      </div>
                    </div>
                  )}

                  {productData?.productRAM?.length !== 0 && (
                    <div className="row d-flex align-items-center">
                      <div className="col-sm-3 d-flex align-items-center">
                        <span className="icon">
                          <MdOutlinePhotoSizeSelectLarge />
                        </span>
                        <span className="name ml-3">Weight</span>
                        <span style={{ marginLeft: "74px" }}>:</span>
                      </div>

                      <div className="col-sm-9 pl-1">
                        <span className="ml-3">
                          {productData?.productRAM?.length !== 0 &&
                            productData?.productRAM?.map((item, index) => (
                              <Button key={index}>{item}Kg</Button>
                            ))}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <MdAttachMoney />
                      </span>
                      <span className="name ml-3">Price</span>
                    </div>
                    <span>:</span>
                    <div className="col-sm-8">
                      <span className="text-success font-weight-bolder">
                        ${productData.discountPrice}.00{" "}
                      </span>
                      <span
                        className="text-danger"
                        style={{
                          textDecoration: "line-through",
                          fontWeight: "600",
                        }}
                      >
                        ${productData.price}.00
                      </span>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <AiOutlineStock />
                      </span>
                      <span className="name ml-3">Stock</span>
                    </div>
                    <span>:</span>
                    <div className="col-sm-8">
                      <span> ({productData.countInStock}) Pieces</span>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <VscPreview />
                      </span>
                      <span className="name ml-3">Review</span>
                    </div>
                    <span>:</span>
                    <div className="col-sm-8">
                      <span> ({productData.numReviews}) Reviews</span>
                    </div>
                  </div>

                  <div className="row d-flex align-items-center">
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">
                        <MdOutlinePublish />
                      </span>
                      <span className="name ml-3">Published</span>
                    </div>
                    <span>:</span>
                    <div className="col-sm-8">
                      <span>{productData.dateCreated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: "1px solid black", opacity: "0.4" }} />

          <div className="p-4">
            <h6 className="mb-3">Product Description</h6>
            <p>{productData.description}</p>

            <h6>Rating Analytics</h6>
            <div className="mt-4 ratingSection d-flex align-items-center">
              <div className="col-md-6">
                <div className="ratingrow d-flex align-items-center">
                  <span className="col1">5 Star</span>
                  <div className="col2">
                    {" "}
                    <LinearProgress variant="determinate" value={80} />
                  </div>
                  <span className="col3">(22)</span>
                </div>

                <div className="ratingrow d-flex align-items-center">
                  <span className="col1">4 Star</span>
                  <div className="col2">
                    {" "}
                    <LinearProgress variant="determinate" value={90} />
                  </div>
                  <span className="col3">(25)</span>
                </div>

                <div className="ratingrow d-flex align-items-center">
                  <span className="col1">3 Star</span>
                  <div className="col2">
                    {" "}
                    <LinearProgress variant="determinate" value={60} />
                  </div>
                  <span className="col3">(17)</span>
                </div>

                <div className="ratingrow d-flex align-items-center">
                  <span className="col1">2 Star</span>
                  <div className="col2">
                    {" "}
                    <LinearProgress variant="determinate" value={30} />
                  </div>
                  <span className="col3">(12)</span>
                </div>

                <div className="ratingrow d-flex align-items-center">
                  <span className="col1">1 Star</span>
                  <div className="col2">
                    {" "}
                    <LinearProgress variant="determinate" value={20} />
                  </div>
                  <span className="col3">(10)</span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="column-rate d-flex flex-column align-items-center justify-content-center">
                  <h5 style={{ opacity: "0.7", marginBottom: "0px" }}>
                    Total Reviews (38)
                  </h5>
                  <h1>{productData.rating}</h1>
                  <Rating
                    name="read-only"
                    value={parseFloat(productData.rating)}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                  <p>Your Average Rating Star</p>
                </div>
              </div>
            </div>

            <h6 className="mt-5  mb-3">Review Section</h6>

            {prodReviews?.length !== 0 &&
              prodReviews
                ?.slice()
                ?.reverse()
                ?.map((item, index) => (
                  <div className="reviewSection">
                    <div className="reviewBox p-4 position-relative">
                      <div className="row">
                        <div
                          className="col-sm-3 mt-4 d-flex align-items-center flex-column justify-content-center"
                          style={{
                            border: "1px solid white",
                            borderRadius: "10px",
                          }}
                        >
                          <div className="center d-flex align-items-center mb-2">
                            <div className="rounded-circle big">
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6quMQa31LcLHaNdJrTmOiHX-ec18VOhs4w&s"
                                alt=""
                              />
                            </div>
                            <div
                              className="userinfo d-flex flex-column ml-2"
                              style={{ textAlign: "left" }}
                            >
                              <h5
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bolder",
                                  margin: "0px",
                                }}
                              >
                                {item.customerName}
                              </h5>
                            </div>
                          </div>

                          <Rating
                            name="read-only"
                            value={item.customerRating}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </div>

                        <div className="col-sm-9 d-flex align-items-center">
                          <p className="mt-4 ml-2 mr-2">{item.review}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
