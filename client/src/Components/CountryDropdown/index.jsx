import Button from "@mui/material/Button";
import { IoSearchOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import Dialog from "@mui/material/Dialog";
import SearchBox from "../Header/Searchbox/index";
import { IoMdClose } from "react-icons/io";
import { useState, useContext, useEffect } from "react";
import React from "react";
import { Mycontext } from "../../App";

const CountryDropdown = () => {
  const [openw, setopen] = useState(false);
  const context = useContext(Mycontext);
  const [selectTab, setselectTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectCtry, setselectCtry] = useState("");

  const selectCountry = (index, country) => {
    setselectTab(index);
    setselectCtry(country);

    setopen(false);
    setCountryList(context.countryList);
  };

  useEffect(() => {
    setCountryList(context.countryList);
  }, [context.countryList]);

  const filter = (e) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword !== "") {
      const list = context.countryList.filter((item) => {
        return item.country.toLowerCase().includes(keyword);
      });
      setCountryList(list);
    } else {
      setCountryList(context.countryList);
    }
  };
  return (
    <>
      <Button
        className="country-drop"
        variant="outlined"
        onClick={() => setopen(true)}
      >
        <div className="info d-flex flex-column">
          <span className="location">Your Country </span>
          <span className="name">
            {selectCtry !== ""
              ? selectCtry.length > 10
                ? selectCtry?.substr(0, 10) + "..."
                : selectCtry
              : "location"}
          </span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>

      <Dialog
        open={openw}
        onClose={() => setopen(false)}
        className="locationModel"
      >
        <h4 className="mb-0">Choose your Country</h4>
        <p>Enter your address we specify the offer for your area</p>
        <Button className="close_" onClick={() => setopen(false)}>
          <IoMdClose />
        </Button>
        <div
          className="headersearch d-flex justify-content-center"
          style={{
            padding: "8px 0px 8px 8px",
            borderRadius: "6px",
            width: "81%",
          }}
        >
          <input
            type="text"
            placeholder="Search for Places..."
            style={{ borderRadius: "10px" }}
            onChange={filter}
          />
          <Button>
            <IoSearchOutline />
          </Button>
        </div>
        <ul className="list w-100">
          {countryList?.length !== 0 &&
            countryList?.map((item, index) => {
              return (
                <li key={index}>
                  <Button
                    onClick={() => selectCountry(index, item.country)}
                    className={`${selectTab === index ? "active" : ""}`}
                  >
                    {item.country}
                  </Button>
                </li>
              );
            })}
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;
