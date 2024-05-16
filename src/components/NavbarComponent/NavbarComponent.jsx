import { Checkbox, Col, Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue, WrapperTypeProduct } from './Style'
import * as ProductService from '../../services/ProductService'

import TypeProduct from '../TypeProduct/TypeProduct'

const NavBarComponent = () => {

    const [typeProducts, setTypeProducts] = useState([])

    const fetchAllTypeProduct = async () => {
        try {
            const res = await ProductService.getAllTypeProduct();
            if (res?.data && Array.isArray(res.data)) {
                setTypeProducts(res.data);
            } else {
                console.error('Invalid type product data:', res.data);
            }
        } catch (error) {
            console.error('Error fetching type products:', error);
        }
    };
    useEffect(() => {
        fetchAllTypeProduct()
    
    }, [])



    return (
        <div>
            <WrapperLableText>Thương hiệu</WrapperLableText>
            <WrapperContent>
                    <WrapperTypeProduct style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                        {typeProducts.map((item) =>{
                            return(
                                <TypeProduct name={item} key = {item}/>
                            )
                        })}        
                    </WrapperTypeProduct>
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent