import { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";

import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { fetchDataFromApi, editData, deleteData } from "../../utils/api";

export const apiUrl = import.meta.env.VITE_BASE_URL;

// BreadCrumb
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const label = { inputProps: { "aria-label": "Checkbox demo" } };

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

const CategoryList = () => {
  const context = useContext(MyContext);
  const [catdata, setCatData] = useState([]);
  const [open, setOpen] = useState(false);

  const [id, setId] = useState(null);

  const [page, setPage] = useState(1);

  const handlePage = (event, value) => {
    context.setProgress(40);

    fetchDataFromApi(`/api/category?page=${value}`).then((res) => {
      setCatData(res);
      context.setProgress(100);
    });
  };

  useEffect(() => {
    context.setIsHeaderAndSidebarShow(true);
    context.setIsToggleSidebar(false);
    window.scrollTo(0, 0);
    context.setProgress(20);

    fetchDataFromApi("/api/category").then((res) => {
      console.log("cat:", res);

      context.setProgress(100);
      setCatData(res);
    });
  }, []);

  const deleteCat = (id) => {
    context.setProgress(40);
    deleteData("/api/category/", id).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        msg: "category deleted successfully",
        color: "error",
        open: true,
      });
      fetchDataFromApi("/api/category").then((res) => {
        setCatData(res);
      });
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div
          className="card shadow m-4 p-4 d-flex align-items-center  flex-row justify-content-between"
          style={{ borderRadius: "10px" }}
        >
          <h5 className="mb-0">Category List</h5>

          <div className="link-toAddCat d-flex align-items-center">
            <div>
              <Breadcrumbs
                arial-label="breadcrumb "
                className="ml-auto breadcrumbs_"
              >
                <StyledBreadcrumb
                  component="a"
                  href="/"
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />

                <StyledBreadcrumb
                  label="Category List"
                  deleteIcon={<ExpandMoreIcon />}
                />
              </Breadcrumbs>
            </div>

            <Link to="/category/Add">
              {" "}
              <Button className="btn-blue ml-3 pl-4 pr-4">Add Category</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 ml-4 mr-3">
          <h4 className="hd">Best Selling Products</h4>

          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>

                  <th style={{ width: "200px" }}>IMAGE</th>
                  <th>CATEGORY</th>

                  <th>COLOR</th>
                  <th>ITEMS</th>

                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {catdata?.categoryList?.length !== 0 &&
                  catdata?.categoryList?.map((item, index) => {
                    return (
                      <tr key={item.id || index}>
                        <td className="">
                          {/* {console.log(item.page,item.perpage)} */}
                          <Checkbox {...label} />{" "}
                          <span>
                          # {index}
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
                                  // src={`${apiUrl}/uploads/${item.images[0]}`}
                                  src={item.images[0]}
                                  alt=""
                                  className="w-100"
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{item.name}</td>

                        {/* <td>{item.color}</td>
                         */}

                        <td>
                          <span
                            className="dot"
                            style={{ background: item.color }}
                          ></span>
                        </td>

                        <td>{item.items}</td>

                        <td>
                          <div className="d-flex align-items-center todo">
                            <Link to={`/category/edit/${item._id}`}>
                              <Button className="success" color="success">
                                <FaRegEdit />
                              </Button>
                            </Link>
                            <Button
                              className="error"
                              color="error"
                              onClick={() => {
                                deleteCat(item._id);
                              }}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {catdata?.totalPages > 1 && (
              <div className="tablefoot">
                <p>
                  showing <b>{catdata?.page}</b> out of{" "}
                  <b>{catdata?.totalPages}</b> rounds
                </p>
                <Pagination
                  count={catdata?.totalPages}
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

export default CategoryList;
