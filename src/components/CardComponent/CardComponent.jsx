import React from 'react'
import { StyleNameProduct, WrapperAddToCart, WrapperCardStyle, WrapperDiscountTest, WrapperPriceTest, WrapperPriceTextProduct, WrapperReportTest, WrapperStyleTextSell } from './Style'
import { PlusCircleOutlined, StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/shirt-1491020410-3cc3d617c7b22cc6a862e9cefd96bd74.jpg'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../services/CartService'
import { addingToCart } from '../../redux/slides/cartSlice'
import { message } from 'antd'
const CardComponent = (props ) => {

  const  {isHidden, countInStock, image, name, price, rating, selled, discount, id, originPrice } = props
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  if (isHidden) {
    return null;
  }

  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation(); 

    if (!user?.id) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/sign-in');
      return;
    }

    try {
      const res = await addToCart(id, 1, user?.access_token);
      message.success('Đã thêm vào giỏ hàng thành công');
      dispatch(addingToCart({
        product: id,
        name,
        image,
        amount: 1,
        price,
        discount,
      }));
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

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
              height: '18px', 
              position: 'absolute', 
              top: -1, 
              left: -1,
              borderTopLeftRadius: '3px' 
            }}/>
          <StyleNameProduct>{name}</StyleNameProduct>
          <WrapperReportTest>
            <span style={{ marginRight:'4px'}}>
              <span>{(rating || 0).toFixed(1)}</span> <StarFilled style={{fontSize: '12px', color: 'yellow'}}/> 
            </span>
            <WrapperStyleTextSell> | Đã bán {selled || 0} sản phẩm</WrapperStyleTextSell>
            
          </WrapperReportTest>
          <WrapperPriceTest>
              {discount > 0 ? (
                  <WrapperPriceTextProduct style={{textAlign: "center"}} >
                      <span style={{ textDecoration: 'line-through' , fontSize: '10px'}}  className='origin-price'>{price.toLocaleString()} </span>
                      <span className='discount-price'> 
                          {(price - price*(discount/100)).toLocaleString()}VNĐ
                      </span>
                  </WrapperPriceTextProduct>
            
                ) : discount === 0 && price < originPrice ? (  
                  <WrapperPriceTextProduct style={{ textAlign: "center" }}>
                      <span style={{ textDecoration: 'line-through' , fontSize: '10px'}}  className='origin-price'>{originPrice.toLocaleString()} </span>
                      <span className='discount-price'>
                          {price.toLocaleString()} VNĐ
                      </span>
                  </WrapperPriceTextProduct>
              ) : (
                    <WrapperPriceTextProduct style={{textAlign: "center"}}><span className='origin-price' style={{color: 'red'}}>{price.toLocaleString()}VNĐ </span></WrapperPriceTextProduct>
                )}  
       
          </WrapperPriceTest>
          <WrapperDiscountTest style={{ display: discount > 0 ? 'block' : 'none' }}> 
              {'-' + discount + '%'} 
          </WrapperDiscountTest>
          {countInStock !== 0 && (
            <WrapperAddToCart style={{marginBottom: '5px' ,display:'flex', justifyContent: 'center', alignItems: 'center'}} onClick={handleAddToCart}>
              <PlusCircleOutlined />
              <span className="add-to-cart-text" style={{marginLeft: '2px'}}>Thêm vào giỏ</span>
            </WrapperAddToCart>
          )}
        </WrapperCardStyle>
      );
  
}

export default CardComponent
