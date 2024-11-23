import Dashboardcom from "../Dashboard/components";
import { useEffect, useState, useContext } from "react";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { RiProductHuntLine } from "react-icons/ri";
import { GiStarsStack } from "react-icons/gi";
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaClockRotateLeft } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import Button from "@mui/material/Button";
import { Chart } from "react-google-charts";
import Sortcomp from "../Dashboard/Sortcomponent";
import Rating from "@mui/material/Rating";
import { IoOpenOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { fetchDataFromApi, fetchDataById, deleteData } from "../../utils/api";
import { FaObjectGroup } from "react-icons/fa";

// BreadCrumb
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { MdCategory } from "react-icons/md";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const apiUrl = import.meta.env.VITE_BASE_URL;
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular, // Corrected here
    "&:hover,&:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1], // Corrected here
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const Dashboard = () => {
  const [category, setCategoryVal] = useState("");
  const [catdata, setCatData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const context = useContext(MyContext);
  const open = Boolean(anchorEl);
  const [productlist, setProductList] = useState([]);
  const ITEM_HEIGHT = 48;
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [subCategoryCount, setSubCategoryCount] = useState(0);
  const [idFilter, setIdFilter] = useState("");
  const [nameId, setNameId] = useState("");
  const [subCatData, setSubCatData] = useState([]);

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
    fetchDataFromApi("/api/product/get/count").then((res) => {
      setProductCount(res.productsCount);
    });
    fetchDataFromApi("/api/category/get/count").then((res) => {
      setCategoryCount(res.categorysCount);
    });
    fetchDataFromApi("/api/category/subCat/get/count").then((res) => {
      setSubCategoryCount(res.subCategoryCount);
    });
  }, []);

  useEffect(() => {
    console.log("the products:", productlist);
  }, [productlist]);


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
        console.log(res);
        setProductList(res);
      });
    });
  };

  useEffect(() => {
    context.setIsHeaderAndSidebarShow(true);
    context.setIsToggleSidebar(false);
    context.setProgress(40);

    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res);
    });

    fetchDataFromApi("/api/product").then((res) => {
      console.log(res);
      setProductList(res);
      context.setProgress(100);
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

  useEffect(() => {
    fetchDataFromApi(`/api/product?${nameId}=${idFilter}&perPage=20`).then((res) => {
      console.log(res);
      setProductList(res);
      context.setProgress(100);
    });
  }, [idFilter]);

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

  // useEffect(()=>{
  //   console.log("logged",productlist);
  // },[productlist])

  const options = ["Last Day", "Last Week", "Last Month", "Last Year"];
  return (
    <>
      <div className="right-content w-100">
        <div
          className="card shadow m-4 p-4 d-flex align-items-center  flex-row justify-content-between"
          style={{ borderRadius: "10px" }}
        >
          <h5 className="mb-0">Product List</h5>

          <div className="link-toAddCat d-flex align-items-center">
            <div>
              <Breadcrumbs
                arial-label="breadcrumb "
                className="ml-auto breadcrumbs_"
              >
                <StyledBreadcrumb
                  component="a"
                  href="/dashboard"
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />

                <StyledBreadcrumb
                  label="Product List"
                  deleteIcon={<ExpandMoreIcon />}
                />
              </Breadcrumbs>
            </div>

            <Link to="/product/upload">
              {" "}
              <Button className="btn-blue ml-3 pl-4 pr-4">Add Product</Button>
            </Link>
          </div>
        </div>

        <div className="row dashboardwrapperbox d-flex">
          <div className="col-md-12 mt-4 pr-1">
            <div
              className="dashboardwrapper"
              style={{ gridTemplateColumns: "repeat(3,1fr)", height: "150px" }}
            >
              <Dashboardcom
                color={["rgb(131 234 234)", "rgb(11 255 255)"]}
                name="Products"
                number={Number(productCount)}
                icon={<FaUsers />}
                rise={true}
                arrcolor="#78fff9"
                per={Number(45)}
              />
              <Dashboardcom
                color={["rgb(234 197 59)", "rgb(255 236 14)"]}
                name="Categories"
                number={Number(categoryCount)}
                icon={<MdCategory />}
                rise={false}
                arrcolor=" rgb(254 234 16)"
                per={Number(68)}
              />
              <Dashboardcom
                color={["rgb(241 115 237)", "rgb(255 0 247)"]}
                name="SubCategories"
                number={Number(subCategoryCount)}
                icon={<FaObjectGroup />}
                rise={false}
                arrcolor="rgb(255 7 247)"
                per={Number(35)}
              />
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
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>SUBCATEGORY</th>
                  <th>BRAND</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>RATING</th>
                  <th>DISCOUNT</th>
                  <th>PRODUCT RAM</th>
                  <th>PRODUCT SIZE</th>
                  <th>PRODUCT WEIGHT</th>

                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {productlist?.product?.length !== 0 &&
                  productlist?.product?.map((item, index) => (
                    <tr key={item.id}>
                      {/* <td>
                        <div
                          className="d-flex align-items-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          <Checkbox {...label} size="small" />
                           <span className="mb-1">#{index + 1}</span>
                        </div>
                      </td> */}

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
                      <td>{item?.category?.name}</td>
                      <td>{item?.subCat?.name || ""}</td>
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
                          ${item?.price}
                        </p>
                        <p
                          className="new text-danger"
                          style={{ margin: "0px", fontSize: "15px" }}
                        >
                          ${item?.discountPrice}
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
                      <td>{item?.discount}</td>
                      <td>
                        {item?.productRAM?.map((item, index) => (
                          <span
                            key={index}
                            className="badge badge-info mr-2"
                            style={{ fontSize: "12px" }}
                          >
                            {item}
                          </span>
                        ))}
                      </td>
                      <td>
                        {item?.productWEIGHT?.map((item, index) => (
                          <span
                            key={index}
                            className="badge badge-success mr-2"
                            style={{ fontSize: "12px" }}
                          >
                            {item}
                          </span>
                        ))}
                      </td>
                      <td>
                        {item?.productSIZE?.map((item, index) => (
                          <span
                            key={index}
                            className="badge badge-dark mr-2"
                            style={{ fontSize: "12px" }}
                          >
                            {item}
                          </span>
                        ))}
                      </td>

                      <td>
                        <div className="d-flex align-items-center todo">
                          <Link to={`/product/details/${item.id}`}>
                            <Button className="secondary" color="secondary">
                              <IoOpenOutline />
                            </Button>
                          </Link>
                          <Link to={`/product/edit/${item.id}`}>
                            <Button className="success" color="success">
                              <FaRegEdit />
                            </Button>
                          </Link>
                          <Button
                            className="error"
                            color="error"
                            onClick={() => {
                              productDelete(item.id);
                            }}
                          >
                            <MdDelete />
                          </Button>
                        </div>
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
