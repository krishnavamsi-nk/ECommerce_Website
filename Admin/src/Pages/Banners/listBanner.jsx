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
  const [BannerData, setBannerData] = useState([]);
  const [open, setOpen] = useState(false);

  const [id, setId] = useState(null);

  const [page, setPage] = useState(1);

  const handlePage = (event, value) => {
    context.setProgress(40);

    fetchDataFromApi(`/api/banner?page=${value}`).then((res) => {
      setBannerData(res);
      context.setProgress(100);
    });
  };

  useEffect(() => {
    context.setIsHeaderAndSidebarShow(true);
    context.setIsToggleSidebar(false);
    window.scrollTo(0, 0);
    context.setProgress(20);

    fetchDataFromApi("/api/banner").then((res) => {
      context.setProgress(100);
      console.log("resss:",res);
      setBannerData(res);
    });
  }, []);

  const deleteBanner = (id) => {
    context.setProgress(40);
    deleteData("/api/banner/", id).then((res) => {
      context.setProgress(100);
      context.setAlertBox({
        msg: "banner deleted successfully",
        color: "error",
        open: true,
      });
      fetchDataFromApi("/api/banner").then((res) => {
        setBannerData(res);
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
          <h5 className="mb-0">Banner List</h5>

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
                  label="/banner/List"
                  deleteIcon={<ExpandMoreIcon />}
                />
              </Breadcrumbs>
            </div>

            <Link to="/banner/Add">
              {" "}
              <Button className="btn-blue ml-3 pl-4 pr-4">Add Banner</Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 ml-4 mr-3 ">
          <div className="table-responsive table-banner banner-list">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>

                  <th className="banner-imageset" style={{ width: "200px" }}>IMAGE</th>

                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {BannerData?.bannerList?.length !== 0 &&
                  BannerData?.bannerList?.map((item, index) => {
                    return (
                      <tr key={item.id || index}>
                        <td className="">
                          {/* {console.log(item.page,item.perpage)} */}
                          <Checkbox {...label} />{" "}
                          <span>
                            
                            {index +
                              1 +
                              parseInt(BannerData?.perpage )* parseInt((BannerData?.page )- 1)}
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

                        <td className="">
                          <div className="d-flex align-items-center todo Actions-align">
                            <Link to={`/banner/edit/${item.id}`}>
                              <Button className="success" color="success">
                                <FaRegEdit />
                              </Button>
                            </Link>
                            <Button
                              className="error"
                              color="error"
                              onClick={() => {
                                deleteBanner(item.id);
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

            {BannerData?.totalPages > 1 && (
              <div className="tablefoot">
                <p>
                  showing <b>{BannerData?.page}</b> out of{" "}
                  <b>{BannerData?.totalPages}</b> rounds
                </p>
                <Pagination
                  count={BannerData?.totalPages}
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
