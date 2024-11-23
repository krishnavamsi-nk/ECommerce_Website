// sort menu
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Sortcomp = (props) => {
  const {res ,givenname} = props;
  

  const [value, setVal] = useState("");

  const handleChangeval = (event) => {
    setVal(event.target.value);
  };


  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={value}
        onChange={handleChangeval}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem value="" onClick={()=>props.filterById("","")}>
          <em>None</em>
        </MenuItem>
        {res?.length !== 0 &&
          res?.map((item, index) => (
          
            <MenuItem value={item["name"]} key={item._id} onClick={()=>props.filterById(item._id,givenname)}>
              {" "}

              {item["name"]}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default Sortcomp;
