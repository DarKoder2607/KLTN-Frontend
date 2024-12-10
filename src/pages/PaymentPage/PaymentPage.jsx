import {Form, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2'; 
import * as PaymentService from '../../services/PaymentService'
import { removesFromCart, setCarts } from '../../redux/slides/cartSlice';
import { getCart } from '../../services/CartService';

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady , setSdkReady] = useState(false)
  const [rewardPointsUsed, setRewardPointsUsed] = useState(1000);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [form] = Form.useForm();

  const dispatch = useDispatch()


  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    if (!order || !order.orderItemsSlected) return 0;
  
    const totalPrice = order.orderItemsSlected.reduce((total, cur) => {
      return total + (cur.price * cur.amount);  
    }, 0);
  
    const discountedPrice = order.orderItemsSlected.reduce((total, cur) => {
      const discountPercentage = cur.discount || 0;  
      const priceBeforeDiscount = cur.price * cur.amount;  
      const discountAmount = (priceBeforeDiscount * discountPercentage) / 100;  
      return total + (priceBeforeDiscount - discountAmount);  
    }, 0);
  
    return totalPrice - discountedPrice;
  }, [order]);
  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo > 2000000 && priceMemo < 5000000){
      return 10000
    }else if(priceMemo >=5000000){
      return 2000
    }else {
      return 20000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const handleUseRewardPoints = (value) => {
    const maxUsablePoints = Math.min(user.rewardPoints, Math.floor(totalPriceMemo / 3)); // 1.000 điểm = 3.000 VND
    setRewardPointsUsed(Math.min(value, maxUsablePoints));
  };

  const totalDiscount = rewardPointsUsed * 3; // 1 điểm = 3 VND

  const totalPriceAfterDiscount = totalPriceMemo - totalDiscount;

  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemsSlected && user?.name
      && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
      mutationAddOrder.mutate(
        { 
          token: user?.access_token, 
          orderItems: order?.orderItemsSlected, 
          fullName: user?.name,
          address:user?.address, 
          phone:user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: diliveryPriceMemo,
          totalPrice: totalPriceAfterDiscount,
          user: user?.id,
          email: user?.email,
          rewardPointsUsed,
        }
      );
    }
  };
  
  
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )

  const {isPending, data} = mutationUpdate
  const {data: dataAdd,isPending:isPendingAddOrder, isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order?.orderItemsSlected?.forEach(element => {
        arrayOrdered.push(element.product)
      });
      order?.orderItemsSlected?.forEach((element) => {
        dispatch(removesFromCart({ product: element.product }));  
      });

      if (user?.access_token) {
        getCart(user.access_token).then((res) => {
          dispatch(setCarts(res.cartItems));
        }).catch((err) => {
          message.error('Không thể cập nhật giỏ hàng');
        });
      }

      const rewardPointsEarned = Math.floor(totalPriceMemo / 1000); 
      if (payment === 'paypal') {
        message.success(`Đặt hàng thành công. Bạn nhận được ${rewardPointsEarned} điểm thưởng.`);
      } else {
        message.success('Đặt hàng thành công')
      }
     
      navigate('/orderSuccess', {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSlected,
          totalPriceMemo: totalPriceAfterDiscount
        }
      })
    } else if (isError) {
      message.error()
    }
  }, [isSuccess,isError, order, dispatch])

  console.log('rewardPoints', user.rewardPoints)

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      { 
        token: user?.access_token, 
        orderItems: order?.orderItemsSlected, 
        fullName: user?.name,
        address:user?.address, 
        phone:user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceAfterDiscount,
        user: user?.id,
        isPaid :true,
        paidAt: details.update_time, 
        email: user?.email,
        rewardPointsUsed,
      }
    )
  }


  const handleUpdateInforUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleDilivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    }else {
      setSdkReady(true)
    }
  }, [])
  console.log('order', order)

  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <Loading isPending={isPendingAddOrder}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3 style={{fontSize : '20px'}}><span style={{cursor: 'pointer', fontWeight: 'bold'}} 
                      onClick={() => navigate('/')}>Trang chủ</span>
                      <span style={{cursor: 'pointer', fontWeight: 'bold'}} 
                      onClick={() => navigate('/order')}> \ Giỏ hàng</span> \ Thanh toán </h3>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDilivery} value={delivery}> 
                    <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}> 
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng PayPal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{width: '100%'}}>
                <WrapperInfo>
                  <div>
                    <span style={{ fontSize: "15px" , fontWeight: 'bold'}}>Địa chỉ: </span>
                    <span style={{fontSize: "18px"}}>{ `${user?.address} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontSize: "13px"}}>Tạm tính</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontSize: "13px"}}>Giảm giá</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}> - {convertPrice(priceDiscountMemo)}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontSize: "13px"}}>Phí giao hàng</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>+ {convertPrice(diliveryPriceMemo)}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span style={{fontSize: "13px"}}>Quy đổi điểm thưởng</span>
                    <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>- {convertPrice(totalDiscount)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span style={{fontSize: "13px"}}>Tổng tiền</span>
                  <span style={{display:'flex', flexDirection: 'column'}}>
                    <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceAfterDiscount)}</span>
                    <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
                <p style={{fontSize: "15px", fontWeight: 'bold', display: 'flex'}}>Điểm thưởng của bạn hiện tại: 
                    <div style={{color: 'green', fontSize: "15px", margin: '0 5px'}}>
                      {user?.rewardPoints}
                    </div>
                     điểm</p>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <input style={ { height: '20px', marginRight: '10px'}} 
                      type="number" 
                      value={rewardPointsUsed} 
                      onChange={(e) => handleUseRewardPoints(Number(e.target.value))} 
                      placeholder="Nhập số điểm bạn muốn sử dụng" 
                  />
                  <p style={{fontSize: "13px"}}> 1.000 điểm = 3.000 VND</p>
                </div>
              </div>
              {payment === 'paypal' && sdkReady ? (
                <div style={{width: '320px'}}>
                  <PayPalButton
                    amount={Math.round(totalPriceAfterDiscount / 30000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert('Error')
                    }}
                  />
                </div>
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                      background: 'rgb(255, 57, 69)',
                      height: '48px',
                      width: '320px',
                      border: 'none',
                      borderRadius: '4px'
                  }}
                  textbutton={'Đặt hàng'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonComponent>
              )}
            </WrapperRight>
          </div>
        </div>
        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          <Loading isPending={isPending}>
          <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your  phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>

              <Form.Item
                label="Adress"
                name="address"
                rules={[{ required: true, message: 'Please input your  address!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage