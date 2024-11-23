import Button from "@mui/material/Button";
import { IoMenu } from "react-icons/io5";
import { FaAnglesDown, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navigation = (props) => {
  const [opensidebarNav, setopensidebarNav] = useState(false);
  const { data } = props;

  return (
    <nav>
      <div className="container">
        <div className="row">
          <div
            className="col-sm-2 navpart1"
            style={{ padding: "20px 0px 0px 35px" }}
          >
            <div className="cateList">
              <Button
                className="labelbut align-items-center"
                onClick={() => setopensidebarNav(!opensidebarNav)}
              >
                <span className="icon1 mr-2">
                  <IoMenu />
                </span>
                <span
                  className="text  main-button p-2"
                  style={{ whiteSpace: "nowrap" }}
                >
                  All Categories
                </span>
                <span className="icon2 ml-3">
                  <FaAnglesDown />
                </span>
              </Button>
              <hr
                style={{
                  position: "absolute",
                  top: "90px",
                  left: "0",
                  width: "100vw",
                  margin: "0",
                  border: "none",
                  borderTop: "1px solid gray",
                }}
              />
              <div
                className={`sidebarNav shadow ${opensidebarNav ? "open" : ""}`}
                style={{ marginTop: "10px", marginLeft: "10px" }}
              >
                <ul className="list list-inline" style={{ padding: "0" }}>
                  {data?.length !== 0 &&
                    data?.map((item, index) => (
                      <li key={item.id} className="list-inline-item">
                        <Link to={`/category/${item._id}`}>{item.name}</Link>

                        <div className="submenu2 AllCatmenu">
                          <ul>
                            {item?.children?.length !== 0 &&
                              item?.children?.map((subCat, index) => (
                                <li key={subCat._id}>
                                  <Link to={`/subCat/${subCat._id}`}>
                                    <Button>{subCat?.name}</Button>
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-10 navpart2 d-flex align-items-center justify-content-center">
            <div className="ml-4">
              <ul className="list list-inline" style={{ padding: "0" }}>
                <li key="Home" className="list-inline-item">
                  <Link to={"/"}>Home</Link>
                </li>
                {data &&
                  data.map((item, index) =>
                    index < 5 ? (
                      <li key={item.id} className="list-inline-item">
                        <Link to={`/category/${item._id}`}>{item.name}</Link>
                        {item?.children?.length > 0 && (
                          <div className="submenu mt-4">
                            <ul>
                              {item.children.map((subCat, idx) => (
                                <li key={`${subCat._id}-${idx}`}>
                                  <Link to={`/subCat/${subCat._id}`}>
                                    <Button>{subCat.name}</Button>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ) : null
                  )}
                <li key="about-us" className="list-inline-item">
                  <Link to="/aboutus">About Us</Link>
                </li>
                <li key="contact-us" className="list-inline-item">
                  <Link to="/contactus">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
