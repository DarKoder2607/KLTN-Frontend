import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperContentProduct, WrapperContentProductBill, WrapperContentProductInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import useHover from '../../hooks/useHover'

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

  const navigate =useNavigate()
  const { isHovered: isHomeHovered, handleMouseEnter: handleHomeEnter, handleMouseLeave: handleHomeLeave } = useHover()
  const { isHovered: isCartHovered, handleMouseEnter: handleCartEnter, handleMouseLeave: handleCartLeave } = useHover()

  return (
    <Loading isPending={isPending}>
      <div style={{ width: '100%', height: '100vh', background: '#f5f5fa' ,   minHeight: '100vh', paddingBottom: '200px' }}>
        <div style={{ width: '1270px', margin: '0 auto', height: '1270px' }}>
          {/* Navigation and title */}
          <span style={{ fontSize: '15px' }}>
            <span
              style={{
                cursor: 'pointer',
                color: isHomeHovered ? '#ea8500' : '#000',
              }}
              onMouseEnter={handleHomeEnter}
              onMouseLeave={handleHomeLeave}
              onClick={() => navigate('/')}
            >
              Trang chủ
            </span>
            <span
              style={{
                cursor: 'pointer',
                color: isCartHovered ? '#ea8500' : '#000',
              }}
              onMouseEnter={handleCartEnter}
              onMouseLeave={handleCartLeave}
              onClick={() => navigate('/my-order')}
            >
              {' '}
              \ Đơn hàng của tôi
            </span>{' '}
            <span>\ </span>
            <span style={{ color: 'blue', fontWeight: 'bold' }}> Chi tiết đơn hàng </span>
          </span>
          <h1
            style={{
              color: 'red',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            CHI TIẾT ĐƠN HÀNG
          </h1>
  
          {/* User Information */}
          <WrapperHeaderUser >
            <WrapperInfoUser >
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo style={{background: '#fdfcc5'}}>
                <div className="name-info" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {data?.shippingAddress?.fullName}
                </div>
                <div
                  className="address-info"
                  style={{ fontSize: '15px', color: '#ef7f00' }}
                >
                  <span style={{ color: 'black', fontWeight: 'bold' }}>Địa chỉ: </span>{' '}
                  {`${data?.shippingAddress?.address}, ${data?.shippingAddress?.ward}, ${data?.shippingAddress?.district}, ${data?.shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span style={{ color: 'black', fontWeight: 'bold' }}>Điện thoại: </span>{' '}
                  {data?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser >
              <WrapperLabel>Trạng thái giao hàng</WrapperLabel>
              <WrapperContentInfo style={{background: '#c3ebf9 '}}>
                <div
                  className="delivery-fee"
                  style={{ fontSize: '15px', color: 'blue' }}
                >
                  <span style={{ color: 'black', fontWeight: 'bold' }}>Phí vận chuyển: </span>{' '}
                  {convertPrice(data?.shippingPrice)}
                </div>
                <div
                  className="status-payment"
                  style={{ fontSize: '20px', fontWeight:  'bold' }}
                >
                  {data?.isDelivered}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo style={{background: '#cbffb6'}}>
                <div
                  className="payment-info"
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '15px',
                  }}
                >
                  {orderContant.payment[data?.paymentMethod]}
                </div>
                <div
                  className="status-payment"
                  style={{ fontSize: '20px', fontWeight: data?.isPaid ? 'bold': 'unset',color: data?.isPaid ? '#00d400' : '#3e3e3d ' }}
                >
                  {data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>
  
          {/* Two-Column Layout */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            {/* Left Column - Product List */}
            <div style={{ width: '60%', paddingRight: '20px' }}>
              <WrapperStyleContent
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '15px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    width: '900px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left',
                  }}
                >
                  <div style={{ width: '430px' }}>Sản phẩm</div>
                  <WrapperItemLabel style={{marginRight: '110px'}}>Giá</WrapperItemLabel>
                  <WrapperItemLabel style={{ marginRight: '190px' }}>Số lượng</WrapperItemLabel>
                  <WrapperItemLabel>Giảm giá</WrapperItemLabel>
                </div>
                {data?.orderItems?.map((order) => {
                  const discountAmount = order?.price * (order?.discount || 0) / 100;
                  const discountPrice = order?.price - discountAmount;
                  return (
                    <WrapperProduct  >
                      <WrapperContentProduct style={{background: '#ffe0cc'}}>
                        <WrapperNameProduct>
                          <img
                            src={order?.image}
                            style={{
                              width: '70px',
                              height: '70px',
                              objectFit: 'cover',
                              border: '1px solid rgb(238, 238, 238)',
                              padding: '2px',
                            }}
                          />
                          <div
                            style={{
                              width: '200px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'wrap',
                              marginLeft: '10px',
                              height: '70px',
                            }}
                          >
                           {order?.name}
                          </div>
                        </WrapperNameProduct>
                      </WrapperContentProduct>
                      <WrapperContentProductInfo>
                        <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                      </WrapperContentProductInfo>
                      <WrapperContentProductInfo>
                        <WrapperItem>{order?.amount}</WrapperItem>
                      </WrapperContentProductInfo>
                      <WrapperContentProductInfo>
                        <WrapperItem>
                          {order?.discount ? convertPrice(discountAmount * order?.amount) : '0 VND'}
                        </WrapperItem>
                      </WrapperContentProductInfo>
                    </WrapperProduct>
                  );
                })}
              </WrapperStyleContent>
            </div>
  
            {/* Right Column - Invoice Calculation */}
            <div style={{ width: '35%' }}>
              <WrapperAllPrice>
                <WrapperContentProductBill>
                  <WrapperItemLabel style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    Tạm tính
                  </WrapperItemLabel>
                  <WrapperItem style={{ fontSize: '20px' }}>
                    {convertPrice(priceMemo)}
                  </WrapperItem>
                </WrapperContentProductBill>
              </WrapperAllPrice>
              <WrapperAllPrice>
                <WrapperContentProductBill>
                  <WrapperItemLabel style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    Phí vận chuyển
                  </WrapperItemLabel>
                  <WrapperItem style={{ fontSize: '20px' }}>
                    + {convertPrice(data?.shippingPrice)}
                  </WrapperItem>
                </WrapperContentProductBill>
              </WrapperAllPrice>
              <WrapperAllPrice>
                <WrapperContentProductBill>
                  <WrapperItemLabel style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    Điểm tích lũy sử dụng
                  </WrapperItemLabel>
                  <WrapperItem style={{ fontSize: '20px' }}>
                   - {convertPrice(rewardPointsValue)}
                  </WrapperItem>
                </WrapperContentProductBill>
              </WrapperAllPrice>
              <WrapperAllPrice>
                <WrapperContentProductBill>
                  <WrapperItemLabel style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    Thành tiền
                  </WrapperItemLabel>
                  <WrapperItem style={{ fontSize: '20px' }}>
                    {convertPrice(data?.totalPrice)}
                  </WrapperItem>
                </WrapperContentProductBill>
              </WrapperAllPrice>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
  
}

export default DetailsOrderPage