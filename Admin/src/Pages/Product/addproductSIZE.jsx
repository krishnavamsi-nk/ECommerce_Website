// Breadcrumb
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

import Select from "@mui/material/Select";
import { useState, useContext, useEffect } from "react";

import { IoOpenOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { MdOutlinePublishedWithChanges } from "react-icons/md";

import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData,editData } from "../../utils/api";

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

const AddProductSIZE = () => {
  const context = useContext(MyContext);

  const [isloading, setIsLoading] = useState(false);
  const [productSIZE, setProductSIZE] = useState([]);
  const [isupdate, setIsUpdate] = useState(false);
  const [itemid, setItemId] = useState("");

  const [formfields, setFormFields] = useState({
    productSIZE: "",
  });

  const history = useNavigate();

  const fd = new FormData();

  const changeinput = (e) => {
    const { name, value } = e.target;

    // Check if the name is 'images' to handle it differently

    setFormFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchDataFromApi("/api/productSize").then((res) => {
      console.log("this is the RESMs", res);
      setProductSIZE(res);
    });
  }, []);

  const updateRAM = (id, item) => {
    setFormFields({
      productSIZE: item,
    });

    setIsUpdate(true);
    setItemId(id);
  };

  const deleteRAM = (id) => {
    deleteData("/api/productSize", `/${id}`).then(() => {
      fetchDataFromApi("/api/productSize").then((res) => {
        console.log("this is the RESMs", res);
        setProductSIZE(res);
      });
    });
  };

  const addUpdatedProductRAM = () => {
    if (itemid !== "") {
      editData(`/api/productSize/${itemid}`, formfields).then((res) => {
        fetchDataFromApi("/api/productSize").then((res) => {
          console.log("this is the RESMs", res);
          setProductSIZE(res);
        });
        setIsUpdate(false);
      });
    }
  };

  const addProductRAM = (e) => {
    e.preventDefault();

    fd.append("name", formfields.productSIZE);
    console.log("this is the form RAM:", formfields.productSIZE);

    if (formfields.productSIZE !== "") {
      setIsLoading(true);

      postData("/api/productSize/create", formfields).then((res) => {
        // console.log(res);
        setIsLoading(false);
        setFormFields({
          productSIZE: "",
        });

        fetchDataFromApi("/api/productSize").then((res) => {
          console.log("this is the RESMs", res);
          setProductSIZE(res);
        });
      });

      return true;
    } else {
      // setError(true);
      context.setAlertBox({
        msg: "Please fill all the Fields",
        color: "error",
        open: true,
      });

      return false;
    }
  };

  return (
    <>
      <div className="right-content w-100">
        <div
          className="card shadow m-4 p-4 d-flex align-items-center  flex-row justify-content-between"
          style={{ borderRadius: "10px" }}
        >
          <h5 className="mb-0">Add Product SIZE</h5>

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
                component="a"
                href="/productSIZE/List"
                label="productSIZE"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="productSIZE Upload"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>
        </div>

        <form
          action=""
          className="form-info"
          onSubmit={isupdate !== true ? addProductRAM : addUpdatedProductRAM}
        >
          <div className="row mt-4 mr-3">
            <div className="col-md-8">
              <div className="card p-4 ml-4">
                <h6 className="font-weight-bold mb-3">Basic information</h6>

                <div className="row form-group">
                  <div className="col">
                    <h6>product SIZE  </h6>
                    <input
                      type="text"
                      value={formfields.productSIZE}
                      placeholder="type here..."
                      name="productSIZE"
                      onChange={(e) => changeinput(e)}
                    />
                  </div>
                </div>

                {isupdate !== true ? (
                  <Button
                    type="submit"
                    className="mt-3 btn-blue pt-2 pb-2 w-100"
                    style={{ textTransform: "uppercase", fontSize: "17px" }}
                  >
                    <MdOutlinePublishedWithChanges
                      className="mr-2"
                      style={{ fontSize: "20px" }}
                    />{" "}
                    Publish productSIZE &nbsp;
                    {isloading === true && (
                      <CircularProgress color="inherit" className="ml-2 load" />
                    )}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="mt-3  pt-2 pb-2 w-100"
                    style={{ textTransform: "uppercase", fontSize: "17px" ,color:"white",backgroundColor:"#1cec1c",borderRadius:"15px"}}
                  >
                    <MdOutlinePublishedWithChanges
                      className="mr-2"
                      style={{ fontSize: "20px" }}
                    />{" "}
                    Update productSIZE &nbsp;
                    {isloading === true && (
                      <CircularProgress color="inherit" className="ml-2 load" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="card col-md-12 p-4 mt-3">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>product SIZE</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productSIZE?.length !== 0 ? (
                productSIZE.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.productSIZE}</td>
                    <td
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div className="d-flex align-items-center todo">
                        <Button
                          color="success"
                          onClick={() => {
                            updateRAM(item.id, item.productSIZE);
                          }}
                        >
                          <FaRegEdit />
                        </Button>
                        <Button
                          color="error"
                          onClick={() => {
                            deleteRAM(item.id);
                          }}
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    No productSIZEs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AddProductSIZE;
