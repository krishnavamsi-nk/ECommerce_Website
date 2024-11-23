import React from "react";
import Slider from "react-slick";

const HomeBanner = (props) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,           // Enables autoplay
    autoplaySpeed: 5000,  
  };
  const {data} = props;

  return (
    <>
      <div className="container">
        <div
          className="homeBannersec"
          style={{ position: "relative", top: "-450px" }}
        >
          <Slider {...settings}>
    {
      data?.length !==0 && data?.map((item,index)=>(
        <div key={index}>
        <img
          src={item?.images[0]}
          alt=""
          style={{
            minWidth: "700px",
            width: "100%",
            height: "358px",
          }}
        />
      </div>
      ))
    }
         
          </Slider>
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
