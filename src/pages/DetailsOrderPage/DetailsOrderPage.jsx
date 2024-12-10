import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperContentProduct, WrapperContentProductBill, WrapperContentProductInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import logo from '../../assets/images/logo.png'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/Loading'

const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({ 
    queryKey: ['orders-details'], 
    queryFn: fetchDetailsOrder , 
    enabled: !!id
  })
  const { isPending, data } = queryOrder

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      const discountPrice = cur.price - (cur.price * (cur.discount || 0) / 100);
      return total + (discountPrice * cur.amount);
    }, 0);
    return result;
  }, [data])

  const shippingFee = useMemo(() => {
    if (priceMemo < 2000000) {
      return 20000;
    } else if (priceMemo <= 5000000) {
      return 10000;
    } else {
      return 2000;
    }
  }, [priceMemo]);

   const rewardPointsUsed = data?.rewardPointsUsed || 0;  
   const rewardPointsValue = rewardPointsUsed * 3;  
 
   const totalAfterRewards = priceMemo + shippingFee - rewardPointsValue;

  return (
   <Loading isPending={isPending}>
     <div style={{width: '100%', height: '100vh', background: '#f5f5fa'}}>
      <div style={{ width: '1270px', margin: '0 auto', height: '1270px'}}>
        <h4>Chi tiết đơn hàng</h4>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>{data?.shippingAddress?.fullName}</div>
              <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
              <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
             
              <div className='delivery-fee'><span>Phí giao hàng: </span> {shippingFee}</div>
              <div className='status-payment'>{data?.isDelivered ? 'Đã giao hàng' : 'Đang giao hàng'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
              <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent>
          <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{width: '670px'}}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
          </div>
          {data?.orderItems?.map((order) => {
            const discountAmount = order?.price * (order?.discount || 0) / 100;
            const discountPrice = order?.price - discountAmount;
            return (
              <WrapperProduct>
                 <WrapperContentProduct>
                  <WrapperNameProduct>
                    <img src={order?.image} 
                      style={{
                        width: '70px', 
                        height: '70px', 
                        objectFit: 'cover',
                        border: '1px solid rgb(238, 238, 238)',
                        padding: '2px'
                      }}
                    />
                    <div style={{
                      width: 260,
                      overflow: 'hidden',
                      textOverflow:'ellipsis',
                      whiteSpace:'nowrap',
                      marginLeft: '10px',
                      height: '70px',
                    }}>Điện thoại: {order?.name}</div>
                  </WrapperNameProduct>
                </WrapperContentProduct>
                <WrapperContentProductInfo>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                </WrapperContentProductInfo>
                <WrapperContentProductInfo>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  </WrapperContentProductInfo>
                <WrapperContentProductInfo>
                  <WrapperItem>{order?.discount ? convertPrice(discountAmount * order?.amount) : '0 VND'}</WrapperItem>
                </WrapperContentProductInfo>
                
              </WrapperProduct>
              
            )
          })}
          
          
          <WrapperAllPrice>
            <WrapperContentProductBill>
              <WrapperItemLabel style={{ fontSize : '15px' , fontWeight : 'bold'}}>Tạm tính</WrapperItemLabel>
              <WrapperItem style={{ fontSize : '20px'}}>{convertPrice(priceMemo)}</WrapperItem>
            </WrapperContentProductBill>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperContentProductBill>
              <WrapperItemLabel style={{ fontSize : '15px', fontWeight : 'bold'}}>Phí vận chuyển</WrapperItemLabel>
              <WrapperItem style={{ fontSize : '20px'}}>{convertPrice(shippingFee)}</WrapperItem>
            </WrapperContentProductBill>
          </WrapperAllPrice>
          <WrapperAllPrice>
              <WrapperContentProductBill>
                <WrapperItemLabel style={{ fontSize : '15px', fontWeight : 'bold'}}>Điểm tích lũy sử dụng</WrapperItemLabel>
                <WrapperItem style={{ fontSize : '20px'}}>{convertPrice(rewardPointsValue)}</WrapperItem>
              </WrapperContentProductBill>
            </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperContentProductBill>
              <WrapperItemLabel style={{ fontSize : '15px', fontWeight : 'bold'}}>Tổng cộng</WrapperItemLabel>
              <WrapperItem style={{ fontSize : '20px'}}>{convertPrice(totalAfterRewards )}</WrapperItem>
            </WrapperContentProductBill>
          </WrapperAllPrice>
         
      </WrapperStyleContent>
      </div>
    </div>
   </Loading>
  )
}

export default DetailsOrderPage