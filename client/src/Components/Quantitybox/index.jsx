import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import { Mycontext } from "../../App";
import { editData } from "../../utils/api";

const Quantitybox = (props) => {
  const [val, setVal] = useState(1);
  const context = useContext(Mycontext);
  const { value, cartdata } = props;
  const [isloading, setIsLoading] = useState(false);

  const minus = () => {
    if (val > 0 && val != 1) setVal(val - 1);
  };

  const plus = () => {
    setVal(val + 1);
  };

  useEffect(() => {
    if (value !== undefined) {
      setVal(value);
    }
  }, []);

  useEffect(() => {
    context.setQuantity(val);

    if (cartdata !== undefined) {
     
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setIsLoading(true);
        const updatedCartData = {
          name: cartdata.name,
          images: cartdata.images,
          price: cartdata.price,
          rating: cartdata.rating,
          quantity: val,
          subTotal: parseInt(val * cartdata.price),
          prodId: cartdata.prodId,
          userId: user.userId,
        };
        context.setSubTotal(parseInt(val * cartdata.price));
        console.log("the Val:", cartdata);

        editData(`/api/cart/${cartdata.id}`, updatedCartData).then((res) => {
          if (res.success !== false) {
            console.log("True", res);
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          } else {
            console.log("false");
            setIsLoading(false);
          }
        });
      }
    }
  }, [val]);

  return (
    <>
      {isloading === true && <div className="loading"></div>}
      <div className="quantitydrop d-flex align-items-center">
        <Button onClick={minus}>
          <FaMinus />
        </Button>
        <input
          type="text"
          style={{
            borderRadius: "100%",
            width: "50px",
            height: "auto",
            textAlign: "center",
            color: "blue",
            fontWeight: "900",
          }}
          value={val}
          onChange={(e) => {
            setVal(Number(e.target.value));
          }}
          min={1}
          max={30}
        />
        <Button onClick={plus}>
          <FaPlus />
        </Button>
      </div>
    </>
  );
};

export default Quantitybox;
