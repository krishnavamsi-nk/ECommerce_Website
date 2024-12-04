// Breadcrumb
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Select from "@mui/material/Select";
import { useState, useRef, useContext, useEffect } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import OutlinedInput from "@mui/material/OutlinedInput";

import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { AiFillCloseSquare } from "react-icons/ai";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegImages } from "react-icons/fa6";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import {
  deleteData,
  fetchDataFromApi,
  deleteDataAll,
  deleteImage,
} from "../../utils/api";

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const ProductUpload = () => {
  const [category, setCategoryVal] = useState("");
  const [subCatVal, setSubCatVal] = useState("");
  const [productRAM, setProductRAM] = useState([]);
  const [productWEIGHT, setProductWEIGHT] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  const [productSIZE, setProductSIZE] = useState([]);
  const context = useContext(MyContext);
  const [isloading, setIsLoading] = useState(false);
  const [isstock, setIsStock] = useState(null);
  const [image, setImage] = useState("");
  const [productWeightData, setProductWeightData] = useState([]);
  const [productSizeData, setProductSizeData] = useState([]);
  const [productRamData, setProductRamData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);

  const [value, setValue] = useState(null);
  const [hover, setHover] = useState(-1);

  const [previews, setPreviews] = useState([]);

  const [isfeatured, setIsFeatured] = useState(null);

  const [formfields, setFormFields] = useState({
    name: "",
    description: "",
    images: [],
    subCat: "",
    subCatId: "",
    catName: "",
    brand: "",
    price: 0,
    category: "",
    rating: 0,
    discountPrice: 0,
    countInStock: "",
    numReviews: "",
    isFeatured: true,
    discount: "",
    productRAM: [],
    productSIZE: [],
    productWEIGHT: [],
    stock: null,
  });
  const [catdata, setCatData] = useState({});
  const [open, setOpen] = useState(false);
  const history = useNavigate();

  const fd = new FormData();
  let img_Arr = [];
  let unique_Arr = [];

  useEffect(() => {
    fetchDataFromApi("/api/productRams").then((res) => {
      setProductRamData(res);
    });

    fetchDataFromApi("/api/productWeight").then((res) => {
      setProductWeightData(res);
    });
    fetchDataFromApi("/api/productSize").then((res) => {
      setProductSizeData(res);
    });
  }, []);

  useEffect(() => {
    console.log(
      "this is the DAT :",
      productRamData,
      productSizeData,
      productWeightData
    );
  }, [productRamData]);

  useEffect(() => {
    console.log("this is the form:", formfields);
  }, [formfields]);

  const removeImg = (item, index) => {
    // Remove the image preview from the display
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

    const publicId = item.split("/").slice(-1)[0].split(".")[0];
    console.log("publicId:", publicId);
    setImage(publicId);

    // Call deleteData with the formatted publicId
    deleteImage("/api/imagesupload/deleteimage", publicId);
  };

  const validateForm = (updatedform) => {
    const fields = updatedform;
    if (!fields.name) return "Please fill the product name";
    if (!fields.description) return "Please fill the product description";
    if (!fields.category) return "Please fill the product category";
    if (!fields.subCat) return "Please provide subCategory";
    if (fields.isFeatured === null || fields.isFeatured === "")
      return "Please provide fill product is a featured or not";

    if (fields.price <= 0 || fields.price === null)
      return "Please fill a valid product price";
    if (fields.discountPrice < 0 || fields.discountPrice === null)
      return "Please fill a valid discount price"; // Assuming discount can't be negative
    if (!fields.brand) return "Please fill the product brand";
    if (
      fields.discount <= 0 ||
      fields.discount === "" ||
      fields.discount === null
    )
      return "Please provide discount percentage";

    if (fields.numReviews < 0 || fields.numReviews === null)
      return "Please fill the reviews in proper";
    if (fields.rating <= 0) return "Please give a proper rating"; // Assuming rating can't be 0

    if (fields.countInStock <= 0 || fields.countInStock === null)
      return "Please fill the product CountInStock"; // Assuming count can't be negative
    if (fields.stock === null || fields.stock === "")
      return "Please provide fill product is a in or out Stock";
    if (previews.length === 0) return "Please upload the Product Images";

    return null; // Valid
  };

  const inputChange = (e) => {
    setFormFields({
      ...formfields,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeFile = async (e, apiEndPoint) => {
    setOpen(true);
    setIsLoading(true);
    try {
      const imgArr = [];
      const files = e.target.files;

      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          imgArr.push(file);
          fd.append("images", file);
        } else {
          context.setAlertBox({
            msg: "Please select a valid JPG or PNG image file.",
            color: "error",
            open: true,
          });
        }
      }

      const res = await postData(apiEndPoint, fd);

      if (res) {
        // Fetch and process API response
        const ress = await fetchDataFromApi("/api/imagesupload");
        console.log("This is the response:", ress);
        const img_Arr = [];

        if (ress && ress.images && ress.images.length !== 0) {
          ress.images.forEach((imgObj) => {
            // Each imgObj contains an images array
            imgObj.images.forEach((item) => img_Arr.push(item)); // Push each image URL to img_Arr
          });
        }

        console.log("All image URLs:", img_Arr);

        // Filter unique images and set previews
        const unique_Arr = img_Arr.filter(
          (item, index) => img_Arr.indexOf(item) === index
        );
        const appendedArray = [...previews, ...unique_Arr];
        console.log("the Array:", appendedArray);
        setPreviews(appendedArray);

        // Show success message after uploading
        context.setAlertBox({
          open: true,
          color: "success",
          msg: "Images uploaded successfully!",
        });
      }
    } catch (error) {
      console.log("Error during file upload:", error);
    } finally {
      setOpen(false);
      setIsLoading(false);
    }
  };

  const handleChangeval = (event) => {
    const newValues = event.target.value;

    const selectedItem = catdata.categoryList.find(
      (item) => item._id === event.target.value
    );

    setCategoryVal(event.target.value);
    // alert(category)
    setFormFields({
      ...formfields,
      catName: selectedItem.name || "",
      category: newValues,
    });
  };

  const handleProductRAM = (event) => {
    const {
      target: { value },
    } = event;

    // If "None" is selected, clear productRAM and formFields.productRAM
    if (value.includes(null)) {
      setProductRAM([]);
      setFormFields((prevFields) => ({
        ...prevFields,
        productRAM: [],
      }));
    } else {
      // Otherwise, update productRAM and formFields.productRAM with selected values
      const selectedValues =
        typeof value === "string" ? value.split(",") : value;
      setProductRAM(selectedValues);
      setFormFields((prevFields) => ({
        ...prevFields,
        productRAM: selectedValues,
      }));
    }
  };

  const handleProductWEIGHT = (event) => {
    const {
      target: { value },
    } = event;

    // If "None" is selected, clear productWEIGHT and formFields.productWEIGHT
    if (value.includes(null)) {
      setProductWEIGHT([]);
      setFormFields((prevFields) => ({
        ...prevFields,
        productWEIGHT: [],
      }));
    } else {
      const selectedValues =
        typeof value === "string" ? value.split(",") : value;
      setProductWEIGHT(selectedValues);
      setFormFields((prevFields) => ({
        ...prevFields,
        productWEIGHT: selectedValues,
      }));
    }
  };

  const handleProductSIZE = (event) => {
    const {
      target: { value },
    } = event;

    // If "None" is selected, clear productSIZE and formFields.productSIZE
    if (value.includes(null)) {
      setProductSIZE([]);
      setFormFields((prevFields) => ({
        ...prevFields,
        productSIZE: [],
      }));
    } else {
      const selectedValues =
        typeof value === "string" ? value.split(",") : value;
      setProductSIZE(selectedValues);
      setFormFields((prevFields) => ({
        ...prevFields,
        productSIZE: selectedValues,
      }));
    }
  };

  const handleSubCatVal = (event) => {
    const newValues = event.target.value;

    setSubCatVal(event.target.value);
    // alert(category)
    setFormFields({
      ...formfields,
      subCatId: newValues,
      subCat: newValues,
    });
  };

  const handleChangeIsStock = (event) => {
    const newValues = event.target.value;
    setIsStock(event.target.value);
    // alert(category)
    setFormFields({
      ...formfields,
      stock: newValues,
    });
  };

  const handleChangeIsFeatured = (event) => {
    const newValues = event.target.value;
    setIsFeatured(event.target.value);
    // alert(isfeatured);
    setFormFields({
      ...formfields,
      isFeatured: newValues,
    });
  };

  const addProduct = (e) => {
    e.preventDefault();
    const aappendedArray = [...previews, ...unique_Arr];
    img_Arr = [];

    // Immediately store the updated form fields to ensure correct data is used
    const updatedFormFields = {
      ...formfields,
      price: parseFloat(formfields.price),
      discountPrice: parseFloat(formfields.discountPrice),
      countInStock: parseInt(formfields.countInStock, 10),
      numReviews: parseInt(formfields.numReviews, 10),
      discount: parseInt(formfields.discount, 10),
    };
    console.log("This is the RAMS Post:", updatedFormFields);

    fd.append("name", updatedFormFields.name);
    fd.append("catName", updatedFormFields.catName);
    fd.append("subCatId", updatedFormFields.subCatId);
    fd.append("description", updatedFormFields.description);
    fd.append("brand", updatedFormFields.brand);
    fd.append("subCat", updatedFormFields.subCat);
    fd.append("price", updatedFormFields.price);
    fd.append("discountPrice", updatedFormFields.discountPrice);
    fd.append("category", updatedFormFields.category);
    fd.append("countInStock", updatedFormFields.countInStock);
    fd.append("rating", updatedFormFields.rating);
    fd.append("isFeatured", updatedFormFields.isFeatured);
    fd.append("numReviews", updatedFormFields.numReviews);
    fd.append("discount", updatedFormFields.discount);
    fd.append("productRAM", updatedFormFields.productRAM);
    console.log("this is the RAM:", updatedFormFields.productRAM);
    fd.append("productWEIGHT", updatedFormFields.productWEIGHT);
    fd.append("productSIZE", updatedFormFields.productSIZE);
    fd.append("stock", updatedFormFields.stock);
    fd.append("images", aappendedArray);
    formfields.images = aappendedArray;

    setFormFields(updatedFormFields);
    console.log("formfields", formfields);

    const validationMessage = validateForm(updatedFormFields);
    if (validationMessage) {
      context.setAlertBox({
        open: true,
        msg: validationMessage,
        color: "error",
      });
      return;
    }

    setIsLoading(true);

    console.log("this is the sended data:", updatedFormFields);

    // Now post the updated formFields
    postData("/api/product/create", updatedFormFields).then((res) => {
      console.log("This is the Responsed Data:", res);

      context.setAlertBox({
        msg: "Product Updated Successfully",
        color: "success",
        open: true,
      });

      deleteDataAll("/api/imagesupload/deleteAllImages");

      setIsLoading(false);

      setValue(0);

      history("/product/list");
    });
  };

  useEffect(() => {
    context.setIsHeaderAndSidebarShow(true);
    context.setIsToggleSidebar(false);
    window.scrollTo(0, 0);
    context.setProgress(20);

    fetchDataFromApi("/api/category").then((res) => {
      context.setProgress(100);
      setCatData(res);
    });
  }, []);

  useEffect(() => {
    const subCarArr = [];

    catdata?.categoryList?.length !== 0 &&
      catdata?.categoryList?.map((cat, index) => {
        if (cat?.children.length !== 0) {
          cat?.children?.map((subCat) => {
            subCarArr.push(subCat);
          });
        }
      });
    setSubCatData(subCarArr);
  }, [catdata]);

  return (
    <>
      <div className="right-content1 w-100">
        <div
          className="card shadow m-4 p-4 d-flex align-items-center  flex-row justify-content-between"
          style={{ borderRadius: "10px" }}
        >
          <h5 className="mb-0">Product Upload</h5>

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
                component="a"
                href="/product/list"
                label="Products"
                icon={<MdOutlineProductionQuantityLimits fontSize="18px" />}
              />

              <StyledBreadcrumb
                label="Product Upload"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>
        </div>

        <form action="" className="form-info" onSubmit={addProduct}>
          <div className="row mt-4 mr-3">
            <div className="col-md-12 ">
              <div className="card p-4 ml-4">
                <h6 className="font-weight-bold mb-3">Basic information</h6>

                <div className="form-group">
                  <h6>Product Name</h6>
                  <input
                    type="text"
                    placeholder="type here..."
                    name="name"
                    onChange={inputChange}
                    value={formfields.name}
                  />
                </div>

                <div className="form-group mt-2">
                  <h6>Description</h6>
                  <textarea
                    placeholder="Type here..."
                    id=""
                    rows={4}
                    cols={20}
                    name="description"
                    onChange={inputChange}
                    value={formfields.description ?? ""}
                  ></textarea>
                </div>

                <div className="row form-group">
                  <div className="col">
                    <h6>Category</h6>
                    <Select
                      className="w-100"
                      value={category ?? ""}
                      onChange={handleChangeval}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {catdata?.categoryList?.length !== 0 &&
                        catdata?.categoryList?.map((item, index) => (
                          <MenuItem value={item._id} key={item._id}>
                            {" "}
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>

                  <div className="col">
                    <h6>SubCategory</h6>
                    <Select
                      className="w-100"
                      value={subCatVal ?? ""}
                      onChange={handleSubCatVal}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      name="subCat"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {subCatData?.length !== 0 &&
                        subCatData?.map((item, index) => (
                          <MenuItem value={item._id} key={item._id}>
                            {" "}
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>

                  <div className="col">
                    <h6>Is Featured</h6>
                    <Select
                      className="w-100"
                      style={{ borderRadius: "10px" }}
                      value={isfeatured === null ? "" : isfeatured} // Use actual value
                      onChange={handleChangeIsFeatured}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                    </Select>
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col">
                    <h6>Regular Price</h6>
                    <input
                      type="text"
                      name="price"
                      onChange={inputChange}
                      value={formfields.price}
                    />
                  </div>

                  <div className="col">
                    <h6>Discount Price</h6>
                    <input
                      value={formfields.discountPrice}
                      type="text"
                      name="discountPrice"
                      onChange={inputChange}
                    />
                  </div>

                  <div className="col">
                    <h6>Brand</h6>
                    <input
                      value={formfields.brand}
                      type="text"
                      placeholder="type here..."
                      name="brand"
                      onChange={inputChange}
                    />
                  </div>

                  <div className="col">
                    <h6>Discount Precentage</h6>
                    <input
                      value={formfields.discount}
                      type="text"
                      name="discount"
                      onChange={inputChange}
                    />
                  </div>
                </div>

                <div className="row d-flex  align-items-center form-group">
                  <div className="col">
                    <h6>Numof Reviews</h6>
                    <input
                      value={formfields.numReviews ?? ""}
                      type="number"
                      placeholder="type here..."
                      name="numReviews"
                      onChange={inputChange}
                    />
                  </div>

                  <div className="col d-flex flex-column justify-content-center">
                    <h6 style={{ textAlign: "center" }}>Rating</h6>

                    <Box
                      className="mx-auto"
                      style={{
                        width: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Rating
                        size="medium"
                        name="rating"
                        value={value}
                        precision={0.5}
                        getLabelText={getLabelText}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                          setFormFields({
                            ...formfields,
                            rating: newValue,
                          });
                        }}
                        onChangeActive={(event, newHover) => {
                          setHover(newHover);
                        }}
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.55 }}
                            fontSize="inherit"
                          />
                        }
                      />
                      {value !== null && (
                        <Box sx={{ ml: 2 }}>
                          {labels[hover !== -1 ? hover : value]}
                        </Box>
                      )}
                    </Box>
                  </div>

                  <div className="col">
                    <h6>Count in Stock</h6>
                    <input
                      value={formfields.countInStock ?? ""}
                      type="number"
                      name="countInStock"
                      onChange={inputChange}
                    />
                  </div>

                  <div className="col">
                    <h6> STOCK IN OR OUT</h6>
                    <Select
                      className="w-100"
                      style={{ borderRadius: "10px" }}
                      value={isstock === null ? "" : isstock} // Use actual value
                      onChange={handleChangeIsStock}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={true}>In</MenuItem>
                      <MenuItem value={false}>Out</MenuItem>
                    </Select>
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col">
                    <h6>PRODUCT RAM</h6>
                    <Select
                      className="w-100"
                      value={productRAM}
                      onChange={handleProductRAM}
                      displayEmpty
                      multiple
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={null}>
                        <em>None</em>
                      </MenuItem>
                      {productRamData?.length !== 0 &&
                        productRamData?.map((item, index) => (
                          <MenuItem key={item.id} value={item.productRAM}>
                            {item.productRAM}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>

                  <div className="col">
                    <h6>Product Size</h6>
                    <Select
                      className="w-100"
                      value={productSIZE ?? ""}
                      onChange={handleProductSIZE}
                      displayEmpty
                      multiple
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={null}>
                        <em>None</em>
                      </MenuItem>

                      {productSizeData?.length !== 0 &&
                        productSizeData?.map((item, index) => (
                          <MenuItem key={item.id} value={item.productSIZE}>
                            {item.productSIZE}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>

                  <div className="col">
                    <h6>Product Weight</h6>
                    <Select
                      className="w-100"
                      style={{ borderRadius: "10px" }}
                      value={productWEIGHT}
                      onChange={handleProductWEIGHT}
                      displayEmpty
                      multiple
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={null}>
                        <em>None</em>
                      </MenuItem>

                      {productWeightData?.length !== 0 &&
                        productWeightData?.map((item, index) => (
                          <MenuItem key={item.id} value={item.productWEIGHT}>
                            {item.productWEIGHT}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4 ml-4 mt-4">
            <div className="imgUploadSec">
              <h5>Media And Published</h5>

              <div className="mt-3 imgUploadBox d-flex align-items-center">
                {previews?.length !== 0 &&
                  previews?.map((item, index) => (
                    <div className="uploadBox" key={index}>
                      <span
                        className="remove"
                        onClick={() => removeImg(item, index)}
                      >
                        <AiFillCloseSquare />
                      </span>
                      <div className="box">
                        <LazyLoadImage
                          alt={"image"}
                          effect="blur"
                          className="w-100 img"
                          src={item}
                        />
                      </div>
                    </div>
                  ))}

                <div className="uploadBox">
                  <input
                    type="file"
                    multiple
                    name="images"
                    onChange={(e) => onChangeFile(e, "/api/product/upload")}
                  />
                  <div className="info">
                    {isloading === true && open === true ? (
                      <>
                        {" "}
                        <CircularProgress
                          color="inherit"
                          className="ml-2 load"
                        />
                        <h5>img Uploading...</h5>
                      </>
                    ) : (
                      <>
                        <FaRegImages />
                        <h5>image upload</h5>
                      </>
                    )}
                    <IoMdAdd style={{ fontSize: "25px" }} />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-3 btn-blue pt-2 pb-2 w-100 "
                style={{ textTransform: "uppercase", fontSize: "17px" }}
              >
                <MdOutlinePublishedWithChanges
                  className="mr-2"
                  style={{ fontSize: "20px" }}
                />{" "}
                Publish Product &nbsp;
                {isloading === true && open !== true && (
                  <CircularProgress color="inherit" className="ml-2 load" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductUpload;
