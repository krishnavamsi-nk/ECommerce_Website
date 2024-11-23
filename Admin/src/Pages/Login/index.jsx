import Logo from "../../assets/images/adm.png";
import { useEffect, useContext, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaTwitterSquare } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { firebaseApp } from "../../firebase.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const context = useContext(MyContext);
  const [userId, setUserId] = useState({});
  const [isfocus, setIsFocus] = useState(false);
  const [index, setIndex] = useState(0);
  const [isshowpassword, setIsShowPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const history = useNavigate();

  const Focusfun = (index) => {
    setIsFocus(true);
    setIndex(index);
  };

  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
  });

  useEffect(()=>{
  console.log("the user:",userId);
  },[userId]);

  const signInWithGoogle = () => {
    
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
        };

        postData("/api/user/authWithGoogle", fields)
          .then((res) => {
            try {
              if (res.error !== true) {
                localStorage.setItem("token", res.token);
                console.log("the userID:",res.user);
                setUserId(res.user);
                const user = {
                  name: res?.user?.name,
                  email: res?.user?.email,
                  userId: res?.user?._id, // Correctly map `_id`
                  isAdmin: res?.user?.isAdmin, // Ensure the field name matches
                }
                localStorage.setItem("user", JSON.stringify(user));

                context.setAlertBox({
                  msg: res.msg,
                  open: true,
                  color: "success", // Use "success" as the color
                });

                setTimeout(() => {
                  setIsLoading(false);
                  window.location.href = "/";
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
          error: true,
        });
      });
  };

  const validateFields = (fields) => {
    if (fields.email === "") return "The name is required";

    if (fields.password === "") return "Please Provide the Password";

    return null;
  };

  const formsubmit = (e) => {
    e.preventDefault();

    const Validation = validateFields(formfields);
    if (Validation) {
      return context.setAlertBox({
        msg: Validation,
        color: "error",
        open: true,
      });
    }
    setIsLoading(true);

    postData("/api/user/signin", formfields)
      .then((res) => {
        console.log("Response from backend:", res); // Ensure you are getting the correct response here

        // Check if the response has success: false (indicating failure)
        if (res.success === false) {
          setIsLoading(false);
          context.setAlertBox({
            msg: res.msg || "Invalid Credentials", // If msg is not provided, use the default
            color: "error",
            open: true,
          });
        } else {
          // Success case
          localStorage.setItem("token", res.token);
          context.setIsSignin(true);
          const user = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id,
            isAdmin: res.user?.isAdmin,
          };
          localStorage.setItem("user", JSON.stringify(user));

          context.setAlertBox({
            msg: "SignIn successful",
            color: "success",
            open: true,
          });

          setTimeout(() => {
            setIsLoading(false);
            history("/"); // Redirect to the homepage
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        // Handle unexpected errors
        setIsLoading(false);
        context.setAlertBox({
          msg: "An unexpected error occurred",
          color: "error",
          open: true,
        });
      });

    console.log("Form fields submitted:", formfields);
  };

  const inputChange = (e) => {
    setFormfields((prevs) => ({
      ...prevs,
      [e.target.name]: e.target.value,
    }));
  };

  const location = useLocation(); // Hook to detect route changes

  useEffect(() => {
    context.setIsHeaderAndSidebarShow(false);
    context.setIsToggleSidebar(true);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
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
      <div className="loginSection d-flex flex-column">
        <div className="loginBox d-flex flex-column align-items-center">
          <Link to="/dashboard">
            <div className="logo">
              <img src={Logo} alt="" />
            </div>
          </Link>
          <h5>Login To RomAdmin</h5>
        </div>

        <div className="form">
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
              <MdEmail className="mr-3 ml-2" />

              <input
                type="email"
                required
                placeholder="Enter Your Email"
                autoFocus
                name="email"
                autoComplete="username"
                onChange={inputChange}
              />
            </div>

            <div
              className={`field d-flex align-items-center ${
                isfocus === true && index === 1 ? "focus" : ""
              }`}
              onFocus={() => Focusfun(1)}
              onBlur={() => setIsFocus(false)}
            >
              <FaShieldAlt className="mr-3 ml-2" />

              <input
                type={`${isshowpassword === true ? "text" : "password"}`}
                required
                placeholder="Enter Your Password"
                name="password"
                onChange={inputChange}
                autoComplete="current-password"
              />

              <span
                onClick={() => setIsShowPassword(!isshowpassword)}
                style={{ fontSize: "20px" }}
              >
                {" "}
                {isshowpassword === false ? <IoMdEye /> : <IoIosEyeOff />}
              </span>
            </div>

            {/* <div className="formoptions">
              <FormControl fullWidth className="selectopt">
                <InputLabel
                  id="demo-simple-select-label"
                  className="pl-1"
                  style={{ fontSize: "15px" }}
                >
                  {" "}
                  <FaCircleCheck
                    className="mr-2"
                    style={{ fontSize: "16px" }}
                  />{" "}
                  select options
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem className="opt-items" value={10}>
                    Ten
                  </MenuItem>
                  <MenuItem className="opt-items" value={20}>
                    Twenty
                  </MenuItem>
                  <MenuItem className="opt-items" value={30}>
                    Thirty
                  </MenuItem>
                </Select>
              </FormControl>
            </div> */}

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
                Sign in &nbsp;
                {isloading === true && (
                  <CircularProgress color="inherit" className="ml-2 load" />
                )}
              </Button>
              {/* <Link
                to="/forgetpassword"
                style={{ textDecoration: "none", fontSize: "14px" }}
              >
                <p>Forget Password</p>
              </Link> */}
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
          </form>

          <div className="d-flex align-items-center icons">
            <Button variant="outlined" onClick={signInWithGoogle}>
              <FcGoogle />
              &nbsp; SignIn with Google
            </Button>
          </div>

          <div
            className="wrapper mb-5"
            style={{ textAlign: "center", fontSize: "15px" }}
          >
            <span>
              Don't have an Account?
              <Link to={"/signup"}>Register</Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
