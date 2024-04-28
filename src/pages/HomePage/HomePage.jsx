import React from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./Style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from '../../assets/images/720-220-720x220-74.webp'
import slider2 from '../../assets/images/Redmi-3A-720-220-720x220-3.webp'
import slider3 from '../../assets/images/SW-Xiaomi-720-220-720x220-1.webp'
import slider4 from '../../assets/images/sac-AVA-720-220-720x220-1.webp'
import CardComponent from "../../components/CardComponent/CardComponent";
const HomePage = () => {
    const arr = ['Oppo', 'Samsung', 'Nokia']
    return (
        <>
            <div style={{width: '1270px', margin:' 0 auto'}}>
                <WrapperTypeProduct>
                    {arr.map((item) =>{
                        return(
                            <TypeProduct name={item} key = {item}/>
                        )
                    })}        
                </WrapperTypeProduct>
            </div>
            <div className="body" style={{width: ' 100%', backgroundColor: '#efefef'}}>
                <div id="contrainer" style={{width:'1270px', margin:'0 auto', height: '1000px'}}>
                    <SliderComponent arrImages = {[slider1,slider2,slider3,slider4]}/>
                    <WrapperProducts>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        
                    </WrapperProducts>
                    <div style={{width: '100%', justifyContent: 'center', display:'flex', marginTop: '10px'}}>
                        <WrapperButtonMore textButton="Xem thêm" type="outline" styleButton={{
                            border: '1px solid rgb(11,116,229)',
                            color: 'rgb(11,116,229)',
                            width: '240px',
                            height: '38px',
                            borderRadius: '4px', 
                            }}
                            styleTextButton={{fontWeight: 500}}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage