import { useState, useEffect, useContext } from "react";
import { Mycontext } from "../../App.jsx";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import logo from "../../assets/images/ecom-logo.jpg";
import TextField from "@mui/material/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { firebaseApp } from "../../firebase.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const context = useContext(Mycontext);
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const [isloading, setIsLoading] = useState(false);

  const history = useNavigate();

  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
  });

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

                const user = {
                  name: res?.user?.name,
                  email: res?.user?.email,
                  userId: res?.user?._id, // Correctly map `_id`
                  isAdmin: res?.user?.isAdmin, // Ensure the field name matches
                };
                localStorage.setItem("user", JSON.stringify(user));

                context.setAlertBox({
                  msg: res.msg,
                  open: true,
                  color: "success", // Use "success" as the color
                });

                setTimeout(() => {
                  setIsLoading(false);
                  window.location.href = "/";

                  localStorage.setItem("mainloader", "false"); // Persist loader state
                  context.setMainLoader(false); // Update state
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
          msg: error.message,
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

  return (
    <>
      <div className="section1  form-in">
        <div className="form d-flex justify-content-center">
          <div className="mt-2 shadow p-5">
            <div className="container d-flex justify-content-center">
              <div className="ecom-icon d-flex align-items-center mb-3 mr-4">
                <Link to={"/"}>
                  {" "}
                  <img src={logo} alt="Logo" />
                </Link>
              </div>
            </div>
            <h4>Sign In</h4>
            <form
              action=""
              className="mt-3 sign-in w-100"
              onSubmit={formsubmit}
            >
              <TextField
                id="standard-basic"
                label="Email"
                onChange={inputChange}
                name="email"
                variant="standard"
                type="email"
                required
                className="textf"
              />

              <TextField
                id="standard-basic"
                label="Password"
                variant="standard"
                onChange={inputChange}
                name="password"
                required
                type="password"
                className="textf"
              />

              {/* <Link to="#">
                <p className="mt-3 mb-3 text-primary">Forgot password ?</p>
              </Link> */}
              <div className="sign-btn d-flex justify-content-between">
                <Button
                  type="submit"
                  className="w-90 pl-4 pr-4"
                  variant="contained"
                >
                  Sign In &nbsp;
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
              Not Registered?{" "}
              <Link to="/signup">
                <span>Sign Up</span>
              </Link>
            </p>
            <div className="flex-column d-flex align-items-center font-weight-bold">
              <p>Or Continue with Social Accounts</p>

              <div className="d-flex align-items-center icons">
                <Button variant="outlined" onClick={signInWithGoogle}>
                  <FcGoogle />
                  &nbsp; SignIn with Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
