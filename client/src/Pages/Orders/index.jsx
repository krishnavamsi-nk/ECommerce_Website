import React from "react";
import { useEffect, useState, useContext } from "react";
import { fetchDataFromApi } from "../../utils/api";
import Pagination from "@mui/material/Pagination";
import {Mycontext} from "../../App";
import {useNavigate} from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState({});
  const [indexs, setIndex] = useState(-1);
  const [toggle, settoggle] = useState(false);
  const context = useContext(Mycontext);
  const history = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/order").then((res) => {
      setOrders(res);
      console.log("resss:", res);
    });
  }, []);

  const handlePage = (event, value) => {
    fetchDataFromApi(`/api/order?page=${value}`).then((res) => {
      setOrders(res);
      window.scrollTo(0, 0);
    });
  };

  useEffect(()=>{
    if(context.issignin===false){
      history("/signin")
    }
  },[context.issignin]);

  const openProduct = (index) => {
    setIndex(index);
    settoggle(!toggle);
  };

  return (
    <>
      <div className="section">
        <div className="container_order">
          <h2>Orders</h2>

          <div className="table-responsive ordertable">
            <table className="table table-striped table-bordered">
              <thead style={{ background: "rgb(26 112 241)", color: "white" }}>
                <tr>
                  <th>Session ID</th>
                  <th>Products</th>
                  <th>Name</th>
                  <th>PhoneNumber</th>
                  <th>Adddress</th>
                  <th>Pincode</th>
                  <th>Amount</th>
                  <th>Email</th>
                  <th>UserId</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders?.orderList?.length !== 0 &&
                  orders?.orderList?.map((item, index) => (
                    <>
                      <tr key={index}>
                        <td className="text-green">
                          {item.paymentId?.substr(0, 15)}
                        </td>
                        <td
                          onClick={() => openProduct(index)}
                          className="tableButton"
                        >
                          Click here to view
                        </td>

                        <td>{item.name}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.address}</td>
                        <td>{item.pincode}</td>
                        <td>{item.amount}</td>
                        <td>{item.email}</td>
                        <td>{item.userId}</td>
                        <td>
                          {item?.status === "Pending" ? (
                            <span className="badge badge-danger">
                              {item?.status}
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              {item?.status}
                            </span>
                          )}
                        </td>
                        <td>{item.date}</td>
                      </tr>

                    { indexs === index &&
                        toggle === true &&
                    
                    <tr
                        key={item.id}
                        style={{ background: "#3be4ff", color: "white" }}
                      >
                        <th>Product Id</th>
                        <th>Product Title</th>
                        <th>Image</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>SubTotal</th>
                      </tr>}

                      {indexs === index &&
                        toggle === true &&
                        item?.products?.length !== 0 &&
                        item?.products?.map((product, idx) => (
                          <>
                            <tr
                              key={idx * 100}
                              style={{ background: "#b1ff92" }}
                            >
                              <th>{product.productId}</th>
                              <th>{product.name?.substr(0, 15) + "..."}</th>
                              <th>
                                <div style={{ width: "40px", height: "50px" }}>
                                  <img
                                    className="w-100"
                                    style={{
                                      objectFit: "cover",
                                      height: "100%",
                                    }}
                                    src={product.images}
                                    alt=""
                                  />
                                </div>
                              </th>
                              <th>{product.quantity}</th>
                              <th>{product.price}</th>
                              <th>{product.total}</th>
                            </tr>
                          </>
                        ))}
                    </>
                  ))}
              </tbody>
            </table>

            {orders?.totalPages > 1 && (
              <div className="tablefoot">
                <p>
                  showing <b>{orders?.page}</b> out of{" "}
                  <b>{orders?.totalPages}</b> rounds
                </p>
                <Pagination
                  count={orders?.totalPages}
                  color="primary"
                  className="page"
                  showFirstButton
                  showLastButton
                  onChange={handlePage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
