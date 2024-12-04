// Breadcrumb
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { MdCategory } from "react-icons/md";

import Select from "@mui/material/Select";
import { useState, useEffect, useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
export const apiUrl = import.meta.env.VITE_BASE_URL;

import {
  fetchDataFromApi,
  editData,
  deleteImage,
  deleteDataAll,
  postData,
} from "../../utils/api";

import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { AiFillCloseSquare } from "react-icons/ai";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegImages } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";

import { MyContext } from "../../App";
import { Link, useParams } from "react-router-dom";

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

const EditCategory = () => {
  const context = useContext(MyContext);
  const [open, setOpen] = useState(false);

  

  const [formfields, setFormFields] = useState({
    name: "",
    images: [],
    color: "",
    items: 0,
  });

  const [image, setImage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState([]);

  const [isloading, setIsLoading] = useState(false);
  const fd = new FormData();
  const { id } = useParams();
  let img_Arr = [];
  let unique_Arr = [];
  const history = useNavigate();

  const removeImg = (item, index) => {
    // Remove the image preview from the display
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

    const publicId = item.split("/").slice(-1)[0].split(".")[0];
    console.log("publicId:", publicId);
    setImage(publicId);

    // Call deleteData with the formatted publicId
    deleteImage("/api/imagesupload/deleteimage", publicId);
  };

  useEffect(()=>{
    console.log("form:",formfields);
  },[formfields]);

  const changeinput = (e) => {
    const { name, value } = e.target;

    // Check if the name is 'images' to handle it differently

    setFormFields((prevState) => ({
      ...prevState,
      [name]: name === "items" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    context.setProgress(20);
    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      setCategory(res);
      setFormFields({
        name: res.name,
        color: res.color,
        items: res.items,
        images: res.images,
      });
      setPreviews(res.images);
      context.setProgress(100);
    });
  }, []);

  // useEffect(() => {
  //   console.log("This is the Data here:", formfields);
  // }, [formfields]);

  const onChangeFile = async (e, apiEndPoint) => {
    setOpen(true);
    setIsLoading(true);
    try {
      const imgArr = [];
      const files = e.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Validate image type
        if (
          file &&
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )
        ) {
          imgArr.push(file);
          fd.append("images", file); // Append each valid file to FormData
        } else {
          // Show error if invalid file type is found
          context.setAlertBox({
            msg: "Please select a valid JPG, PNG, or WEBP image file.",
            color: "error",
            open: true,
          });
        }
      }

      // Perform upload request
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

  // useEffect(() => {
  //   console.log("this is previews 1:", previews);
  // }, [previews]);

  const addCategory = (e) => {
    e.preventDefault();

    const updatedFormFields = {
      ...formfields,
      images:previews,
    };

    fd.append("name", formfields.name);
    fd.append("color", formfields.color);
    fd.append("items", formfields.items);
    fd.append("images", formfields.images);

    if (
      formfields.name !== "" &&
      formfields.color !== "" &&
      formfields.items !== "" &&
      updatedFormFields.images !== ""
    ) {
      setIsLoading(true);

      editData(`/api/category/${id}`, updatedFormFields).then((res) => {
        // console.log(res);
        setIsLoading(false);
        deleteDataAll("/api/imagesupload/deleteAllImages");
        history("/category/list");
      });

      return true;
    } else {
      // setError(true);
      context.setAlertBox({
        msg: "Please fill all the Fields",
        color: "error",
        open: true,
      });

      return false;
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div
          className="card shadow m-4 p-4 d-flex align-items-center  flex-row justify-content-between"
          style={{ borderRadius: "10px" }}
        >
          <h5 className="mb-0"> Edit Category</h5>

          <div>
            <Breadcrumbs
              arial-label="breadcrumb "
              className="ml-auto brea dcrumbs_"
            >
              <StyledBreadcrumb
                component="a"
                href="/"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb
                component="a"
                href="/category/list"
                label="Category List"
                icon={<MdCategory style={{ fontSize: "17px" }} />}
              />

              <StyledBreadcrumb
                label="Category Edit"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>
        </div>

        <form action="" className="form-info" onSubmit={addCategory}>
          <div className="row mt-4 mr-3">
            <div className="col-md-8">
              <div className="card p-4 ml-4">
                <h6 className="font-weight-bold mb-3">Basic information</h6>

                <div className="form-group">
                  <h6>Category Name</h6>
                  <input
                    type="text"
                    placeholder="type here..."
                    name="name"
                    value={formfields.name}
                    onChange={(e) => changeinput(e)}
                  />
                </div>

                <div className="form-group">
                  <h6>color</h6>
                  <input
                    type="text"
                    placeholder="type here..."
                    name="color"
                    value={formfields.color}
                    onChange={changeinput}
                  />
                </div>

                <div className="form-group">
                  <h6>Items Available</h6>
                  <input
                    type="number"
                    placeholder="type here..."
                    name="items"
                    value={formfields.items}
                    onChange={changeinput}
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-3 btn-blue pt-2 pb-2 w-100"
                  style={{ textTransform: "uppercase", fontSize: "17px" }}
                >
                  <MdOutlinePublishedWithChanges
                    className="mr-2"
                    style={{ fontSize: "20px" }}
                  />{" "}
                  Publish Product &nbsp;
                  {isloading === true && open!==true && (
                    <CircularProgress color="inherit" className="ml-2 load" />
                  )}
                </Button>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-4 ml-4 mt-4">
                <div className="imgUploadSec">
                  <h5>Media And Published</h5>

                  <div className="mt-3 imgUploadBox d-flex flex-column align-items-center">
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
                              alt="image"
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
                        onChange={(e) =>
                          onChangeFile(e, "/api/category/upload")
                        }
                      />
                       <div className="info">
                        {isloading === true && open === true? (
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
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
