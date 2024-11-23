import Dashboardcom from "./components";
import { useEffect, useState, useContext } from "react";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { RiProductHuntLine } from "react-icons/ri";
import { GiStarsStack } from "react-icons/gi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaClockRotateLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import Button from "@mui/material/Button";
import { Chart } from "react-google-charts";
import Sortcomp from "./Sortcomponent";

import Pagination from "@mui/material/Pagination";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { fetchDataFromApi, deleteData } from "../../utils/api";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
export const apiUrl = import.meta.env.VITE_BASE_URL;
import Checkbox from "@mui/material/Checkbox";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [catdata, setCatData] = useState({});
  const context = useContext(MyContext);
  const [subCatData, setSubCatData] = useState([]);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;
  const [idFilter, setIdFilter] = useState("");
  const [nameId, setNameId] = useState("");
  const [productlist, setProductList] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [ orderCount,setOrdersCount] = useState(0);
  const [ userCount,setUserCount] = useState(0);
  const [ reviewsCount,setReviewsCount] = useState(0);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const productDelete = (id) => {
    context.setProgress(40);

    deleteData("/api/product", `/${id}`).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        msg: "prkoduct deleted successfully",
        color: "error",
        open: true,
      });

      fetchDataFromApi("/api/product").then((res) => {
        setProductList(res);
      });
    });
  };

  useEffect(() => {
    fetchDataFromApi("/api/product/get/count").then((res) => {
      setProductCount(res.productsCount);
    });
    fetchDataFromApi("/api/order/get/count").then((res) => {
      setOrdersCount(res.count);
    });
    fetchDataFromApi("/api/user//get/count").then((res) => {
      setUserCount(res.count);
    });
    fetchDataFromApi("/api/review//get/count").then((res) => {
      setReviewsCount(res.count);
    });
  }, []);

  useEffect(() => {
    const subCatArr = [];

    catdata?.categoryList?.length !== 0 &&
      catdata?.categoryList?.map((cat, index) => {
        if (cat?.children.length !== 0) {
          cat?.children?.map((subCat) => {
            subCatArr.push(subCat);
          });
        }
      });
    setSubCatData(subCatArr);
  }, [catdata]);

  const filterById = (Idx, name) => {
    setIdFilter(Idx);
    setNameId(name);
  };


  const handlePage = (event, value) => {
    context.setProgress(40);

    fetchDataFromApi(`/api/product?page=${value}`).then((res) => {
      setProductList(res);
      context.setProgress(100);
    });
  };

  useEffect(() => {
    context.setIsHeaderAndSidebarShow(true);
    context.setIsToggleSidebar(false);

    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res);
    });

    fetchDataFromApi("/api/product").then((res) => {
      setProductList(res);
      context.setProgress(100);
    });
  }, []);

  const data = [
    ["Task", "Hours per Day"],
    ["Production", 10],
    ["Profit", 2],
    ["Exports", 2],
    ["Sales", 8],
  ];
  const options2 = {
    title: "My Daily Activities",
    backgroundColor: "transparent",
    chartArea: { width: "95%", height: "100%" },
  };

  useEffect(() => {
    fetchDataFromApi(`/api/product?${nameId}=${idFilter}&perPage=20`).then((res) => {
      console.log(res);
      setProductList(res);
      context.setProgress(100);
    });
  }, [idFilter]);

  const options = ["Last Day", "Last Week", "Last Month", "Last Year"];
  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardwrapperbox d-flex">
          <div className="col-md-8 mt-4 pr-1">
            <div className="dashboardwrapper">
              <Dashboardcom
                color={["rgb(131 234 234)", "rgb(11 255 255)"]}
                name="Users"
                number={Number(userCount)}
                icon={<FaUsers />}
                rise={true}
                arrcolor="#78fff9"
                per={Number(45)}
              />
              <Dashboardcom
                color={["rgb(234 197 59)", "rgb(255 236 14)"]}
                name="Orders"
                number={Number(orderCount)}
                icon={<FaCartShopping />}
                rise={false}
                arrcolor=" rgb(254 234 16)"
                per={Number(68)}
              />
              <Dashboardcom
                color={["rgb(241 115 237)", "rgb(255 0 247)"]}
                name="Products"
                number={Number(productCount)}
                icon={<RiProductHuntLine />}
                rise={false}
                arrcolor="rgb(255 7 247)"
                per={Number(35)}
              />
              <Dashboardcom
                color={["#6d6dff", "rgb(18 25 255)"]}
                name="Reviews"
                number={Number(reviewsCount)}
                icon={<GiStarsStack />}
                rise={true}
                arrcolor="rgb(36 42 255)"
                per={Number(56)}
              />
            </div>
          </div>

          <div className="col-md-4 pl-1">
            <div className="box mt-4 p-4">
              <div
                className="info1 d-flex justify-content-between align-items-start"
                style={{ zIndex: "2" }}
              >
                <div className="item">
                  <h5
                    className="text-dark"
                    style={{
                      color: "#1c2319!",
                      fontSize: "18px",
                      fontWeight: "800",
                    }}
                  >
                    Total Sales
                  </h5>
                  <h3 className="mb-0">$34,56,096</h3>
                  <p className="m-0" style={{ fontSize: "14px" }}>
                    $34,23,000 in last month
                  </p>
                </div>

                <div className="menusales">
                  <div
                    className="goto mr-1"
                    style={{ width: "25px", height: "35px" }}
                  >
                    <Button
                      onClick={(e) => handleClick(e)}
                      className="w-100 h-100"
                      style={{
                        width: "100%",
                        height: "100%",
                        minWidth: 0,
                        padding: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <HiDotsVertical
                        style={{ fontSize: "20px", color: "black" }}
                      />
                    </Button>
                    <Menu
                      id="long-menu"
                      className="settingmenu"
                      MenuListProps={{
                        "aria-labelledby": "long-button",
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      slotProps={{
                        paper: {
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                          },
                        },
                      }}
                    >
                      {options.map((option) => (
                        <MenuItem
                          key={option}
                          selected={option === "Pyxis"}
                          onClick={handleClose}
                        >
                          <FaClockRotateLeft
                            className="mr-2"
                            style={{ fontSize: "12px", color: "#000" }}
                          />
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                </div>
              </div>

              <div className="info2 d-flex  ml-3  align-items-end justify-content-center">
                <Chart
                  chartType="PieChart"
                  data={data}
                  options={options2}
                  width={"300px"}
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 ml-4 mr-3">
          <h4 className="hd">Best Selling Products</h4>
          <div className="row cardfilter">
            <div className="col">
              <h5 className="ml-2">Show By</h5>
              <Sortcomp
                res={catdata?.categoryList}
                filterById={filterById}
                givenname="category"
              />
            </div>
            <div className="col">
              <h5 className="ml-2">SubCategory By</h5>
              <Sortcomp
                res={subCatData}
                givenname="subCat"
                filterById={filterById}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>RATING</th>
                </tr>
              </thead>
              <tbody>
                {productlist?.product?.length !== 0 &&
                  productlist?.product?.map((item, index) => (
                    <tr key={item._id}>
                      <td className="">
                        <Checkbox {...label} />{" "}
                        <span className="w-100">
                          #
                          {index +
                            1+
                            parseInt(productlist?.perPage) * (parseInt(productlist?.page) - 1)}
                        </span>
                      </td>

                      <td className="prod">
                        <div className="d-flex productbox align-items-center">
                          <div className="imagewrapper">
                            <div
                              className="img"
                              style={{ width: "100%", height: "100%" }}
                            >
                              <img
                                // src={item.category.images}
                                src={item?.images[0]}
                                alt=""
                                className="w-100"
                                style={{ objectFit: "contain" }}
                              />
                            </div>
                          </div>

                          <div className="info">
                            <h6>{item?.name}</h6>
                            <p>{item?.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>{item?.category?.name ?? ""}</td>
                      <td>{item?.brand}</td>
                      <td>
                        <p
                          className="old"
                          style={{
                            textDecoration: "line-through",
                            padding: "0px",
                            margin: "0px",
                            fontSize: "14px",
                          }}
                        >
                          ${item?.discountPrice}
                        </p>
                        <p
                          className="new text-danger"
                          style={{ margin: "0px", fontSize: "15px" }}
                        >
                          ${item?.price}
                        </p>
                      </td>
                      <td>{item?.countInStock}</td>
                      {/* <td>{item.rating}({item.numReviews})</td> */}
                      <td>
                        <Rating
                          name="read-only"
                          value={item?.rating}
                          size="small"
                          readOnly
                          precision={0.5}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {productlist?.totalPages > 1 && (
              <div className="tablefoot">
                <p>
                  showing <b>{productlist?.page}</b> out of{" "}
                  <b>{productlist?.totalPages}</b> rounds
                </p>
                <Pagination
                  count={productlist?.totalPages}
                  color="primary"
                  className="page"
                  showFirstButton
                  showLastButton
                  onChange={handlePage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

// #fff6bf; user
// rgb(254 234 16);  gold
// rgb(255 7 247);   pink

//  rgb(36 42 255);
