import react from "react";
import HomeBanner from "../../Components/HomeBanner/index";
import Button from "@mui/material/Button";
import { FaArrowRight } from "react-icons/fa6";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {Link} from "react-router-dom";

import HomeProducts from "../../Components/HomeBanner/Homeproducts/index";
import banner2 from "../../assets/images/banner2.jpg";
import HomeCat from "../../Components/HomeBanner/HomeCat/index";
import { CiMail } from "react-icons/ci";
import { Mycontext } from "../../App";
import { useState, useEffect, useContext } from "react";
import { fetchDataFromApi } from "../../utils/api";


// tabs
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";


const Home = () => {
  const context = useContext(Mycontext);
  const [catData, setCatData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsList, setProducts] = useState([]);
  const [filterdata,setFilterData] = useState([]);
  const [homebanner, setHomeBanner] = useState({});




  const [valueTab, setValueTab] = useState(0);
  const [selectCat, setSelectCat] = useState("");

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const SelectCatFunction = (catid)=>{
    setSelectCat(catid);
    
  }

  useEffect(()=>{
    const filterkey = true;
    // http://localhost:3000/api/product/?perPage=8product=isFeatured&catName=Electronics       &catName=${selectCat}&

    fetchDataFromApi(`/api/product?isFeatured=${filterkey}&category=${selectCat}`).then(
      (item) => {
        
        setFilterData(item.product);
      }
    );

  },[selectCat]); 

  useEffect(() => {
    window.scrollTo(0,0);
    context.setisHeaderFooterShow(true);
    fetchDataFromApi("/api/category").then((res) => {
      
      setSelectCat(res.categoryList?.[0]._id);
      
      setCatData(res);


      const filterkey = true;


      fetchDataFromApi(`/api/product/?perPage=8&isFeatured=${filterkey}&category=${res.categoryList?.[0]._id}`).then(
        (item) => {
          setFilterData(item.product);
        }
      );
    });

    fetchDataFromApi("/api/banner?perPage=6").then((res)=>{
      console.log("the banner:",res);
      setHomeBanner(res);
    })
  

  }, []);


  useEffect(() => {
    context.setisHeaderFooterShow(true);
    fetchDataFromApi("/api/category").then((res) => {
      
      setCatData(res);
    });

    const filterkey = true;

    fetchDataFromApi(`/api/product?isFeatured=${filterkey}`).then((item) => {
      
      setFeaturedProducts(item);
    });

    const filterOPPkey = false

    fetchDataFromApi(`/api/product?perPage=8&isFeatured=${filterOPPkey}`).then((item) => {
      
      setProducts(item);
    });
  }, []);

  return (
    <section>
      {homebanner?.bannerList !==0 && (<HomeBanner data={homebanner?.bannerList} />)}
      
      <HomeCat data={catData?.categoryList} />
      <div
        className="homeproducts"
        style={{ minWidth: "1300px", top: "1000px" }}
      >
        <div className="home-container" style={{ margin: "auto" }}>
          <div className="row">
            <div className="col-md-3">
              <div className="sticky">
                <div className="banner mb-4 mt-3">
                  <img
                    src="https://www.chateliercosmetics.com/cdn/shop/collections/Collection_Covers_5.png?v=1716990132"
                    alt=""
                    className="cursor"
                  />
                </div>

                <div className="banner mt-5">
                  <img src={banner2} alt="" className="cursor" />
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="d-flex align-items-center">
                <div
                  className="info w-100 d-flex align-items-center"
                  style={{ position: "relative" }}
                >
                  <div className="info1">
                    <h3 className="mb-0">Featured Products</h3>
                    <p style={{ color: "gray" }} className="mb-0 text-sm">
                      Do not miss the offer Now until end of the march
                    </p>
                  </div>

                  <div className="ml-auto" style={{ maxWidth: '700px', overflow: 'hidden' }}>
                      <Tabs
                        value={valueTab}
                        onChange={handleChangeTab}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="scrollable force tabs example"
                      >
                        {
                          catData?.categoryList?.length !==0 && catData?.categoryList?.map((item,index)=>(
                            <Tab label={item.name} key={index} style={{fontWeight:"800",textTransform:"capitalize",fontSize:"16px"}} onClick={()=>{SelectCatFunction(item._id)}}/>

                          ))
                        }
                        
                      </Tabs>
                    </div>

               



                </div>
              </div>
              <div className="productitems PR2 ml-2 mt-4 swiper-container">
                <Swiper
                  spaceBetween={20}
                  slidesPerView={4}
                  navigation={true} // Use default navigation

                  breakpoints={{
                    0: {
                      slidesPerView: 2, // For screens smaller than 700px
                      slidesPerGroup: 1, // Adjust grouping if needed
                    },
                    700: {
                      slidesPerView: 4, // For screens larger than or equal to 700px
                    },
                  }}
                
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Navigation, Pagination]}
                  className="mySwiper"
                >
                  {
                    
                  filterdata?.length !== 0 &&
                  filterdata?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <HomeProducts data={item} />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              <div className="mt-5">
                <div className="d-flex align-items-center">
                  <div
                    className="info w-100 d-flex align-items-center"
                    style={{ position: "relative" }}
                  >
                    <div className="info1">
                      <h3 className="mb-0">New Products</h3>
                      <p style={{ color: "gray" }} className="mb-0 text-sm">
                        New products with updated stocks
                      </p>
                    </div>
                    <div className="info2">
                    <Link to={"/category/67359b23b4e31d18f2cfb9be"}>
                    <Button
                        className="arrowpro"
                        style={{ position: "abosolute", right: -380 }}
                      >
                        {" "}
                        View All <FaArrowRight />
                      </Button>
                    </Link>
                    </div>
                  </div>
                </div>

                <div className="productitems  productRow2  swiper-container mt-4 w-100 d-flex">
                  {productsList?.product?.length !== 0 &&
                    productsList?.product?.map((item, index) => (
                      <HomeProducts data={item} />
                    ))}
                </div>
              </div>
              <div className="bottomBanner d-flex ">
                <img
                  src="https://i.ytimg.com/vi/EiAD7CNp4Vo/maxresdefault.jpg"
                  alt=""
                />
                <img
                  src="https://img.freepik.com/premium-psd/banner-template-online-fashion-sale_23-2148585403.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="newsLettersection mt-3 mb-4 d-felx align-items-cente r">
        <div className="container">
          <div className="row d-flex">
            <div className="col-md-6 w-100 p-3">
              <p className="mb-1 text-white">
                $20 discount for your first order
              </p>
              <h3 className="text-white">Join our newsletter and get...</h3>
              <p className="p2 mb-5">
                Join our emailsubscription now to get the updates on promote and
                coupons.
              </p>
              <form action="" className="mt-1">
                <CiMail />
                <input type="text" placeholder="Your Email Address" />
                <Button>Subscribe</Button>
              </form>
            </div>
            <div className="col-md-6">
              <img
                src="https://st.depositphotos.com/4227555/57433/i/450/depositphotos_574335086-stock-illustration-illustration-super-sale-special-offer.jpg"
                alt=""
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
