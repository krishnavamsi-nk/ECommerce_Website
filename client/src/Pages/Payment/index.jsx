import React from "react";
import {Link} from "react-router-dom";

const Payment = () => {
  return (
    <>
      <section className="section p-4 cart-page accountpaage">
        <div
          className="container d-flex align-items-center justify-content-center p-3 flex-column"
          style={{ maxWidth: "1260px", border: "1px solid rgba(0,0,0,0.3)" }}
        >
          <h1 className="mt-4 mb-4 text-success">YOUR PAYMENT COMPLETED SUCCESSFULLY!</h1>
          <p style={{fontSize:"18px"}}> <Link to={"/order"}><span className="order-link">Click here!</span></Link> To Check The Details</p>
        </div>
      </section>
    </>
  );
};

export default Payment;
