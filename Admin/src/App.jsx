import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Components/Sidebar";

import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ProductDetails from "./Pages/Product/detailsProduct";
import ProductUpload from "./Pages/Product/addProduct";
import CategoryAdd from "./Pages/Category/addCategory";
import CategoryList from "./Pages/Category/listCategory";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import ProductList from "./Pages/Product/listProduct";
import EditCategory from "./Pages/Category/editCategory";
import EditProduct from "./Pages/Product/editProduct";
import SubCategoryAdd from "./Pages/Category/subCategoryAdd";
import SubCategoryList from "./Pages/Category/subCategoryList";
import SubCategoryEdit from "./Pages/Category/subCategoryEdit";
import { fetchDataFromApi } from "./utils/api";
import AddProductRAMS from "./Pages/Product/addProductRAMS";
import AddProductWEIGHT from "./Pages/Product/addProductWEIGHT";
import AddProducSIZE from "./Pages/Product/addproductSIZE";
import Order from "./Pages/Orders";
import BannerAdd from "./Pages/Banners/addBanner";
import BannerList from "./Pages/Banners/listBanner";
import BannerEdit from "./Pages/Banners/editBanner";
import MyAccount from "./Pages/MyAccount";


import "./App.css";
import "./responsive.css";
const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isHeaderAndSidebarShow, setIsHeaderAndSidebarShow] = useState(true);
  const [themeMode, setThemeMode] = useState("light");
  const [toggleTheme, setToggleTheme] = useState(false);
  const [progress, setProgress] = useState(0);

  
  const [issignin, setIsSignin] = useState(null);

  const [alertbox, setAlertBox] = useState({
    msg: "",
    color: "",
    open: false,
  });
  const [user, setUser] = useState({ name: "", email: "", userId: "" });



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
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(themeMode);
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode, toggleTheme]);

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isHeaderAndSidebarShow,
    setIsHeaderAndSidebarShow,
    themeMode,
    setThemeMode,
    toggleTheme,
    setToggleTheme,
    alertbox,
    setAlertBox,
    setProgress,
    issignin,
    setIsSignin,
    user,
    setUser,
  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
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
          {isHeaderAndSidebarShow === true && <Header />}

          <div className="main d-flex">
            {isHeaderAndSidebarShow === true && (
              <div
                className={`sidebarWrapper ${
                  isToggleSidebar === true ? "half" : "full"
                }`}
              >
                <Sidebar />
              </div>
            )}

            <div
              className={`content ${
                isHeaderAndSidebarShow === false && "full"
              } ${isToggleSidebar === true ? "full" : "half"}`}
            >
              <Routes>
                <Route path="/" exact={true} element={<Dashboard />} />
                <Route path="/dashboard" exact={true} element={<Dashboard />} />
                <Route path="/login" exact={true} element={<Login />} />
                <Route path="/signup" exact={true} element={<SignUp />} />
                <Route path="/order" exact={true} element={<Order />} />
                <Route path="/banner/Add" exact={true} element={<BannerAdd />} />
                <Route path="/banner/List" exact={true} element={<BannerList />} />
                <Route path="/banner/Edit/:id" exact={true} element={<BannerEdit />} />
                <Route path="/myaccount" exact={true} element={<MyAccount />} />
                
                <Route
                  path="/product/details/:id"
                  exact={true}
                  element={<ProductDetails />}
                />
                <Route
                  path="/product/upload"
                  exact={true}
                  element={<ProductUpload />}
                />
                <Route
                  path="/category/Add"
                  exact={true}
                  element={<CategoryAdd />}
                />
                <Route
                  path="/category/List"
                  exact={true}
                  element={<CategoryList />}
                />
                <Route
                  path="/product/List"
                  exact={true}
                  element={<ProductList />}
                />
                <Route
                  path="/category/edit/:id"
                  exact={true}
                  element={<EditCategory />}
                />
                <Route
                  path="/product/edit/:id"
                  exact={true}
                  element={<EditProduct />}
                />
                <Route
                  path="/subcategory/Add"
                  exact={true}
                  element={<SubCategoryAdd />}
                />
                <Route
                  path="/subcategory/List"
                  exact={true}
                  element={<SubCategoryList />}
                />
                <Route
                  path="/subcategory/Edit/:id"
                  exact={true}
                  element={<SubCategoryEdit />}
                />
                <Route
                  path="/productRAMS/List"
                  exact={true}
                  element={<AddProductRAMS />}
                />
                <Route
                  path="/productWEIGHT/List"
                  exact={true}
                  element={<AddProductWEIGHT />}
                />
                <Route
                  path="/productSIZE/List"
                  exact={true}
                  element={<AddProducSIZE />}
                />
              </Routes>
            </div>
          </div>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;

export { MyContext };
