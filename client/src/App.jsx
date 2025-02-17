import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link } from "react-router-dom";
import "./responsive.css";
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/index.jsx";
import Home from "./Pages/Home/index.jsx";
import { createContext } from "react";
import axios from "axios";
import Footer from "./Components/Footer/index.jsx";
import ProductDetails from "./Components/HomeBanner/ProductDetails/index.jsx";
import Listing from "./Pages/Listing/index.jsx";
import ProductPage from "./Pages/Productpage";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { fetchDataFromApi, postData } from "./utils/api.jsx";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LoadingBar from "react-top-loading-bar";
import MyList from "./Pages/MyList";
import Checkout from "./Pages/Checkout";
import Order from "./Pages/Orders";
import SearchPage from "./Pages/SearchPage";
import MyAccount from "./Pages/MyAccount";
import Payment from "./Pages/Payment";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";

const Mycontext = createContext();

function App() {
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [countryList, setCountryList] = useState([]);
  const [progress, setProgress] = useState(0);

  const [mainloader, setMainLoader] = useState(() => {
    return localStorage.getItem("mainloader") === "false" ? false : true;
  });

  const [openproduct, setopenproduct] = useState({
    id: "",
    open: false,
  });
  const [alertbox, setAlertBox] = useState({
    msg: "",
    color: "",
    open: false,
  });
  const [issignin, setIsSignin] = useState(null);
  const [addingCart, setAddingCart] = useState(false);

  const [catdataList, setCatdataList] = useState({});

  const [productdata, setProductData] = useState({});
  const [activeCat, setActiveCat] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [searchData, setSearchData] = useState([]);

  const [user, setUser] = useState({ name: "", email: "", userId: "" });
  const [cartData, setCartData] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [totalitems, setTotalItems] = useState(0);
  const [totalcost, setTotalCost] = useState(0);
  const [totalCartData, setTotalCartsData] = useState([]);
  const [checkOut, setCheckOut] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    country: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    paymentId: "",
    userId: "",
    amount: "",
  });

  useEffect(() => {
    console.log("this is the Order:", orderData);
  }, [orderData]);

  useEffect(() => {
    if (openproduct.open === true) {
      // Check if openproduct is open
      fetchDataFromApi(`/api/product/${openproduct.id}`).then((res) => {
        setProductData(res);
      });
    }
  }, [openproduct]);

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatdataList(res);

      setTimeout(() => {
        // setMainLoader(true);
      }, 2000);
    });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((ress) => {
        console.log("res:", ress);
        if (ress.success !== false) {
          setTotalCartsData(ress);
        }
      });
    }
  }, [issignin]);

  useEffect(() => {
    const items =
      totalCartData?.length !== 0 &&
      totalCartData
        ?.map((item) => item.quantity)
        .reduce((total, value) => total + value, 0);
    setTotalItems(items);
    const itemscost =
      totalCartData?.length !== 0 &&
      totalCartData
        ?.map((item) => parseInt(item.quantity * item.price))
        .reduce((total, value) => total + value, 0);
    setTotalCost(itemscost);
  }, [totalCartData]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return setAlertBox({
        ...alertbox,

        open: false,
      });
    }

    setAlertBox({
      ...alertbox,
      open: false,
    });
  };

  const addToCart = (data) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const subtotal = parseInt(data.discountPrice * quantity);
      setAddingCart(true);

      const updatedCartData = {
        name: data.name,
        images: data.images[0],
        price: data.discountPrice,
        rating: data.rating,
        quantity: quantity,
        subTotal: subtotal,
        prodId: data.id,
        userId: user.userId,
      };

      setCartData(updatedCartData);
      console.log("the Data:", updatedCartData);

      postData("/api/cart/add", updatedCartData).then((res) => {
        if (res.success !== false) {
          setAlertBox({
            msg: "The Item Added to Cart",
            color: "success",
            open: true,
          });
          setTimeout(() => {
            setAddingCart(false);
          }, 2000);
        } else {
          setAlertBox({
            msg: res.msg,
            color: "error",
            open: true,
          });
          setAddingCart(false);
        }
      });
    } else {
      setAlertBox({
        msg: "Please Login to AddToCart",
        color: "error",
        open: true,
      });
    }

    // history("/");
  };

  useEffect(() => {
    console.log("the Data in useEffect:", cartData);
  }, [cartData]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (storedToken !== null && storedToken !== "") {
      setIsSignin(true);
    } else {
      setIsSignin(false);
    }
  }, [issignin]);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
  }, []);

  const getCountry = async (url) => {
    const response = axios.get(url).then((res) => {
      setCountryList(res.data.data);
    });
  };

  const values = {
    totalCartData,
    setTotalCartsData,
    countryList,
    openproduct,
    setopenproduct,
    setisHeaderFooterShow,
    isHeaderFooterShow,
    productdata,
    setProductData,
    catdataList,

    activeCat,

    setSubTotal,
    subTotal,
    totalitems,
    setTotalItems,
    totalcost,
    setTotalCost,
    user,
    setUser,
    alertbox,
    setAlertBox,
    setProgress,
    issignin,
    setIsSignin,
    addToCart,
    cartData,
    setCartData,
    quantity,
    setQuantity,
    addingCart,
    setAddingCart,
    setOrderData,
    orderData,
    searchData,
    setSearchData,
    checkOut,
    setCheckOut,
    // main loader
    setMainLoader,
  };

  return (
    <>
      <BrowserRouter>
        <Mycontext.Provider value={values}>
          <LoadingBar
            color="#f11946"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
            className="top-loadingbar"
          />

          <Snackbar
            open={alertbox.open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={alertbox.color === "success" ? "success" : "error"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {alertbox.msg}
            </Alert>
          </Snackbar>

          {isHeaderFooterShow === true && <Header />}
          <Routes>
            <Route path="/" exact={true} element={<Home />} />
            <Route path="/subCat/:id" exact={true} element={<Listing />} />
            <Route path="/category/:id" exact={true} element={<Listing />} />
            <Route path="/product/:id" exact={true} element={<ProductPage />} />
            <Route path="/cart" exact={true} element={<Cart />} />
            <Route path="/mylist" exact={true} element={<MyList />} />
            <Route path="/signin" exact={true} element={<SignIn />} />
            <Route path="/signup" exact={true} element={<SignUp />} />
            <Route path="/checkout" exact={true} element={<Checkout />} />
            <Route path="/order" exact={true} element={<Order />} />
            <Route path="/searchpage" exact={true} element={<SearchPage />} />
            <Route path="/myaccount" exact={true} element={<MyAccount />} />
            <Route
              path="/payment/complete/:id"
              exact={true}
              element={<Payment />}
            />
            <Route path="/aboutus" exact={true} element={<AboutUs />} />
            <Route path="/contactus" exact={true} element={<ContactUs />} />
          </Routes>
          {isHeaderFooterShow === true && <Footer />}
          {openproduct.open === true && <ProductDetails data={productdata} />}
          {mainloader === true && (
            <div className="main-loader">
              <div className="container mode">
                <div className="choose-mode">
                  <div className="use mb-2">
                    <h2>Choose the Mode</h2>
                  </div>
                  <div className="list-mode">
                    <Button
                      onClick={() => {
                        localStorage.setItem("mainloader", "false"); // Persist loader state
                        setMainLoader(false);
                      }}
                    >
                      <Link to="/">User</Link>
                    </Button>
                    <Button>
                      <a
                        href="https://fullstack-ecom-admin.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Admin
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Mycontext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;

export { Mycontext };
