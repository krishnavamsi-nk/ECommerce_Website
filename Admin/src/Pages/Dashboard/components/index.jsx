import { useEffect, useState, useContext } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { FaArrowTrendDown } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaClockRotateLeft } from "react-icons/fa6";
import {MyContext} from "../../../App";

const Dashboardcom = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ITEM_HEIGHT = 48;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = ["Last Day", "Last Week", "Last Month", "Last Year"];

  return (
    <>
      <div
        className="dashboard p-4 d-flex flex-column justify-content-between position-relative"
        style={{
          background: `linear-gradient(to right, ${props.color?.[0]}, ${props.color?.[1]})`,
        }}
      >
        <div
          className="iconm position-absolute"
          style={{ top: "15%", zIndex: "1" }}
        >
          {props.rise === true ? (
            <FaArrowTrendUp
              style={{ fontSize: "130px", color: props.arrcolor }}
            />
          ) : (
            <FaArrowTrendDown
              style={{ fontSize: "130px", color: props.arrcolor }}
            />
          )}
        </div>
        <div
          className="info1 d-flex justify-content-between align-items-center"
          style={{ zIndex: "2" }}
        >
          <div className="item">
            <h5
              className="text-dark"
              style={{ color: "#1c2319!", fontSize: "18px", fontWeight: "800" }}
            >
              Total {props.name}
            </h5>
            <h3>{props.number}</h3>
          </div>
          <Button className="icon mr-1  pt-2 pb-2">{props.icon}</Button>
        </div>
        <div
          className="info2 d-flex align-items-center justify-content-between"
          style={{ zIndex: "2" }}
        >
          <div className="rate">
            <span
              className="p-1 mr-1"
              style={{
                border: "1px solid black",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              +{props.per}%
            </span>
            <span style={{ fontSize: "13px", fontWeight: "600" }}>
              Last Month
            </span>
          </div>
          <div className="goto mr-1" style={{ width: "25px", height: "35px" }}>
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
              <HiDotsVertical style={{ fontSize: "20px", color: "black" }} />
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
                  <FaClockRotateLeft className="mr-2" style={{fontSize:"12px",color:"#000"}} />
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboardcom;
