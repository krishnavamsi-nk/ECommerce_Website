import { IoShirtOutline } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";
import { CiDiscount1 } from "react-icons/ci";
import { CiBadgeDollar } from "react-icons/ci";
import {Link}  from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container mt-5">
          <div className="topinfo row">
            <div className="col d-flex align-items-center">
              <span className="mb-1">
                <IoShirtOutline style={{ fontSize: "18px" }} />
              </span>
              <span className="ml-2">Everyday fresh products</span>
            </div>
            <div className="col d-flex align-items-center">
              <span className="mb-1">
                <CiDeliveryTruck style={{ fontSize: "22px" }} />
              </span>
              <span className="ml-2">Free Delieary order over $70</span>
            </div>
            <div className="col d-flex align-items-center">
              <span className="mb-1">
                <CiDiscount1 style={{ fontSize: "22px" }} />
              </span>
              <span className="ml-2">Daily Mega discounts</span>
            </div>
            <div className="col d-flex align-items-center">
              <span className="mb-1">
                <CiBadgeDollar style={{ fontSize: "23px" }} />
              </span>
              <span className="ml-2">Best price on market</span>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col linkertab">
              <h5>Fruits & Vegetables</h5>
              <ul>
                <li><Link to="#">Fresh Vegetables</Link></li>
                <li><Link to="#">Herbs & Seasonings</Link></li>
                <li><Link to="#">Fresh Fruits</Link></li>
                <li><Link to="#">Cuts & Sprouts</Link></li>
                <li><Link to="#">Exotic Fruits & Veggies</Link></li>
                <li><Link to="#">Packaged Produce</Link></li>
                <li><Link to="#">Party Trays</Link></li>
                
              </ul>
            </div>
            <div className="col linkertab">
              <h5>Breakfast & Dairy</h5>
              <ul>
                <li><Link to="#">Fresh Vegetables</Link></li>
                <li><Link to="#">Herbs & Seasonings</Link></li>
                <li><Link to="#">Fresh Fruits</Link></li>
                <li><Link to="#">Cuts & Sprouts</Link></li>
                <li><Link to="#">Exotic Fruits & Veggies</Link></li>
                <li><Link to="#">Packaged Produce</Link></li>
                <li><Link to="#">Party Trays</Link></li>
                
              </ul>
            </div>

            <div className="col linkertab">
              <h5>Meat & Seafood</h5>
              <ul>
                <li><Link to="#">Fresh Vegetables</Link></li>
                <li><Link to="#">Herbs & Seasonings</Link></li>
                <li><Link to="#">Fresh Fruits</Link></li>
                <li><Link to="#">Cuts & Sprouts</Link></li>
                <li><Link to="#">Exotic Fruits & Veggies</Link></li>
                <li><Link to="#">Packaged Produce</Link></li>
                <li><Link to="#">Party Trays</Link></li>
                
              </ul>
            </div>

            <div className="col linkertab">
              <h5>Beverages</h5>
              <ul>
                <li><Link to="#">Fresh Vegetables</Link></li>
                <li><Link to="#">Herbs & Seasonings</Link></li>
                <li><Link to="#">Fresh Fruits</Link></li>
                <li><Link to="#">Cuts & Sprouts</Link></li>
                <li><Link to="#">Exotic Fruits & Veggies</Link></li>
                <li><Link to="#">Packaged Produce</Link></li>
                <li><Link to="#">Party Trays</Link></li>
                
              </ul>
            </div>
            <div className="col linkertab">
              <h5>Breads & Bakery</h5>
              <ul>
                <li><Link to="#">Fresh Vegetables</Link></li>
                <li><Link to="#">Herbs & Seasonings</Link></li>
                <li><Link to="#">Fresh Fruits</Link></li>
                <li><Link to="#">Cuts & Sprouts</Link></li>
                <li><Link to="#">Exotic Fruits & Veggies</Link></li>
                <li><Link to="#">Packaged Produce</Link></li>
                <li><Link to="#">Party Trays</Link></li>
                
              </ul>
            </div>












          </div>

          <div className="copyright mt-4 pt-3 pb-3 d-flex">
            <p className="mb-0">Copyright 2024. All rights reserved</p>
            <ul className="list list-inline ml-auto mb-0">
                <li className="list-inline-item">
                    <Link to="#"><FaFacebookSquare /></Link>
                </li>
                <li className="list-inline-item">
                    <Link to="#"><FaInstagramSquare /></Link>
                </li>
                <li className="list-inline-item">
                    <Link to="#"><FaTwitterSquare /></Link>
                </li>

            </ul>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
