import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect, useContext } from "react";
import { BsFillCloudUploadFill } from "react-icons/bs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Mycontext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchDataFromApi,
  editData,
  deleteImage,
  deleteDataAll,
  postData,
} from "../../utils/api";
import noImage from "../../assets/images/noimage.png";

import InputLabel from "@mui/material/InputLabel";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MyAccount = () => {
  const [value, setValue] = React.useState(0);
  const context = useContext(Mycontext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [formfields, setFormFields] = useState({
    name: "",
    images: [],
    email: "",
    phone: "",
  });

  const [image, setImage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [fields, sestFeilds] = useState({
    name: "",
    phone: "",
    email: "",
    images: "",
    password: "",
    newPass: "",
    confirmPass: "",
  });

  const [isloading, setIsLoading] = useState(false);
  const fd = new FormData();

  let img_Arr = [];
  let unique_Arr = [];

  const onChangeInput = (e) => {
    const {
      target: { name, value },
    } = e;

    setFormFields((prevs) => ({
      ...prevs,
      [name]: value,
    }));
  };
  const onChangeInput2 = (e) => {
    const {
      target: { name, value },
    } = e;

    sestFeilds((prevs) => ({
      ...prevs,
      [name]: value,
    }));
  };

  useEffect(() => {
    context.setProgress(20);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDataFromApi(`/api/user/${user.userId}`).then((res) => {
        setUserData(res);
        setFormFields({
          name: res.name,
          images: res.images,
          email: res.email,
          phone: res.phone,
        });
        setPreviews(res.images);
        context.setProgress(100);
      });
    }
  }, []);

  const onChangeFile = async (e, apiEndPoint) => {
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
        // const appendedArray = [...previews, ...unique_Arr];
        console.log("the Array:", unique_Arr);
        setPreviews(unique_Arr);

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
      setIsLoading(false); // Stop loading spinner
    }
  };

  const editProfile = (e) => {
    e.preventDefault();

    const updatedFormFields = {
      ...formfields,
      images: previews,
    };

    fd.append("name", updatedFormFields.name);
    fd.append("email", updatedFormFields.email);
    fd.append("phone", updatedFormFields.phone);
    fd.append("images", updatedFormFields.images);

    if (
      formfields.name !== "" &&
      formfields.email !== "" &&
      formfields.phone !== "" &&
      updatedFormFields.images !== ""
    ) {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        editData(`/api/user/${user.userId}`, updatedFormFields).then((res) => {
          if (res.success !== false) {
            setTimeout(() => {
              setIsLoading(false);
              context.setAlertBox({
                msg: "User Details updated Successfully",
                color: "success",
                open: true,
              });
            }, [1500]);
            deleteDataAll("/api/imagesupload/deleteAllImages");
          } else {
            context.setAlertBox({
              msg: res.msg,
              color: "error",
              open: true,
            });
          }
        });

        return true;
      }
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

  const updatePassword = (e) => {
    e.preventDefault();

    const updatedFields = {
      ...fields,
      images: previews,
    };

    fd.append("password", updatedFields.password);
    fd.append("newPass", updatedFields.newPass);

    if (
      updatedFields.password !== "" &&
      updatedFields.newPass !== "" &&
      updatedFields.confirmPass !== ""
    ) {
      setIsLoading(true);
      if (updatedFields.newPass !== updatedFields.confirmPass) {
        context.setAlertBox({
          msg: "Confirm Password doenot match with the New Password",
          color: "error",
          open: true,
        });
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          editData(
            `/api/user/changePassword/${user.userId}`,
            updatedFields
          ).then((res) => {
            if (res.success !== false) {
              setTimeout(() => {
                setIsLoading(false);
                context.setAlertBox({
                  msg: "User Password updated Successfully",
                  color: "success",
                  open: true,
                });
                sestFeilds({});
              }, 1500);
            } else {
              setIsLoading(false);
              context.setAlertBox({
                msg: res.msg,
                color: "error",
                open: true,
              });
            }
          });

          return true;
        }
      }
    } else {
      context.setAlertBox({
        msg: "Please fill all the Fields",
        color: "error",
        open: true,
      });
    }
  };

  return (
    <>
      <section className="section p-4 cart-page accountpaage">
        <div
          className="container"
          style={{ maxWidth: "1260px", border: "1px solid rgba(0,0,0,0.3)" }}
        >
          <h2 className="mt-4 mb-4">MyAccount Details</h2>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Edit Profile" {...a11yProps(0)} />
                <Tab label="Change Password" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="container pt-3 pb-3">
                <form action="" className="form-section" onSubmit={editProfile}>
                  <div className="row">
                    <div className="col-md-3 d-flex  align-items-center flex-column">
                      <div className="rounded-circle big">
                        {previews?.length !== 0 ? (
                          <img src={previews[0]} alt="" />
                        ) : (
                          <img src={noImage} alt="" />
                        )}
                        <div className="overlay">
                          <BsFillCloudUploadFill />
                          <input
                            type="file"
                            onChange={(e) => {
                              onChangeFile(e, "/api/user/upload");
                            }}
                          />
                        </div>
                      </div>
                      <Button
                        className="mt-4 saveAcc"
                        variant="contained"
                        type="submit"
                      >
                        Save{" "}
                        {isloading === true && (
                          <CircularProgress
                            color="inherit"
                            className="ml-2 load"
                          />
                        )}
                      </Button>
                    </div>
                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group mt-2">
                            <TextField
                              className="w-100"
                              name="name"
                              label="First name"
                              value={formfields.name ?? ""}
                              variant="outlined"
                              onChange={onChangeInput}
                            />
                          </div>
                        </div>
                      </div>
                      <h6 className="hd">Phone Number/Email:</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group mt-2">
                            <TextField
                              className="w-100"
                              name="phone"
                              value={formfields.phone ?? ""}
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
                              disabled
                              className="w-100"
                              name="email"
                              value={formfields.email ?? ""}
                              label="email"
                              type="email"
                              variant="outlined"
                              onChange={onChangeInput}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <form action="" onSubmit={updatePassword}>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group mt-2">
                        <TextField
                          className="w-100"
                          name="password"
                          type="password"
                          label="old password"
                          value={fields.password ?? ""}
                          variant="outlined"
                          onChange={onChangeInput2}
                        />
                      </div>
                    </div>
                  </div>
                  <h6 className="hd">New Password/Confirm Password:</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mt-2">
                        <TextField
                          className="w-100"
                          name="newPass"
                          value={fields.newPass ?? ""}
                          label="new password"
                          type="password"
                          variant="outlined"
                          style={{ height: "10px" }}
                          onChange={onChangeInput2}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mt-2">
                        <TextField
                          className="w-100"
                          name="confirmPass"
                          value={fields.confirmPass ?? ""}
                          label="confirm password"
                          type="password"
                          variant="outlined"
                          onChange={onChangeInput2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  className="mt-4 saveAcc"
                  variant="contained"
                  type="submit"
                >
                  Update{" "}
                  {isloading === true && (
                    <CircularProgress color="inherit" className="ml-2 load" />
                  )}
                </Button>
              </form>
            </CustomTabPanel>
          </Box>
        </div>
      </section>
    </>
  );
};

export default MyAccount;
