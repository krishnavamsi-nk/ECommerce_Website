import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mycontext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";

const SideBar = (props) => {
  const [value, setValue] = useState([100, 60000]);
  const context = useContext(Mycontext);
  const [catId, setCatId] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const { id } = useParams();
  const [subCatId, setSubCatId] = useState("")

  const changeSubCatId = (ind)=>{
    console.log("subCatiD:",ind);
    setSubCatId(ind)

  }

  useEffect(()=>{
    setSubCatId("");
  },[location.pathname])

  const [filterSubCat, setfilterSubCat] = useState();

  useEffect(() => {
    setCatId(id);

  }, [id]);

  useEffect(() => {
    fetchDataFromApi(`/api/category`).then((res) => {
      if (res.success !== false) {
        let cat = res?.categoryList?.filter((item) => item._id === catId);
        

        let subCatArr = [];
        console.log("ther id:",cat)
        if (cat?.[0]?.children?.length !== 0)
          cat?.[0]?.children?.map((item, index) => {
            subCatArr.push(item);
          });
        console.log("the subCat:", subCatArr);

        setSubCategory(subCatArr);
      }
    });
  }, [catId]);

  const handleSliderChange = (event) => {
    setValue(event); // Just update the value; `useEffect` will handle filtering
    props.filterProducts(event, id, subCatId);
  };

  return (
    <>
      <div className="sidebar" style={{ position: "relative" }}>
        <div className="sticky">
          <div className="container">
            <div className="pros">
              <h6 className="mb-3">PRODUCT CATEGORIES</h6>

              <div className="scroll">
                <ul>
                  {subCategory?.length !== 0 &&
                    subCategory?.map((item, index) => {
                      return (
                        <li key={item._id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={item._id === subCatId}
                                onChange={() => {
                                  changeSubCatId(item._id);
                                  console.log("the Id:",item._id);
                                  props.filterProducts(value,id, item._id);
                                }}
                              />
                            }
                            label={item?.name}
                          />
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="productfilter mt-4">
              <h6 className="mb-3"> FILTER BY PRICE</h6>
              <RangeSlider
                value={value}
                onInput={handleSliderChange} // Update handler for the slider
                min={100}
                max={60000}
                step={10}
              />
              <div className="d-flex pt-2 pb-2 pricerange">
                <span>
                  From:{" "}
                  <strong style={{ color: "rgb(11 88 203)" }}>
                    Rs: {value[0]}
                  </strong>
                </span>
                <span className="ml-auto">
                  To:{" "}
                  <strong style={{ color: "rgb(11 88 203)" }}>
                    Rs: {value[1]}
                  </strong>
                </span>
              </div>
            </div>

            <div className="pros mt-4">
              <h6 className="mb-3">Filter By Rating</h6>

              <div className="scroll" style={{ overflowY: "hidden" }}>
                <ul>
                  {Array.from({ length: 5 }, (_, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        props.filterByRating(index + 1, id , subCatId)
                      }
                    >
                      <Rating
                        name="read-only"
                        value={1 + index}
                        readOnly
                        size="small"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link to="#">
              {" "}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0SnN59BvU9a2qJTf3G37X80rr2N8uaybceg&s"
                alt=""
                className="w-100"
                style={{ marginTop: "40px", height: "300px" }}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
