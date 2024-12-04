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

import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { MdOutlinePublishedWithChanges } from "react-icons/md";

import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

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

const SubCategoryAdd = () => {
  const [catdata, setCatData] = useState({});
  const context = useContext(MyContext);
  const [category, setCategoryVal] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [formfields, setFormFields] = useState({
    name: "",
    slug: "",
    parentId: "",
  });

  const history = useNavigate();

  useEffect(() => {
    context.setIsHeaderAndSidebarShow(true);
    context.setIsToggleSidebar(false);
    window.scrollTo(0, 0);
    context.setProgress(20);

    fetchDataFromApi("/api/category").then((res) => {
      context.setProgress(100);
      console.log("This is the data:", res);
      setCatData(res);
    });
  }, []);

  const handleChangeval = (event) => {
    const newValues = event.target.value;
    setCategoryVal(event.target.value);
  };

  // useEffect(() => {
  //   console.log("This is the Data here:", formfields);
  // }, [formfields]);

  const changeinput = (e) => {
    const { name, value } = e.target;
    setFormFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const SelectCat = (id) => {
    formfields.parentId = id;
  };

  const addSubCategory = (e) => {
    e.preventDefault();

    formfields.slug = formfields.name;

    if (formfields.name !== "" && formfields.parentId !== "") {
      setIsLoading(true);

      postData("/api/category/create", formfields).then((res) => {
        // console.log(res);
        setIsLoading(false);
        history("/subcategory/list");
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
          <h5 className="mb-0">Add SubCategory</h5>

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
                component="a"
                href="/subcategory/List"
                label="SubCategory"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="SubCategory Upload"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>
        </div>

        <form action="" className="form-info" onSubmit={addSubCategory}>
          <div className="row mt-4 mr-3">
            <div className="col-md-8">
              <div className="card p-4 ml-4">
                <h6 className="font-weight-bold mb-3">Basic information</h6>

                <div className="row form-group">
                  <div className="col">
                    <h6>Category</h6>
                    <Select
                      className="w-100"
                      value={category ?? ""}
                      onChange={handleChangeval}
                      name="category"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {catdata?.categoryList?.length !== 0 &&
                        catdata?.categoryList?.map((item, index) => (
                          <MenuItem
                            value={item._id}
                            key={item._id}
                            onClick={() => SelectCat(item._id)}
                          >
                            {" "}
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>

                  <div className="col">
                    <h6>Sub Category</h6>
                    <input
                      type="text"
                      value={formfields.name}
                      placeholder="type here..."
                      name="name"
                      onChange={(e) => changeinput(e)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-3 btn-blue pt-2 pb-2 w-100"
                  style={{ textTransform: "uppercase", fontSize: "17px" }}
                >
                  <MdOutlinePublishedWithChanges
                    className="mr-2"
                    style={{ fontSize: "20px" }}
                  />{" "}
                  Publish Product &nbsp;
                  {isloading === true && (
                    <CircularProgress color="inherit" className="ml-2 load" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SubCategoryAdd;
