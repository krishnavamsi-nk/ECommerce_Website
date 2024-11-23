import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

const HomeCat = (props) => {
  const {data} = props;
  return (

    <>
      <div className="homecat" style={{ position: "relative", top: "60px" }}>
        <div className="container-fluid ml-3">
          <h3>Featured Categeries</h3>
          <div className="d-flex align-items-center justify-content-between item-list">
            <span>Cake & Milk</span>
            <span>Coffees & Teas</span>
            <span>Pet & Foods</span>
            <span>Vegetables</span>
          </div>
          <div className="item mt-2">
            <Swiper
              spaceBetween={20}
              slidesPerView={7}
              slidesPerGroup={3} 
              navigation={true}
              breakpoints={{
                0: {
                  slidesPerView: 3, // For screens smaller than 700px
                  slidesPerGroup: 1, // Adjust grouping if needed
                },
                700: {
                  slidesPerView: 7, // For screens larger than or equal to 700px
                },
              }}
            
              pagination={{
                clickable: true,
              }}
              modules={[Navigation, Pagination]}
              className="mySwiper1"
            >

              {
                data?.length!==0 && data?.map((item,index)=>(
                  <SwiperSlide key={index}
                  className="custom-slide"
                  style={{
                    background:`${item.color}`,
                    width: "100%",
                    height: "100%",
                  }}
                >
                <Link to={`/category/${item._id}`} key={item._id}>
                <div className="p-3 catItem" style={{ width: "100%", height: "100%" }}>
                    <div style={{ width: "80px", height: "80px" }}>
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        src={item.images[0]}
                        alt="image"
                      />
                    </div>
                    <div className="text-center">
                      <h6>{item?.name?.length>10?item?.name.substr(0,10)+"...":item?.name}</h6>
                      <p>{item?.items} items</p>
                    </div>
                  </div>
                </Link>
                </SwiperSlide>

                ))

              }
            
             
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeCat;
