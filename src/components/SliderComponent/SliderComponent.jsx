import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './Style';

const SliderComponent = ({arrImages}) => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
      };
    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image)=>{
                return(
                    <Image src={image} alt='slider' preview = {false} width="100%" height="274px" />
                )
            })}
            
        </WrapperSliderStyle>
    )
}

export default SliderComponent
