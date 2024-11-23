import Button from "@mui/material/Button";
import { FaArrowRight } from "react-icons/fa6";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import HomeProducts from "../../../Components/HomeBanner/Homeproducts/index";

const RelatedProducts = (props) => {
  const { viewedProuct,relatedProductData } = props;

  return (
    <>
      <div className="d-flex align-items-center mt-4">
        <div
          className="info w-100 d-flex align-items-center"
          style={{ position: "relative" }}
        >
          <div className="info1">
            <h4 className="mb-0">{props.title}</h4>
            <p style={{ color: "gray" }} className="mb-0 text-sm">
              Do not miss the offer Now until end of the march
            </p>
          </div>
          <div className="info2">
            <Button
              className="arrowpro"
              style={{ position: "absolute", right: -380 }}
            >
              View All <FaArrowRight />
            </Button>
          </div>
        </div>
      </div>

      <div className="productitems PR2 ml-2 mt-4 swiper-container">
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          navigation={true} // Use default navigation
          pagination={{
            clickable: true,
          }}

          breakpoints={{
            0: {
              slidesPerView: 2, // For screens smaller than 700px
              slidesPerGroup: 1, // Adjust grouping if needed
            },
            700: {
              slidesPerView: 4, // For screens larger than or equal to 700px
            },
          }}
          
          modules={[Navigation, Pagination]}
          className="mySwiper"
        >
          {relatedProductData?.length !== 0 &&
            relatedProductData?.map((item, index) => (
              <SwiperSlide>
                <HomeProducts viewedProuct={viewedProuct} data={item} check={props.viewedProuct}/>
                
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
};

export default RelatedProducts;
