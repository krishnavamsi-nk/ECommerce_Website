import Logo from "../../assets/images/adm.png";
import { useEffect, useContext, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import pattern from "../../assets/images/pattern.jpg";
import { FaCircleCheck } from "react-icons/fa6";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaTwitterSquare } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { FcGoogle } from "react-icons/fc";

import { firebaseApp } from "../../firebase.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const context = useContext(MyContext);
  const [isfocus, setIsFocus] = useState(false);
  const [index, setIndex] = useState(0);
  const [isshowpassword, setIsShowPassword] = useState(false);
  const history = useNavigate();
  const [isloading, setIsLoading] = useState(false);

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true,
  });

  const Focusfun = (index) => {
    setIsFocus(true);
    setIndex(index);
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
          isAdmin:true,
        };

        postData("/api/user/authWithGoogle", fields)
          .then((res) => {
            try {
              if (res.error !== true) {
                localStorage.setItem("token", res.token);

             

                const user = {
                  name: res?.user?.name,
                  email: res?.user?.email,
                  userId: res?.user?._id, // Correctly map `_id`
                  isAdmin: res?.user?.isAdmin, // Ensure the field name matches
                }
                console.log("the user:",res);

                localStorage.setItem("user", JSON.stringify(user));

                context.setAlertBox({
                  msg: res.msg,
                  open: true,
                  color: "success", // Use "success" as the color
                });

                setTimeout(() => {
                  setIsLoading(false);
                   history("/login");
                }, 2000);
              } else {
                context.setAlertBox({
                  msg: res.msg,
                  open: true,
                  color: "error",
                });
              }
            } catch (err) {
              console.error("Error processing response", err);
              context.setAlertBox({
                msg: "An unexpected error occurred.",
                open: true,
                color: "error",
              });
            }
          })
          .catch((error) => {
            console.error("Error during postData request:", error);
            context.setAlertBox({
              msg: "An error occurred during authentication.",
              open: true,
              color: "error",
            });
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        context.setAlertBox({
          msg: errorMessage,
          open: true,
          color: "error",
        });
      });
  };

  const location = useLocation(); // Hook to detect route changes
  const validateFields = (fields) => {
    if (fields.name === "") return "The name is required";
    if (fields.phone === "") return "Please Enter the Phone Number";
    if (fields.email === "") return "Please Provide the Email";
    if (fields.password === "") return "Please Provide the Password";
    if (fields.confirmPassword === "") return "Please Confirm the Password";
    if (fields.password !== fields.confirmPassword)
      return "The Confirm password does not match with password";

    return null;
  };

  useEffect(() => {
    // Hide header and sidebar, and toggle sidebar on redirect
    context.setIsHeaderAndSidebarShow(false);
    context.setIsToggleSidebar(true);

    // Scroll to the top of the page when the route changes
    window.scrollTo(0, 0);
    const mainContentDiv = document.querySelector(".content"); // Adjust selector as needed
    if (mainContentDiv) {
      mainContentDiv.scrollTo(0, 0); // Scroll the div to the top
    }
    console.log(location.pathname);
  }, [location.pathname]); //

  const formsubmit = (e) => {
    e.preventDefault();

    try {
      const Validation = validateFields(formfields);
      if (Validation) {
        return context.setAlertBox({
          msg: Validation,
          color: "error",
          open: true,
        });
      }
      setIsLoading(true);

      postData("/api/user/signup", formfields).then((res) => {
        console.log("error:", res);

        if (res.status !== false) {
          // Success: show success message and redirect after a delay
          context.setAlertBox({
            msg: "SignUp successful",
            color: "success",
            open: true,
          });

          setTimeout(() => {
            setIsLoading(false);
            history("/login");
          }, 2000);
        } else {
          // Failure: show the error message
          setIsLoading(false);
          context.setAlertBox({
            msg: res.msg || "Something went wrong. Please try again.",
            color: "error",
            open: true,
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const inputChange = (e) => {
    setFormfields((prevs) => ({
      ...prevs,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <div className="signup-section">
        <img
          src="https://www.svgbackgrounds.com/wp-content/uploads/2021/05/subtle-prism-triangle-pattern.jpg"
          style={{
            width: "100%",
            height: "100vh",
            opacity: "0.7",
            position: "absolute",
            pointerEvents: "none",
          }}
          alt=""
        />
        <div className="row">
          <div className="col-md-4 ml-4">
            <div className="loginSection d-flex flex-column">
              <div className="loginBox d-flex flex-column align-items-center signupbox">
                <Link to="/dashboard">
                  <div className="logo">
                    <img src={Logo} alt="" />
                  </div>
                </Link>
                <h5>Register a New Account</h5>
              </div>

              <div className="form signupform">
                <form
                  action=""
                  className="d-flex flex-column pt-5 pl-5 pr-5 pb-2"
                  onSubmit={formsubmit}
                >
                  <div
                    className={`field ${
                      isfocus === true && index === 0 ? "focus" : ""
                    }`}
                    onFocus={() => Focusfun(0)}
                    onBlur={() => setIsFocus(false)}
                  >
                    <FaCircleUser className="mr-3 ml-2" />

                    <input
                      type="text"
                      required
                      placeholder="Enter Your Name"
                      autoFocus
                      name="name"
                      onChange={inputChange}
                    />
                  </div>
                  <div
                    className={`field ${
                      isfocus === true && index === 1 ? "focus" : ""
                    }`}
                    onFocus={() => Focusfun(1)}
                    onBlur={() => setIsFocus(false)}
                  >
                    <MdEmail
                      className="mr-3 ml-2"
                      style={{ fontSize: "20px" }}
                    />

                    <input
                      type="email"
                      required
                      placeholder="Enter Your Email"
                      name="email"
                      onChange={inputChange}
                    />
                  </div>

                  <div
                    className={`field ${
                      isfocus === true && index === 2 ? "focus" : ""
                    }`}
                    onFocus={() => Focusfun(2)}
                    onBlur={() => setIsFocus(false)}
                  >
                    <FaCircleUser className="mr-3 ml-2" />

                    <input
                      type="text"
                      required
                      placeholder="Phone Number"
                      autoFocus
                      name="phone"
                      onChange={inputChange}
                    />
                  </div>

                  <div
                    className={`field d-flex align-items-center ${
                      isfocus === true && index === 3 ? "focus" : ""
                    }`}
                    onFocus={() => Focusfun(3)}
                    onBlur={() => setIsFocus(false)}
                  >
                    <FaShieldAlt className="mr-3 ml-2" />

                    <input
                      type={`${isshowpassword === true ? "text" : "password"}`}
                      required
                      placeholder="Enter Your Password"
                      name="password"
                      onChange={inputChange}
                    />
                    <span
                      onClick={() => setIsShowPassword(!isshowpassword)}
                      style={{ fontSize: "20px" }}
                    >
                      {" "}
                      {isshowpassword === false ? <IoMdEye /> : <IoIosEyeOff />}
                    </span>
                  </div>

                  <div
                    className={`field d-flex align-items-center ${
                      isfocus === true && index === 4 ? "focus" : ""
                    }`}
                    onFocus={() => Focusfun(4)}
                    onBlur={() => setIsFocus(false)}
                  >
                    <FaCircleCheck className="mr-3 ml-2" />

                    <input
                      type={`${isshowpassword === true ? "text" : "password"}`}
                      required
                      placeholder="Confirm Your Password"
                      name="confirmPassword"
                      onChange={inputChange}
                    />
                    <span
                      onClick={() => setIsShowPassword(!isshowpassword)}
                      style={{ fontSize: "20px" }}
                    >
                      {" "}
                      {isshowpassword === false ? <IoMdEye /> : <IoIosEyeOff />}
                    </span>
                  </div>

                  <div className="btn mt-4 p-0">
                    <Button
                      type="submit"
                      variant="contained"
                      className="w-100"
                      style={{
                        padding: "8px 0px",
                        borderRadius: "10px",
                        textTransform: "capitalize",
                        fontSize: "16px",
                        marginBottom: "10px",
                      }}
                    >
                      Sign Up &nbsp;
                      {isloading === true && (
                        <CircularProgress
                          color="inherit"
                          className="ml-2 load"
                        />
                      )}
                    </Button>
                  </div>
                  <p style={{ position: "relative", textAlign: "center" }}>
                    <span
                      style={{
                        // backgroundColor: "white",
                        // padding: "0 10px",
                        borderRadius: "100%",
                        backgroundColor: "#ebe6e6",
                        padding: "8px 10px",
                      }}
                    >
                      or
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "0",
                        right: "0",
                        height: "1px",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: "-1",
                      }}
                    ></span>
                  </p>

                  <div className="d-flex align-items-center icons">
                    <Button variant="outlined" onClick={signUpWithGoogle}>
                      <FcGoogle />
                      &nbsp; SignUp with Google
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="container" style={{ marginTop: "200px" }}>
              <h1 className="mb-3" style={{ fontWeight: "700" }}>
                Best UI/UX Fashion Ecommerce Dashboard & Admin Panel
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "25px",
                  fontWeight: "500",
                }}
              >
                A Fashion E-commerce Dashboard & Admin Panel is a sleek,
                user-friendly tool designed to simplify managing an online
                fashion store. It offers intuitive navigation for tasks like
                tracking sales, managing inventory, handling orders, and viewing
                analytics. With modern UI/UX design
              </p>
              <Link to={"/dashboard"}>
                <Button variant="contained">Go To Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
