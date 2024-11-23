import Button from "@mui/material/Button";
import { IoSearchOutline } from "react-icons/io5";
import { useState, useContext } from "react";
import { fetchDataFromApi } from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "../../../App";
import CircularProgress from "@mui/material/CircularProgress";

const SearchBox = () => {
  const [searchitem, setSearchItem] = useState("");

  const [isloading, setIsLoading] = useState(false);
  const context = useContext(Mycontext);
  const history = useNavigate();

  const changeValue = (e) => {
    const {
      target: { value },
    } = e;
    setSearchItem(value);
  };
  const handleSearch = () => {
    setIsLoading(true);
    if (searchitem !== "") {
      fetchDataFromApi(`/api/search?q=${searchitem}`).then((res) => {
        context.setSearchData(res);
        setTimeout(() => {
          setIsLoading(false);
          setSearchItem("");
        }, 2000);

        console.log("ressss:", res);
        history("/searchpage");
      });
    } else {
      setIsLoading(false);
      context.setAlertBox({
        msg: "Please enter item to serach",
        color: "error",
        open: true,
      });
    }
  };

  return (
    <div className="headersearch ml-4 mr-4 d-flex align-items-center" style={{ borderRadius: "6px" }}>
      {isloading === true && (
        <CircularProgress color="inherit" className="ml-2 load" />
      )}
      <input
        type="text"
        placeholder="Search for Products..."
        style={{ borderRadius: "10px" }}
        onChange={changeValue}
        value={searchitem ?? ""}
      />
      <Button onClick={handleSearch}>
        <IoSearchOutline />
      </Button>
    </div>
  );
};

export default SearchBox;
