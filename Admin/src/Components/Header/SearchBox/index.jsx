import { IoSearchSharp } from "react-icons/io5";
import Button from "@mui/material/Button";

const SearchBox = () => {
  return (
    <>
      <div className="searchbox ml-3 d-flex align-items-center justify-content-between pl-3">
        <input type="text" placeholder="Search here..." />
        <Button className="rounded-circle"><IoSearchSharp style={{fontSize:"45px",color:"black"}} /></Button>
      </div>
    </>
  );
};

export default SearchBox;
