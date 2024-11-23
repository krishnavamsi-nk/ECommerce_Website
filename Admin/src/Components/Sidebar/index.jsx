import Button from "@mui/material/Button";
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdBorderColor } from "react-icons/md";
import { RiMessage2Line } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import { SiAnytype } from "react-icons/si";
import { FaAngleDown } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";

const Sidebar = () => {
  const context = useContext(MyContext);
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(0);
  const [istogglesubmenu, setisToggleSubmenu] = useState(false);
  const history = useNavigate();

  const isOpenSubmenu = (index) => {
    setActiveTab(index);
    setisToggleSubmenu(!istogglesubmenu);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Check if the user is an admin
      if (!parsedUser.isAdmin && location.pathname !== "/") {
        // Redirect non-admin users to the homepage if they try to access other routes
        context.setAlertBox({
          msg: "Please Login As Admin to continue Further",
          color: "error",
          open: true,
        });
        history("/");
      }
    }

    if (storedToken !== null && storedToken !== "") {
      context.setIsSignin(true);
    } else {
      context.setIsSignin(false);
      // Check if the path is allowed ("/" or "/dashboard")
      if (location.pathname !== "/" && location.pathname !== "/dashboard") {
        history("/login");
      }
    }
  }, [location.pathname, context, history]);

  return (
    <>
      <div
        className={`sidebar ${
          context.isToggleSidebar === true ? "close" : "open"
        }`}
      >
        <ul>
          <li>
            <Link to="/dashboard">
              <Button
                className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(0)}
              >
                <span>
                  <span className="pr-3 icon">
                    <MdDashboard />
                  </span>
                  Dashboard
                </span>
              </Button>
            </Link>
          </li>

          <li>
            <Link to="/product/list">
              <Button
                className={`w-100 ${activeTab === 1 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(1)}
              >
                <span>
                  <span className="pr-3 icon">
                    <MdOutlineProductionQuantityLimits />
                  </span>
                  Products
                </span>
                <span className="arrow">
                  {activeTab === 1 && istogglesubmenu === true ? (
                    <FaAngleDown />
                  ) : (
                    <FaAngleRight />
                  )}
                </span>
              </Button>
            </Link>

            <div
              className={`submenuwrapper ${
                activeTab === 1 && istogglesubmenu === true
                  ? "opem"
                  : "collapse"
              }`}
            >
              <ul className="sub-menu">
                <li>
                  <Link to="/product/list">Product List</Link>
                </li>
                {/* <li>
                  <Link to="/product/details">Product View</Link>
                </li> */}
                <li>
                  <Link to="/product/upload">Product Upload</Link>
                </li>

                <li>
                  <Link to="/productRAMS/list">Product RAMS</Link>
                </li>

                <li>
                  <Link to="/productWEIGHT/list">product WEIGHT</Link>
                </li>

                <li>
                  <Link to="/productSIZE/list">product SIZE</Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to="/category/List">
              <Button
                className={`w-100 ${activeTab === 2 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(2)}
              >
                <span>
                  <span className="pr-3 icon">
                    <SiAnytype />
                  </span>
                  Category
                </span>
                <span className="arrow">
                  {activeTab === 2 && istogglesubmenu === true ? (
                    <FaAngleDown />
                  ) : (
                    <FaAngleRight />
                  )}
                </span>
              </Button>
            </Link>

            <div
              className={`submenuwrapper ${
                activeTab === 2 && istogglesubmenu === true
                  ? "opem"
                  : "collapse"
              }`}
            >
              <ul className="sub-menu">
                <li>
                  <Link to="/category/List">Category List</Link>
                </li>
                <li>
                  <Link to="/category/Add">Category Add</Link>
                </li>
                <li>
                  <Link to="/subcategory/List">SubCategory List</Link>
                </li>
                <li>
                  <Link to="/subcategory/Add">SubCategory Add</Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link to="/banner/List">
              <Button
                className={`w-100 ${activeTab === 3 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(3)}
              >
                <span>
                  <span className="pr-3 icon">
                    <SiAnytype />
                  </span>
                  Banner
                </span>
                <span className="arrow">
                  {activeTab === 2 && istogglesubmenu === true ? (
                    <FaAngleDown />
                  ) : (
                    <FaAngleRight />
                  )}
                </span>
              </Button>
            </Link>

            <div
              className={`submenuwrapper ${
                activeTab === 3 && istogglesubmenu === true
                  ? "opem"
                  : "collapse"
              }`}
            >
              <ul className="sub-menu">
                <li>
                  <Link to="/banner/List">Banner List</Link>
                </li>
                <li>
                  <Link to="/banner/Add">Banner Add</Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link to="/order">
              <Button
                className={`w-100 ${activeTab === 4 ? "active" : ""}`}
                onClick={() => isOpenSubmenu(4)}
              >
                <span>
                  <span className="pr-3 icon">
                    <FaBasketShopping />
                  </span>
                  Orders
                </span>
              </Button>
            </Link>
          </li>
        </ul>

        <br />
        <div className="logoutWrapper w-100">
          <div className="logoutBox">
            <Button variant="contained">Logout</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
