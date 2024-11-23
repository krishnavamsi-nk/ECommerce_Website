import react, { useContext, useEffect, useState } from "react";
import logo from "../../assets/images/ecom-logo.jpg";
import { Link } from "react-router-dom";
import CountryDrop from "../CountryDropdown/index";
import { CiSearch } from "react-icons/ci";
import Button from "@mui/material/Button";
import { IoSearchOutline } from "react-icons/io5";
import { PiUserSquareFill } from "react-icons/pi";
import { FaCartArrowDown } from "react-icons/fa";
import SearchBox from "./Searchbox/index";
import Navigation from "./Navigation/index";
import { Mycontext } from "../../App";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { FaBorderStyle } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import sicon from "../../assets/images/s.png";
import hicon from "../../assets/images/h.png";
import oicon from "../../assets/images/o.png";
import picon from "../../assets/images/p.png";
import yicon from "../../assets/images/y.png";

const Header = () => {
  const context = useContext(Mycontext);
  const history = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const LogoutUser = async () => {
    localStorage.clear();
    setAnchorEl(null);
    context.setIsSignin(false);
    context.setUser({});
    await new Promise((resolve) => {
      context.setTotalItems(0);
      context.setTotalCost(0);
      context.setTotalCartsData([]);
      resolve();
    });
    setTimeout(() => {
      history("/");
    }, 1000); // Delay by 100ms
  };

  useEffect(() => {
    console.log("Total Items in Header:", context.totalItems);
  }, [context.totalItems]);

  useEffect(() => {
    context.setisHeaderFooterShow(true);
  }, []);
  return (
    <>
      <div className="headerWrapper">
        <div className="top-strip">
          <div className="container bg-blue">
            <p className="mb-0 mt-0 text-center">
              Due to the <b>Covid-19</b> epedimic, orders may be processed with
              a slight delay
            </p>
          </div>
        </div>

        <header className="header">
          <div className="container-fluid">
            <div className="row">
              <div className="ecom-icon d-flex align-items-center col-sm-2">
                <Link to={"/"}>
                  {" "}
                  <img src={logo} alt="Logo" />
                  

                </Link>
              </div>
              <div className="col-sm-10  d-flex align-items-center part2">
                {context.countryList.length !== 0 && <CountryDrop />}

                <SearchBox />
                <div className="part3 d-flex align-items-center ml-3">
                  {context.issignin === false ? (
                    <Link to="/signin">
                      <Button
                        className="pl-3 pr-3"
                        style={{
                          outline: "none",
                          backgroundColor: "rgb(11 88 203)",
                          color: "white",
                          textTransform: "capitalize",
                        }}
                        onClick={() => context.setUser({})}
                      >
                        Sign in
                      </Button>{" "}
                    </Link>
                  ) : (
                    <>
                      <Button className="circle" onClick={handleClick}>
                        <PiUserSquareFill />
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        <Link to={"/myaccount"}>
                          {" "}
                          <MenuItem onClick={handleClose}>
                            <Avatar /> My account
                          </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem onClick={handleClose}>
                          <Link to={"/order"}>
                            <ListItemIcon>
                              <FaBorderStyle fontSize="small" />
                            </ListItemIcon>
                            Orders
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Link to={"/mylist"}>
                            <ListItemIcon>
                              <FaClipboardList />
                            </ListItemIcon>
                            My List
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Link to={"/checkout"}>
                            <ListItemIcon>
                              <FaBorderStyle fontSize="small" />
                            </ListItemIcon>
                            Checkout
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={LogoutUser}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  )}

                  <div className="ml-auto cartTab d-flex align-items-center">
                    <span className="price ml-3">
                      ${context.totalcost || 0}
                    </span>
                    <div className="cart ">
                      <Link to="/cart">
                        <Button className="circle ml-3">
                          <FaCartArrowDown />
                        </Button>
                      </Link>
                      <span className="circle-s" style={{ color: "white" }}>
                        {context?.totalitems || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {context.catdataList?.categoryList?.length !== 0 && (
            <Navigation data={context.catdataList?.categoryList} />
          )}
        </header>
      </div>
    </>
  );
};

export default Header;
