import { useState, useEffect, useContext } from "react";
import { Mycontext } from "../../App.jsx";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/images/ecom-logo.jpg";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingBar from "react-top-loading-bar";
import {firebaseApp} from "../../firebase.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const context = useContext(Mycontext);
  const history = useNavigate();
  const [isloading, setIsLoading] = useState(false);

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });


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
                localStorage.setItem("user", JSON.stringify(user));
  
                context.setAlertBox({
                  msg: res.msg,
                  open: true,
                  color: "success",  // Use "success" as the color
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
          color: "error",
        });
      });
  };


  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const location = useLocation(); // Hook to detect route changes
  const validateFields = (fields) => {
    if (fields.name === "") return "The name is required";
    if (fields.phone === "") return "Please Enter the Phone Number";
    if (fields.email === "") return "Please Provide the Email";
    if (fields.password === "") return "Please Provide the Password";
    return null;
  };

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
            history("/signin");
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
      <div className="section1  form-in">
        <div className="form d-flex justify-content-center">
          <div className="mt-2 shadow signu p-5">
            <div className="container d-flex justify-content-center">
              <div className="ecom-icon d-flex align-items-center mb-3 mr-4">
                <Link to={"/"}>
                  {" "}
                  <img src={logo} alt="Logo" />
                </Link>
              </div>
            </div>
            <h4>Sign Up</h4>
            <form
              action=""
              className="mt-3 sign-up w-100"
              onSubmit={formsubmit}
            >
              <div className="d-flex justify-content-between">
                <TextField
                  id="standard-basic"
                  label="Name"
                  variant="standard"
                  type="name"
                  required
                  className="textf pr-4"
                  name="name"
                  onChange={inputChange}
                />
                <TextField
                  id="standard-basic"
                  label="Contact"
                  variant="standard"
                  type="text"
                  required
                  name="phone"
                  onChange={inputChange}
                  className="textf"
                  inputProps={{ min: 1000000000, max: 9999999999 }}
                />
              </div>

              <TextField
                id="standard-basic"
                label="Email"
                variant="standard"
                type="email"
                required
                className="textf"
                name="email"
                onChange={inputChange}
              />

              <TextField
                id="standard-basic"
                label="Password"
                variant="standard"
                required
                type="password"
                className="textf"
                name="password"
                onChange={inputChange}
              />
              <div className="sign-btn d-flex justify-content-around pt-3">
                <Button
                  className="w-90 pl-4 pr-4"
                  variant="contained"
                  type="submit"
                >
                  Sign Up &nbsp;
                  {isloading === true && (
                    <CircularProgress color="inherit" className="ml-2 load" />
                  )}
                </Button>
                <Link to="/">
                  <Button
                    className="w-90 pl-4 pr-4"
                    variant="contained"
                    style={{
                      backgroundColor: "white",
                      color: "rgb(11 88 203)",
                    }}
                    onClick={() => context.setisHeaderFooterShow(true)}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
            <p className="mt-2">
              Already Registered?{" "}
              <Link to="/signin">
                <span>Login</span>
              </Link>
            </p>
            <div className="flex-column d-flex align-items-center font-weight-bold">
              <p>Or Continue with Social Accounts</p>
              <div className="d-flex align-items-center icons">
                <Button variant="outlined" onClick={signUpWithGoogle}>
                  <FcGoogle />&nbsp; SignUp with Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
