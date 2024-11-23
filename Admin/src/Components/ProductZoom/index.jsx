import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import InnerImageZoom from "react-inner-image-zoom";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

const ProductZoom = (props) => {
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();
  const [indexitem, setIndexitem] = useState(0);

  const {discount, imagesdata } = props;
  

  const goto = (index) => {
    setIndexitem(index);
    zoomSlider.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };

  return (
    <>
      <div className="productZoom">
        <div className="badge" style={{zIndex:"10"}}>{discount}%</div>

        <Swiper
          pagination={{
            type: "fraction",
          }}
          navigation={false}
          modules={[Pagination, Navigation]}
          className="mySwiper"
          ref={zoomSliderBig}
        >
          {imagesdata !== undefined &&
            imagesdata?.length !== 0 &&
            imagesdata.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="item prod-item">
                  <InnerImageZoom
                    className="img1"
                    zoomType="hover"
                    zoomScale={1}
                    src={item}
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        pagination={{
          type: "fraction",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="zoomSlider"
        ref={zoomSlider}
      >
        {imagesdata !== undefined &&
          imagesdata?.length !== 0 &&
          imagesdata.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className={`item ${index === indexitem ? "item_active" : ""}`}
              >
                <img
                  src={item}
                  alt=""
                  className="w-100"
                  onClick={() => goto(index)}
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
};

export default ProductZoom;
