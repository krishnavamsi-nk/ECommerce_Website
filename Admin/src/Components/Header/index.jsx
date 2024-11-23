import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { RiMenuAddLine } from "react-icons/ri";
import { MdLightMode } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import SearchBox from "./SearchBox";
import React, { useState, useEffect, useContext } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { IoShieldHalfSharp } from "react-icons/io5";
import Divider from "@mui/material/Divider";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notify, setnotify] = useState(null);
  const open = Boolean(anchorEl);
  const opennotify = Boolean(notify);
  const history = useNavigate();

  const context = useContext(MyContext);

  useEffect(() => {
    if (context.toggleTheme) {
      context.setThemeMode("dark");
    } else {
      context.setThemeMode("light");
    }

    // console.log(context.toggleTheme)
  }, [context.toggleTheme]);

  // useEffect(() => {
  //   console.log(context.themeMode);
  // }, [context.themeMode]);

  const handleOpenMyAccdr = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccdr = () => {
    setAnchorEl(null);
  };

  const LogoutFun = () => {
    setAnchorEl(null);
    localStorage.clear();
    context.setAlertBox({
      msg: "Logout Successfully",
      color: "success",
      open: true,
    });
    setTimeout(() => {
      history("/login");
    }, 2000);
  };

  const handleOpenMyNotify = (event) => {
    setnotify(event.currentTarget);
  };
  const handleCloseMyNotify = () => {
    setnotify(null);
  };

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center">
            <div className="col-sm-2 part1">
              <Link className="d-flex align-items-center logo" to={"/"}>
                <img
                  src="https://cdn.prod.website-files.com/64ea57571d50b02423c4505d/64fb2348a8916b03b1f553da_roman%20reigns%20logo.png"
                  alt="admin logo"
                />
                <span className="ml-2">RomAdmin</span>
              </Link>
            </div>

            <div className="col-sm-4 part2 ml-5 d-flex align-items-center">
              <Button
                className="rounded-circle"
                onClick={() =>
                  context.setIsToggleSidebar(!context.isToggleSidebar)
                }
              >
                <RiMenuAddLine />
              </Button>
              <SearchBox />
            </div>

            <div className="col-sm-5 part-3 d-flex align-items-center justify-content-end ml-5">
              <Button
                className="rounded-circle expand-icon"
                onClick={() => context.setToggleTheme(!context.toggleTheme)}
              >
                <MdLightMode />
              </Button>
              <Button className="rounded-circle cart-icon">
                <FaCartArrowDown />
              </Button>
              <Button className="rounded-circle email-icon">
                <MdOutlineEmail />
              </Button>
              <div className="menuwrapper position-relative">
                <Button className="rounded-circle" onClick={handleOpenMyNotify}>
                  <IoIosNotifications />
                </Button>
                <Menu
                  anchorEl={notify}
                  id="notifications"
                  className="notifications headnote"
                  open={opennotify}
                  onClose={handleCloseMyNotify}
                  onClick={handleCloseMyNotify}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <div className="head">
                    <h4>Notifications(4)</h4>
                  </div>
                  <Divider className="mb-1" />
                  <div className="scroll">
                    <MenuItem onClick={handleCloseMyNotify}>
                      <div className="item-row d-flex align-items-center">
                        <div className="rounded-circle">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6quMQa31LcLHaNdJrTmOiHX-ec18VOhs4w&s"
                            alt=""
                          />
                        </div>

                        <div className="info-note ml-2 w-100">
                          <span>
                            <b className="mr-1">Muhammmadul</b>
                            added to his favorite list
                            <b className="ml-1 mb-2">
                              Leather belt steve madden
                            </b>
                            <p>few seconds ago</p>
                          </span>
                        </div>
                      </div>
                    </MenuItem>
                    <Divider
                      className="mb-0 mt-0"
                      style={{ border: "1px solid rgba(0,0,0,0.2)" }}
                    />

                    <MenuItem onClick={handleCloseMyNotify}>
                      <div className="item-row d-flex align-items-center">
                        <div className="rounded-circle">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6quMQa31LcLHaNdJrTmOiHX-ec18VOhs4w&s"
                            alt=""
                          />
                        </div>

                        <div className="info-note ml-2 w-100">
                          <span>
                            <b className="mr-1">Muhammmadul</b>
                            added to his favorite list
                            <b className="ml-1 mb-2">
                              Leather belt steve madden
                            </b>
                            <p>few seconds ago</p>
                          </span>
                        </div>
                      </div>
                    </MenuItem>

                    <Divider
                      className="mb-0 mt-0"
                      style={{ border: "1px solid rgba(0,0,0,0.2)" }}
                    />

                    <MenuItem onClick={handleCloseMyNotify}>
                      <div className="item-row d-flex align-items-center">
                        <div className="rounded-circle">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6quMQa31LcLHaNdJrTmOiHX-ec18VOhs4w&s"
                            alt=""
                          />
                        </div>

                        <div className="info-note ml-2 w-100">
                          <span>
                            <b className="mr-1">Muhammmadul</b>
                            added to his favorite list
                            <b className="ml-1 mb-2">
                              Leather belt steve madden
                            </b>
                            <p>few seconds ago</p>
                          </span>
                        </div>
                      </div>
                    </MenuItem>

                    <Divider
                      className="mb-0 mt-0"
                      style={{ border: "1px solid rgba(0,0,0,0.2)" }}
                    />

                    <MenuItem onClick={handleCloseMyNotify}>
                      <div className="item-row d-flex align-items-center">
                        <div className="rounded-circle">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6quMQa31LcLHaNdJrTmOiHX-ec18VOhs4w&s"
                            alt=""
                          />
                        </div>

                        <div className="info-note ml-2 w-100">
                          <span>
                            <b className="mr-1">Muhammmadul</b>
                            added to his favorite list
                            <b className="ml-1 mb-2">
                              Leather belt steve madden
                            </b>
                            <p>few seconds ago</p>
                          </span>
                        </div>
                      </div>
                    </MenuItem>

                    <Divider
                      className="mb-0 mt-0"
                      style={{ border: "1px solid rgba(0,0,0,0.2)" }}
                    />

                    <MenuItem onClick={handleCloseMyNotify}>
                      <div className="item-row d-flex align-items-center">
                        <div className="rounded-circle">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6quMQa31LcLHaNdJrTmOiHX-ec18VOhs4w&s"
                            alt=""
                          />
                        </div>

                        <div className="info-note ml-2 w-100">
                          <span>
                            <b className="mr-1">Muhammmadul</b>
                            added to his favorite list
                            <b className="ml-1 mb-2">
                              Leather belt steve madden
                            </b>
                            <p>few seconds ago</p>
                          </span>
                        </div>
                      </div>
                    </MenuItem>
                  </div>

                  <div className="notifies d-flex justify-content-center pl-2 pr-2 pt-1">
                    <Button className="btn-blue w-100 btn-blue">
                      View All Notifications
                    </Button>
                  </div>
                </Menu>
              </div>

              {context.issignin === false ? (
                <Link to="/login">
                  {" "}
                  <Button className="btn-round" variant="contained">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <div className="myAccWrapper">
                  <Button
                    onClick={handleOpenMyAccdr}
                    className="myAcc d-flex align-items-center ml-3"
                    style={{
                      borderRadius: "12px",
                      color: "black",
                      textTransform: "capitalize",
                    }}
                  >
                    <div className="rounded-circle">
                      {/* <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV6quMQa31LcLHaNdJrTmOiHX-ec18VOhs4w&s"
                        alt=""
                      /> */}
                      <p style={{ fontWeight: "900", color: "blue" }}>
                        {" "}
                        {context.user?.name?.charAt(0)}
                      </p>
                    </div>
                    <div
                      className="userinfo d-flex flex-column ml-2"
                      style={{ textAlign: "left" }}
                    >
                      <h5
                        style={{
                          fontSize: "15px",
                          fontWeight: "bolder",
                          margin: "0px",
                        }}
                      >
                        {context.user?.name}
                      </h5>
                      <p
                        className="mb-0"
                        style={{ fontSize: "12px", color: "black" }}
                      >
                        {context.user?.email}
                      </p>
                    </div>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleCloseMyAccdr}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleCloseMyAccdr}>
                      <Link to="/myaccount">
                        {" "}
                        <ListItemIcon>
                          <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        My account
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMyAccdr}>
                      <ListItemIcon>
                        <IoShieldHalfSharp fontSize="large" />
                      </ListItemIcon>
                      Reset password
                    </MenuItem>
                    <MenuItem onClick={LogoutFun}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
