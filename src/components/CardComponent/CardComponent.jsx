import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountTest, WrapperPriceTest, WrapperPriceTextProduct, WrapperReportTest, WrapperStyleTextSell } from './Style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/shirt-1491020410-3cc3d617c7b22cc6a862e9cefd96bd74.jpg'
import { useNavigate } from 'react-router-dom'
const CardComponent = (props ) => {

  const  {countInStock, decription, image, name, price, rating, type, selled, discount, id  } = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }
  return (
    <WrapperCardStyle
        hoverable
        styles={{
          head :{width: '200px', height: '200px'},
          body :{padding: '10px'}
        }}
        
        style={{ width: 200, height: 350}}
       
        cover={<img alt="example" src={image} />}
        onClick={() => countInStock !==0 && handleDetailsProduct(id)}    
        disabled = {countInStock ===0}
    >
        {countInStock === 0 && (
        <div style={{ background: '#FFCCCC',position: 'absolute', fontSize: '18px', 
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'red' ,width: '100%',
          }}>
          Đã hết hàng
        </div>
        )}
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
            <WrapperStyleTextSell> | Đã bán {selled || 0} sản phẩm</WrapperStyleTextSell>
            
          </WrapperReportTest>
          <WrapperPriceTest>
            {discount > 0 ? (
                              <>
                                  <WrapperPriceTextProduct >
                                      <span style={{ textDecoration: 'line-through' , fontSize: '10px'}}  className='origin-price'>{price.toLocaleString()}VNĐ</span>
                                      <span className='discount-price'> 
                                          {(price - price*(discount/100)).toLocaleString()}VNĐ
                                      </span>
                                  </WrapperPriceTextProduct>
                              </>
                          ) : (
                              <WrapperPriceTextProduct><span className='origin-price' style={{color: 'red'}}>{price.toLocaleString()}VNĐ </span></WrapperPriceTextProduct>
                          )}  
       
          </WrapperPriceTest>
          <WrapperDiscountTest>{discount > 0 ?  '-'+discount + '%': "No discount"} </WrapperDiscountTest>
        </WrapperCardStyle>
  )
}

export default CardComponent
