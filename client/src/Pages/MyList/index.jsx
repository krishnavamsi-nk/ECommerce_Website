import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Quantitybox from "../../Components/Quantitybox";
import { IoClose } from "react-icons/io5";
import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Mycontext } from "../../App";


const MyList = () => {
  const [mylistData, setMyListData] = useState([]);
  const context = useContext(Mycontext);

  const removeItem = (id) => {
    deleteData("/api/mylist/", id).then((res) => {
      if (res.success !== false) {
        context.setAlertBox({
          msg: "The Item removed from MyList!",
          color: "success",
          open: true,
        });

        fetchDataFromApi("/api/mylist").then((ress) => {
          console.log("res:", ress);
          if(ress.success === false){
            setMyListData([]);
          }
          else{
            setMyListData(ress);
          }
          
        });
      } else {
        context.setAlertBox({
          msg: res.msg,
          color: "error",
          open: true,
        });
      }
    });
  };

  const user = JSON.parse(localStorage.getItem("user"));
  if(user){

    useEffect(() => {
      fetchDataFromApi(`/api/mylist?userId=${user.userId}`).then((res) => {
        console.log("response:", res);
        if(res.success===false){
          setMyListData([]);
  
        }
        else{
          setMyListData(res);
        }
        
      });
    }, []);

  }





  return (
    <>
      <section className="section p-4 cart-page">
        <div
          className="container"
          style={{ maxWidth: "1260px", border: "1px solid rgba(0,0,0,0.3)" }}
        >
          <h2 className="mt-4 mb-2">MyList Details</h2>
          <p>
            There are{" "}
            <b className="text-danger">{mylistData?.length}</b>{" "}
            Products in Your Whislist
          </p>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
             {
              mylistData?.length !==0 ?
              (
                <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price of item</th>
            
                    <th>Remove</th>
                  </tr>
                </thead>

                <tbody>
                  {mylistData?.length !== 0 &&
                    mylistData?.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <Link to={`/product/${item.prodId}`}>
                            <div className="cartitemimg d-flex align-items-center">
                              <div className="imgwrapper">
                                <img
                                  src={item.images}
                                  alt=""
                                  className="w-100"
                                />
                              </div>

                              <div className="info">
                                <h6>{item.name.substr(0, 30) + "..."}</h6>
                                <Rating
                                  name="read-only"
                                  value={4}
                                  precision={0.5}
                                  readOnly
                                  size="small"
                                />
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td>${item.price}.00</td>
                     
             
                        <td>
                          <Button
                            className="remove"
                            onClick={() => removeItem(item.id)}
                          >
                            <IoClose />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              ):
              (
                <>
                <div className="No-items d-flex flex-column align-items-center justify-context-center">
                  <div className="img-wrap" style={{width:"500px"}}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF6sXxgjpMBCEoPRTxPThc4G06B9X-nLaZ3g&s" alt=""
                    style={{width:"100%"}} />
                  </div>
                <h3 className="text-danger">No items</h3>


                </div>
                
                </>
              )
             }
              </div>
            </div>
       
          </div>
        </div>
      </section>
    </>
  );
};

export default MyList;
