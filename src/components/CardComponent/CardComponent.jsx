import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountTest, WrapperPriceTest, WrapperReportTest, WrapperStyleTextSell } from './Style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/shirt-1491020410-3cc3d617c7b22cc6a862e9cefd96bd74.jpg'
const CardComponent = (props ) => {

  const  {countInStock, decription, image, name, price, rating, type, selled, discount  } = props
 
  return (
    <WrapperCardStyle
        hoverable
        headStyle={{width: '200px', height: '200px'}}
        style={{ width: 200 }}
        bodyStyle={{padding: '10px'}}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <img 
            src ={logo}
            alt='logo' 
            style={{
              width: '68px', 
              height: '14px', 
              position: 'absolute', 
              top: -1, 
              left: -1,
              borderTopLeftRadius: '3px' 
            }}/>
          <StyleNameProduct>{name}</StyleNameProduct>
          <WrapperReportTest>
            <span style={{ marginRight:'4px'}}>
              <span>{rating}</span> <StarFilled style={{fontSize: '12px', color: 'yellow'}}/> 
            </span>
            <WrapperStyleTextSell> | Đã bán {selled || 1000}+</WrapperStyleTextSell>
            
          </WrapperReportTest>
          <WrapperPriceTest>
            <span style={{marginRight: '8px'}}>{price} </span>  
            <WrapperDiscountTest> {discount || 5}% </WrapperDiscountTest>
          </WrapperPriceTest>
        </WrapperCardStyle>
  )
}

export default CardComponent
