import React,{ useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'
import useHover from '../../hooks/useHover';

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token)
    
    return res.data
   
  }
  const user = useSelector((state) => state.user)

  const queryOrder = useQuery( 
    {queryKey: ['orders'], 
    queryFn: fetchMyOrder , 
    enabled: !!(state?.id && state?.token)
  })
  const { isPending, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    })
  }

  const mutation = useMutationHooks(
    (data) => {
      const { id, token , orderItems, userId } = data
      const res = OrderService.cancelOrder(id, token,orderItems, userId)
      return res
    }
  )

  const handleCanceOrder = (order) => {
    if (order?.isDelivered !== "Đã giao" && order?.isDelivered !== "Đang vận chuyển")
    {
      mutation.mutate({id : order._id, token:state?.token, orderItems: order?.orderItems, userId: user.id }, {
        onSuccess: () => {
          queryOrder.refetch()
        },
      })
    }  
    
  }
  const { isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success("Hủy đơn hàng thành công")
    } else if(isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    }else if (isErrorCancle) {
      message.error()
    }
  }, [isErrorCancle, isSuccessCancel])

  console.log('data', data)

  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem key={order?._id}> 
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
                fontSize: '16px',
                overflow: 'hidden',
                textOverflow:'ellipsis',
                whiteSpace:'nowrap',
                marginLeft: '10px'
              }}>{order?.name}</div>
              <span style={{ fontSize: '16px', color: '#242424',marginLeft: 'auto' }}>{convertPrice(order?.price - order?.price*order?.discount/100)}</span>
            </WrapperHeaderItem>
          })
  }

  const { isHovered , handleMouseEnter, handleMouseLeave  } = useHover()

  return (
    <Loading isPending={isPending || isPendingCancel}>
      <WrapperContainer style={{ minHeight: '100vh', paddingBottom: '200px'}}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
            <span style={{fontSize : '15px'}}>
                <span style={{
                    cursor: 'pointer', 
                    color: isHovered ? '#ea8500' : '#000' 
                    }} 
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}  
                    onClick={() => navigate('/')}>Trang chủ</span> <span>\</span>
                        <span style={{fontWeight: 'bold', color: 'blue'}}> Đơn hàng của tôi </span>
                </span>
          
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus style={{fontSize: '15px'}}>
                    <span style={{fontSize: '18px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.isDelivered}`}</span>
                    </div>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
                    </div>
                    <div>
                      <span style={{}}>Mã đơn hàng: </span>
                      <span style={{color: 'rgb(0, 148, 22)', fontWeight: 'bold'}}>  {order.orderCode ? order.orderCode : order._id}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{fontSize: '15px', color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '16px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                    <ButtonComponent
                        disabled = {order.isDelivered === 'Đã giao' || order.isDelivered ==='Đang vận chuyển'}
                        onClick={() => handleCanceOrder(order)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                        }}
                        textbutton={'Hủy đơn hàng'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                        }}
                        textbutton={'Xem chi tiết'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage