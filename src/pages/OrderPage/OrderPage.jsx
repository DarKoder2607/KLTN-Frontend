import {Checkbox, Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import { WrapperInputNumber } from '../../components/ProductDetailsComponent/Style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { selectedOrder, setsShippingFee } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepConponent/StepComponent';
import { getCart, clearCart, removeFromCart, updateQuantity } from '../../services/CartService';
import { createOrder } from '../../services/OrderService';
import { clearsCart, decreaseAmount, increaseAmount, removesFromCart, setCarts, updatesCartItem } from '../../redux/slides/cartSlice';
import useHover from '../../hooks/useHover';

import * as ShippingService from '../../services/ShippingService'

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const shippingAddress = useSelector(state => state.user.shippingAddress);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover()
  const [stateUserDetails, setStateUserDetails] = useState({
    shippingAddress: {
      nameship: '',         // Tên người nhận
      addressShip: '',      // Địa chỉ giao hàng
      wardShip: '',         // Phường
      districtShip: '',     // Quận/huyện
      cityShip: '',         // Thành phố
      phoneShip: '',        // Số điện thoại
    },
  });

  useEffect(() => {
    if (shippingAddress) {
      setStateUserDetails({
        shippingAddress: {
          nameship: shippingAddress.nameship || '',
          addressShip: shippingAddress.addressShip || '',
          wardShip: shippingAddress.wardShip || '',
          districtShip: shippingAddress.districtShip || '',
          cityShip: shippingAddress.cityShip || '',
          phoneShip: shippingAddress.phoneShip || '',
        },
      });
    }
  }, [shippingAddress]);
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await getCart(user.access_token);
        setCart(response.cartItems);
        dispatch(setCarts(response.cartItems));
      } catch (error) {
        message.error('Lỗi khi tải giỏ hàng');
      } finally {
        setIsLoading(false);
      }
    };
  
    if (user?.access_token) {
      fetchCart();
    }
  }, [user]);

  const handleChangeCount = async (action, productId) => {
     
    const item = cart.find(item => item.product._id === productId);
    
    if (!item) return;
  
    let newQuantity = item.amount;
    const maxStock = item.product.countInStock;
   
    if (action === 'increase') {
      if (newQuantity >= maxStock) {
        message.warning(`Số lượng sản phẩm đã đạt giới hạn (${maxStock})!`);
        return;  
      }
      newQuantity += 1;
      dispatch(increaseAmount({ idProduct: productId, maxStock })); 
    } else if (action === 'decrease' && newQuantity > 1) {
      newQuantity -= 1;
      dispatch(decreaseAmount({ idProduct: productId }))
    }
    
  
    try { 
      const response = await updateQuantity(productId, newQuantity, user.access_token);
   
      setCart(response.cartItems);   
      dispatch(updatesCartItem({
        product: productId,
        amount: newQuantity
      }));

      dispatch(setCarts(response.cartItems));
      message.success('Cập nhật số lượng thành công!');
    } catch (error) {
      message.error('Cập nhật số lượng thất bại!');
    }
  };
  
  

  const handleDeleteOrder = async (productId) => {
    
    setCart((prevCart) => prevCart.filter(item => item.product._id !== productId));
  
    try {
      dispatch(removesFromCart({ product: productId }));
      const response = await removeFromCart(productId, user.access_token);
      setCart(response.cartItems);  
      dispatch(setCarts(response.cartItems));
      message.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    } catch (error) {
      message.error('Xóa sản phẩm thất bại!');
    }
  };
  

  const handleClearCart = async () => {
    try {
      const response = await clearCart(user.access_token);
      dispatch(clearsCart());
      setCart([]);
      message.success('Đã xóa toàn bộ giỏ hàng!');
    } catch (error) {
      message.error('Xóa toàn bộ giỏ hàng thất bại!');
    }
  };
  

  const onChange = (productId) => {
    setListChecked((prev) => {
      const isChecked = prev.includes(productId);
      if (isChecked) {
        return prev.filter(id => id !== productId);  
      } else {
        return [...prev, productId]; 
      }
    });
  };

  // Hàm xử lý khi chọn tất cả các sản phẩm
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const allProductIds = cart.map(item => item.product._id);
      setListChecked(allProductIds);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      nameship: stateUserDetails.shippingAddress.nameship,
      phoneShip: stateUserDetails.shippingAddress.phoneShip,
      cityShip: stateUserDetails.shippingAddress.cityShip,
      districtShip: stateUserDetails.shippingAddress.districtShip,
      wardShip: stateUserDetails.shippingAddress.wardShip,
      addressShip: stateUserDetails.shippingAddress.addressShip,
    });
  }, [stateUserDetails, form]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        shippingAddress: {
          nameship: shippingAddress.nameship || '',
          addressShip: shippingAddress.addressShip || '',
          wardShip: shippingAddress.wardShip || '',
          districtShip: shippingAddress.districtShip || '',
          cityShip: shippingAddress.cityShip || '',
          phoneShip: shippingAddress.phoneShip || '',
        }
      });
    }
}, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setStateUserDetails({
      isAdmin: false,
      shippingAddress: {  
        nameship: shippingAddress.nameship,
        addressShip: shippingAddress.addressShip,
        wardShip: shippingAddress.wardShip,
        districtShip: shippingAddress.districtShip,
        cityShip: shippingAddress.cityShip,
        phoneShip: shippingAddress.phoneShip,
    }})
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    return cart.reduce((total, item) => {
      if (listChecked.includes(item.product._id)) {
        return total + item.price * item.amount;
      }
      return total;
    }, 0);
  }, [cart, listChecked]);

  const priceDiscountMemo = useMemo(() => {
    return cart.reduce((total, item) => {
      if (listChecked.includes(item.product._id)) {
        const discountAmount = (item.price * item.discount) / 100;
        return total + discountAmount * item.amount;
      }
      return total;
    }, 0);
  }, [cart, listChecked]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 2000000 && priceMemo < 5000000) {
      return 10000;
    } else if (priceMemo >= 5000000) {
      return 2000;
    } else if (priceMemo > 0 &&priceMemo < 2000000){
      return 20000;
    } else return 0;
  }, [priceMemo]);
 
  const handleAddCard = () => {
    if (!shippingAddress?.phoneShip || !shippingAddress?.addressShip || !shippingAddress?.nameship || 
        !shippingAddress?.cityShip || !shippingAddress?.wardShip || !shippingAddress?.districtShip) {
      setIsOpenModalUpdateInfo(true);
    } else {
      // Filter cart items based on the checked list
      const selectedItems = cart.filter(item => listChecked.includes(item.product._id));
      if (selectedItems.length === 0) {
        message.error('Vui lòng chọn sản phẩm');
      } else {
        // Dispatch action selectedOrder với các sản phẩm đã chọn
        dispatch(selectedOrder({ listChecked: selectedItems }));
        navigate('/payment');
      }
  
    }
  };
  

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, shippingAddress } = data; 
      const res = UserService.updateUser(
        id,
        { shippingAddress }, // Truyền cả đối tượng shippingAddress
        token
      );
      return res;
    }
  );

  const {isPending, data} = mutationUpdate

  const handleCancleUpdate = () => {
    setStateUserDetails({
      isAdmin: false,
      shippingAddress: {  
        nameship: shippingAddress.nameship,
        addressShip: shippingAddress.addressShip,
        wardShip: shippingAddress.wardShip,
        districtShip: shippingAddress.districtShip,
        cityShip: shippingAddress.cityShip,
        phoneShip: shippingAddress.phoneShip,
    },
    })
    form.setFieldsValue({
      nameship: shippingAddress.nameship,
      phoneShip: shippingAddress.phoneShip,
      cityShip: shippingAddress.cityShip,
      districtShip: shippingAddress.districtShip,
      wardShip: shippingAddress.wardShip,
      addressShip: shippingAddress.addressShip,
    });
    setIsOpenModalUpdateInfo(false)
  }
  const handleUpdateInforUser = () => {
    const { nameship, addressShip, wardShip, districtShip, cityShip, phoneShip } = stateUserDetails.shippingAddress;
  
  
    // Kiểm tra nếu có đầy đủ thông tin trong shippingAddress
    if (nameship && addressShip && cityShip && phoneShip && wardShip && districtShip) {
      mutationUpdate.mutate(
        { 
          id: user?.id, 
          token: user?.access_token, 
          shippingAddress: { 
            nameship, 
            addressShip, 
            wardShip, 
            districtShip, 
            cityShip, 
            phoneShip 
          }
        },
        {
          onSuccess: () => {
            // Dispatch action để cập nhật thông tin người dùng với các thông tin mới
            dispatch(updateUser({
              shippingAddress: { nameship, addressShip, wardShip, districtShip, cityShip, phoneShip },
            }));
            setIsOpenModalUpdateInfo(false); // Đóng modal sau khi cập nhật thành công
          }
        }
      );
    } else {
      console.log("Vui lòng nhập đầy đủ thông tin giao hàng.");
    }
  };
  

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target;
    setStateUserDetails((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [name]: value }
    }));
  };

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await ShippingService.getProvinces();  
        setCities(response);
      } catch (error) {
        message.error('Không thể tải danh sách thành phố!');
      }
    };

    fetchCities();
  }, []);

  const handleCityChange = async (cityId) => {
    const selectedCity = cities.find((city) => city.ProvinceID === cityId);

    setStateUserDetails((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        cityShip: selectedCity?.ProvinceName || '',   
        districtShip: '',  
        wardShip: ''   
      }
    }));
    try {
      const response = await ShippingService.getDistricts(cityId); 
      console.log("Quận: ", response); 
      setDistricts(response);
    } catch (error) {
      message.error('Không thể tải danh sách quận/huyện!');
    }
  };

  const handleDistrictChange = async (districtId) => {
    console.log("District ID selected: ", districtId);   
    const selectedDistrict = districts.find((district) => district.DistrictID === districtId);
    console.log("name District: ", selectedDistrict);
    setStateUserDetails((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        districtShip: selectedDistrict?.DistrictName || '',  
        wardShip: ''  
      }
    }));
    try {
      const response = await ShippingService.getWards(districtId); 
      console.log("Huyện: ", response); 
      setWards(response);
    } catch (error) {
      message.error('Không thể tải danh sách phường/xã!');
    }
  };

  const handleWardChange = (wardId) => {
    console.log("wardId: ",wardId);
    setStateUserDetails((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        wardShip: wardId || ''
      }
    }));
  };
  
  const totalWeight = useMemo(() => {
    return cart.reduce((total, item) => {
      if (listChecked.includes(item.product._id)) {
        return total + item.amount * 1000;   
      }
      return total;
    }, 0);
  }, [cart, listChecked]);
  
  const getDistrictsByProvince = async (provinceId) => { 
    const districts = await ShippingService.getDistricts(provinceId);
    return districts;
  };

  const getWardsByDistrict = async (districtId) => { 
    const wards = await ShippingService.getWards(districtId);
    return wards;
  };
  const [shippingFee, setShippingFee] = useState(0);

  const calculateShippingFee = async () => {
    const fromDistrictId = 1458;  // Quận Bình Tân
    const { cityShip, districtShip, wardShip } = stateUserDetails.shippingAddress;
   
    const city = cities.find(c => c.ProvinceName === cityShip);

    const districts = await getDistrictsByProvince(city.ProvinceID);
    const district = districts.find(d => d.DistrictName === districtShip);
    console.log('district', district)
    const wards = await getWardsByDistrict(district.DistrictID);
    const ward = wards.find(w => w.WardName === wardShip);
  
    if (!city || !district || !ward) {
      message.error("Thông tin địa chỉ không hợp lệ.");
      return;
    }
  
    const shippingFee = await ShippingService.getShippingFee(
      fromDistrictId,
      district.DistrictID,
      ward.WardCode,
      totalWeight,
      priceMemo,
      priceDiscountMemo
    );
    setShippingFee(shippingFee);  
    console.log("Phí giao hàng: ", shippingFee);
    dispatch(setsShippingFee(shippingFee));
  };

  useEffect(() => {
    if (shippingAddress && listChecked.length > 0) {
      calculateShippingFee();
    }
  }, [shippingAddress, listChecked, cart, priceMemo, priceDiscountMemo]);

  const totalPriceMemo = useMemo(() => {
    return priceMemo - priceDiscountMemo + shippingFee;  
  }, [priceMemo, priceDiscountMemo, shippingFee]);

  const itemsDelivery = [
    {
      title: 'Phương thức giao hàng',  // Bước 1
      description: 'GiaoHangNhanh',
    },
    {
      title: 'Phí giao hàng',  // Bước 2 (hiển thị phí giao hàng)
      description:  `${convertPrice(shippingFee)} VND`,
    }
  ];

  const currentStep = shippingFee === 0 ? 0 : listChecked.length > 0 ? 1 : 2;

  return (
    <div style={{background: '#f5f5fa', width: '100%', minHeight: '100vh', paddingBottom: '200px'}}>
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <span style={{fontSize : '15px'}}>
          <span style={{
            cursor: 'pointer', 
            color: isHovered ? '#ea8500' : '#000' 
          }} 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}  
                onClick={() => navigate('/')}>Trang chủ</span> <span>\</span>
                <span style={{fontWeight: 'bold', color: 'blue'}}> Giỏ hàng </span>
                    </span>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            <h2>Phí giao hàng</h2>
            <WrapperStyleHeaderDilivery>
              <StepComponent items={itemsDelivery} current={currentStep} />;
            </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked.length === cart.length}></CustomCheckbox>
                  <span> Tất cả ({cart.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá gốc</span>
                  <span>Khuyến mãi</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleClearCart}/>
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {cart.map((item) =>{
                return (
                  <WrapperItemOrder key={item.product._id}>
                <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
                  <CustomCheckbox  onChange={() => onChange(item.product._id)} 
                    checked={listChecked.includes(item.product._id)} ></CustomCheckbox>
                  <img src={item.product.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap'
                  }}>{item.product.name}</div>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(item.price)}</span>
                  </span>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }}>{item.discount} %</span>
                  </span>
                  <WrapperCountOrder>
                  <button
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    onClick={() => handleChangeCount('decrease', item.product._id)}
                  >
                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                  </button>
                  <WrapperInputNumber defaultValue={item.amount} value={item.amount} size="small" min={1} max={item.product.countInStock} readOnly  />
                  <button
                    style={{ border: 'none', background: 'transparent', 
                      cursor: item.amount >= item.product.countInStock ? 'not-allowed' : 'pointer' }}
                      onClick={() => item.amount < item.product.countInStock && handleChangeCount('increase', item.product._id)}
                      disabled={item.amount >= item.product.countInStock}
                  >
                    <PlusOutlined style={{ color: item.amount >= item.product.countInStock ? '#ccc' : '#000',fontSize: '10px'}}/>
                  </button>
                  </WrapperCountOrder>
                  <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(item.price*item.amount - item.price*item.amount*item.discount/100)}</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(item?.product._id)}/>
                </div>
              </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
              {user?.id &&(
              <WrapperInfo>
                <div>
                  <span style={{ fontSize: "15px" , fontWeight: 'bold'}}>Địa chỉ: </span>
                  <span style={{ fontSize: "18px" }}>
                    {shippingAddress.addressShip &&
                    shippingAddress.wardShip &&
                    shippingAddress.districtShip &&
                    shippingAddress.cityShip
                      ? `${shippingAddress.addressShip}, ${shippingAddress.wardShip}, ${shippingAddress.districtShip}, ${shippingAddress.cityShip}`
                      : "Chưa có thông tin địa chỉ"}
                  </span>
                  <span onClick={handleChangeAddress} style={{fontWeight: 'bold', marginLeft: '5px',color: '#9255FD', cursor:'pointer', fontSize: "15px"}}>Thay đổi</span>
                </div>
              </WrapperInfo>
              )}
              <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span style={{fontSize: "13px"}}>Tổng giá chưa khuyến mãi </span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span style={{fontSize: "13px"}}>Tổng khuyến mãi</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}> - {convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span style={{fontSize: "13px"}}>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}> + {convertPrice(shippingFee)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span style={{fontSize: "13px"}}>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                  <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
              <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '360px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textbutton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
            </div>
            
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
            initialValues={{
              nameship: stateUserDetails.shippingAddress.nameship,
              phoneShip: stateUserDetails.shippingAddress.phoneShip,
              cityShip: stateUserDetails.shippingAddress.cityShip,
              districtShip: stateUserDetails.shippingAddress.districtShip,
              wardShip: stateUserDetails.shippingAddress.wardShip,
              addressShip: stateUserDetails.shippingAddress.addressShip,
            }}
          >
            <Form.Item
              label="Name"
              name="nameship"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails.shippingAddress.nameship} onChange={handleOnchangeDetails} name="nameship" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phoneShip"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetails.shippingAddress.phoneShip} onChange={handleOnchangeDetails} name="phoneShip" />
            </Form.Item>
            <Form.Item
              label="City"
              name="cityShip"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <Select
                value={stateUserDetails.shippingAddress.cityShip}
                onChange={handleCityChange}
                style={{ width: '100%' }}
              >
                {cities && cities.length > 0 ? (
                  cities.map((city) => (
                    <Select.Option key={city.ProvinceID} value={city.ProvinceID}>
                      {city.ProvinceName}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value={null}>No cities available</Select.Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item
              label="District"
              name="districtShip"
              rules={[{ required: true, message: 'Please input your district!' }]}
            >
              <Select
                value={stateUserDetails.shippingAddress.districtShip}
                onChange={handleDistrictChange}
                style={{ width: '100%' }}
              >
                  {districts && districts.length > 0 ? (
                    districts.map((district) => (
                      <Select.Option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option value={null}>No districts available</Select.Option>
                  )}
              </Select>
            </Form.Item>

            <Form.Item
              label="Ward"
              name="wardShip"
              rules={[{ required: true, message: 'Please input your ward!' }]}
            >
              <Select
                value={stateUserDetails.shippingAddress.wardShip}
                onChange={handleWardChange}
                style={{ width: '100%' }}
              >
                {wards && wards.length > 0 ? (
                  wards.map((ward) => (
                    <Select.Option key={ward.WardCode} value={ward.WardName}>
                      {ward.WardName}
                    </Select.Option>
                  ))
                ) : (
                  <Select.Option value={null}>No wards available</Select.Option>
                )}
              </Select>
            </Form.Item>
            

            <Form.Item
              label="Address"
              name="addressShip"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetails.shippingAddress.addressShip} onChange={handleOnchangeDetails} name="addressShip" />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default OrderPage
