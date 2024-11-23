import React from "react";

// BreadCrumb
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchDataFromApi, editData } from "../../utils/api";
import { useState, useEffect, useContext } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

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

const Order = () => {
  const [orders, setOrders] = useState({});
  const [indexs, setIndex] = useState(-1);
  const [toggle, settoggle] = useState(false);
  const [singleorder, setSingleOrder] = useState({});
  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/order").then((res) => {
      setOrders(res);
      console.log("resss:", res);
    });
  }, []);

  const openProduct = (index) => {
    setIndex(index);
    settoggle(!toggle);
  };

  useEffect(() => {
    if (context.issignin === false) {
      history("/login");
    }
  }, [context.issignin]);

  const handlePage = (event, value) => {
    fetchDataFromApi(`/api/order?page=${value}`).then((res) => {
      setOrders(res);
      window.scrollTo(0, 0);
    });
  };

  const pending = (id, item) => {
    const order = {
      name: item.name,
      phoneNumber: item.phoneNumber,
      pincode: item.pincode,
      amount: item.amount,
      paymentId: item.paymentId,
      email: item.email,
      userId: item.userId,
      products: item.products,
      status: "Pending",
      date: item.date,
    };

    editData(`/api/order/${id}`, order).then((res) => {
      if (res.success === false) {
        context.setAlertBox({
          msg: res.msg,
          color: "error",
          open: true,
        });
      } else {
        fetchDataFromApi("/api/order").then((res) => {
          setOrders(res);
          context.setAlertBox({
            msg: "The Order Pended",
            color: "error",
            open: true,
          });
        });
      }
    });
  };

  const confirm = (id, item) => {
    const order = {
      name: item.name,
      phoneNumber: item.phoneNumber,
      pincode: item.pincode,
      amount: item.amount,
      paymentId: item.paymentId,
      email: item.email,
      userId: item.userId,
      products: item.products,
      status: "Confirmed",
      date: item.date,
    };

    editData(`/api/order/${id}`, order).then((res) => {
      if (res.success === false) {
        context.setAlertBox({
          msg: res.msg,
          color: "error",
          open: true,
        });
      } else {
        fetchDataFromApi("/api/order").then((res) => {
          setOrders(res);
          context.setAlertBox({
            msg: "The Order confirmed",
            color: "success",
            open: true,
          });
        });
      }
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div
          className="card shadow m-4 p-4 d-flex align-items-center  flex-row justify-content-between"
          style={{ borderRadius: "10px" }}
        >
          <h5 className="mb-0">Orders List</h5>
          <div className="link-toAddCat d-flex align-items-center">
            <div>
              <Breadcrumbs
                arial-label="breadcrumb "
                className="ml-auto breadcrumbs_"
              >
                <StyledBreadcrumb
                  component="a"
                  href="/dashboard"
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />

                <StyledBreadcrumb
                  label="Orders List"
                  deleteIcon={<ExpandMoreIcon />}
                />
              </Breadcrumbs>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 ml-4 mr-3">
          <h4 className="hd">Best Selling Products</h4>

          <div className="table-responsive ordertable">
            <table className="table table-bordered">
              <thead className="thead-dark">
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
                  <th>Set conformation</th>
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
                        <td>
                          {" "}
                          <Button onClick={() => confirm(item.id, item)}>
                            confirm &nbsp;
                            <FaCheckCircle />{" "}
                          </Button>{" "}
                          <Button onClick={() => pending(item.id, item)}>
                            pending &nbsp;
                            <IoCloseCircleSharp />
                          </Button>
                        </td>
                      </tr>

                      {indexs === index && toggle === true && (
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
                        </tr>
                      )}

                      {indexs === index &&
                        toggle === true &&
                        item?.products?.length !== 0 &&
                        item?.products?.map((product, idx) => (
                          <>
                            <tr key={idx * 100} style={{ background: "white" }}>
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
          </div>

          {orders?.totalPages > 1 && (
            <div className="tablefoot">
              <p>
                showing <b>{orders?.page}</b> out of <b>{orders?.totalPages}</b>{" "}
                rounds
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
    </>
  );
};

export default Order;
