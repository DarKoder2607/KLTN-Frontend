import { Col, Image, Rate, Row, Form, Modal, Table ,  Input,  } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperAddressProduct,  WrapperCounInStockProduct,  WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextCounInStock, WrapperStyleTextSell } from './Style'
import { MinusOutlined, PlusOutlined, } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import { initFacebookSDK } from '../../utils'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import InputComponent from '../InputComponent/InputComponent'
import * as  UserService from '../../services/UserService'
import { updateUser } from '../../redux/slides/userSlide';
import ReviewsSection from '../ReviewsSection/ReviewsSection'; 
import { addToCart } from '../../services/CartService'
import { addingToCart } from '../../redux/slides/cartSlice'

const { TextArea } = Input;

const ProductDetailsComponent = ({idProduct, userId }) => {
    const [numProduct, setNumProduct] = useState(1)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [errorLimitOrder,setErrorLimitOrder] = useState(false)
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)

    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({address: ''})
    const [isSpecsVisible, setIsSpecsVisible] = useState(false); 
    const [form] = Form.useForm();
    
    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
      }, [form, stateUserDetails])
    
    useEffect(() => {
    if(isOpenModalUpdateInfo) {
        setStateUserDetails({
        address: user?.address,
        })
    }
    }, [isOpenModalUpdateInfo])

    const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
    }

    const onChange  = (value) => { 
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if(id){
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if(productDetails?.countInStock === 0){
            setErrorLimitOrder(true)
        }
    },[numProduct])

    useEffect(() => {
        if(order.isSucessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSucessOrder])

    const handleChangeCount = (type, limited) => {
        if(type === 'increase') {
            if(!limited) {
                setNumProduct(numProduct + 1)
            }
        }else {
            if(!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const {isPending, data: productDetails} = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled : !!idProduct
    }) 
    console.log('productDetails', productDetails)

    const handleAddToCart = async () => {
        if (!user?.id) {
          message.warning('Vui lòng đăng nhập để có thế mua hàng');
          navigate('/sign-in', { state: location.pathname });
          return;
        }
      
        try {
          const res = await addToCart(productDetails._id, numProduct, user?.access_token);
          message.success('Đã thêm vào giỏ hàng thành công');
          dispatch(addingToCart({
            product: productDetails._id,
            name: productDetails.name,
            image: productDetails.image,
            amount: numProduct,
            price: productDetails.price,
            discount: productDetails.discount
          }));
        } catch (error) {
          message.error(error.response?.data?.message || 'Không thể thêm vào giỏ hàng !!!');
        }
      };

    const handleAllOrderProduct= () =>{
        if( !user?.id){
            message.warning('Vui lòng đăng nhập để có thế mua hàng')
            navigate ('/sign-in', {state: location?.pathname})
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || 
            (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

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
    const handleUpdateInforUser = () => {
        const {address} = stateUserDetails
        if( address ){
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
            onSuccess: () => {
                dispatch(updateUser({address}))
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

    const toggleSpecsTable = () => {
        setIsSpecsVisible(!isSpecsVisible);
    }

    const specsData = () => {
        let specs = [];
        
        // Kiểm tra deviceType và chọn thông số phù hợp
        switch (productDetails?.deviceType) {
          case 'phone':
            specs = [
              { key: '1', name: 'Màn hình:', value: productDetails?.phoneSpecs.screen },
              { key: '2', name: 'Hệ điều hành:', value: productDetails?.phoneSpecs.os },
              { key: '3', name: 'Camera:', value: productDetails?.phoneSpecs.camera },
              { key: '4', name: 'Camera trước:', value: productDetails?.phoneSpecs.cameraFront },
              { key: '5', name: 'CPU:', value: productDetails?.phoneSpecs.cpu },
              { key: '6', name: 'RAM:', value: productDetails?.phoneSpecs.ram },
              { key: '7', name: 'ROM:', value: productDetails?.phoneSpecs.rom },
              { key: '8', name: 'MicroUSB:', value: productDetails?.phoneSpecs.microUSB },
              { key: '9', name: 'Pin:', value: productDetails?.phoneSpecs.battery },
            ];
            break;
      
          case 'watch':
            specs = [
              { key: '1', name: 'Màn hình:', value: productDetails?.watchSpecs.screen },
              { key: '2', name: 'Hệ điều hành:', value: productDetails?.watchSpecs.os },
              { key: '3', name: 'Pin:', value: productDetails?.watchSpecs.battery },
              { key: '4', name: 'Bluetooth:', value: productDetails?.watchSpecs.bluetooth },
              { key: '5', name: 'Cảm biến:', value: productDetails?.watchSpecs.sensors },
              { key: '6', name: 'Kích thước:', value: productDetails?.watchSpecs.size },
              { key: '7', name: 'Chức năng:', value: productDetails?.watchSpecs.feature },
              { key: '8', name: 'Chất liệu:', value: productDetails?.watchSpecs.material },
              { key: '9', name: 'Dây đeo:', value: productDetails?.watchSpecs.strap}
            ];
            break;
      
          case 'laptop':
            specs = [
              { key: '1', name: 'Màn hình:', value: productDetails?.laptopSpecs.screen },
              { key: '2', name: 'Hệ điều hành:', value: productDetails?.laptopSpecs.os },
              { key: '3', name: 'CPU:', value: productDetails?.laptopSpecs.cpu },
              { key: '4', name: 'RAM:', value: productDetails?.laptopSpecs.ram },
              { key: '5', name: 'ROM:', value: productDetails?.laptopSpecs.rom },
              { key: '6', name: 'Pin:', value: productDetails?.laptopSpecs.battery },
              { key: '7', name: 'Cổng kết nối:', value: productDetails?.laptopSpecs.ports },
              { key: '8', name: 'Thẻ chip:', value: productDetails?.laptopSpecs.chipCard },
              { key: '9', name: 'Âm thanh:', value: productDetails?.laptopSpecs.sound },
              { key: '10', name: 'Thiết kế:', value: productDetails?.laptopSpecs.design },
              { key: '11', name: 'Chức năng:', value: productDetails?.laptopSpecs.feature },
            ];
            break;
      
          case 'tablet':
            specs = [
              { key: '1', name: 'Màn hình:', value: productDetails?.tabletSpecs.screen },
              { key: '2', name: 'Hệ điều hành:', value: productDetails?.tabletSpecs.os },
              { key: '3', name: 'Camera:', value: productDetails?.tabletSpecs.camera },

              { key: '5', name: 'CPU:', value: productDetails?.tabletSpecs.cpu },
              { key: '6', name: 'RAM:', value: productDetails?.tabletSpecs.ram },
              { key: '7', name: 'ROM:', value: productDetails?.tabletSpecs.rom },
              { key: '8', name: 'Pin:', value: productDetails?.tabletSpecs.battery },
              { key: '9', name: 'Xử lý đồ họa:', value: productDetails?.tabletSpecs.processorGraphics },
              { key: '10', name: 'Thiết kế:', value: productDetails?.tabletSpecs.design },
              { key: '11', name: 'Cổng kết nối:', value: productDetails?.tabletSpecs.ports },
              { key: '12', name: 'Chức năng:', value: productDetails?.tabletSpecs.feature },
            ];
            break;
      
          case 'headphone':
            specs = [
              { key: '1', name: 'Bluetooth:', value: productDetails?.headphoneSpecs.bluetooth },
              { key: '2', name: 'Pin:', value: productDetails?.headphoneSpecs.battery },
              { key: '3', name: 'Chiều dài:', value: productDetails?.headphoneSpecs.length },
              { key: '4', name: 'Chống ồn:', value: productDetails?.headphoneSpecs.noiseCancellation },
              { key: '5', name: 'Cổng kết nối:', value: productDetails?.headphoneSpecs.ports },
              { key: '6', name: 'Phạm vi:', value: productDetails?.headphoneSpecs.scope },
              { key: '7', name: 'Chất liệu:', value: productDetails?.headphoneSpecs.material },
              { key: '8', name: 'Thiết kế:', value: productDetails?.headphoneSpecs.design },
              { key: '9', name: 'Chức năng:', value: productDetails?.headphoneSpecs.feature },
            ];
            break;
      
          case 'loudspeaker':
            specs = [
              { key: '1', name: 'Bluetooth:', value: productDetails?.loudspeakerSpecs.bluetooth },
              { key: '2', name: 'Pin:', value: productDetails?.loudspeakerSpecs.battery },
              { key: '3', name: 'Chống nước:', value: productDetails?.loudspeakerSpecs.waterproof },
              { key: '4', name: 'Thiết kế:', value: productDetails?.loudspeakerSpecs.design },
              { key: '5', name: 'Điều khiển kết nối:', value: productDetails?.loudspeakerSpecs.connectControl },
              { key: '6', name: 'Âm thanh:', value: productDetails?.loudspeakerSpecs.audio },
            ];
            break;
      
          default:
            specs = [];
            break;
        }
     
        return specs;
        
      };
      

  return (
    <div>
        <Loading isPending={isPending}>
            <Row style={{padding: '16px', background: '#fff', borderRadius: '4px'}}>
                <Col span={10} style={{borderRight:'1px solid #e5e5e5', paddingRight: '8px'}}>
                    <Image src={productDetails?.image} alt="image product" preview="false"/>
                    <div style={{marginTop: '10px', marginBottom: '1px'}}>Các hình ảnh chi tiết hơn về sản phẩm: </div>
                    <Row style={{paddingTop: '10px', justifyContent: 'left' }}>
                        {productDetails?.relatedImages.map((image, index) => (
                            <WrapperStyleColImage key={index} span={4} >
                                <WrapperStyleImageSmall src={image} alt={`Related Image ${index}`} preview="false"  /> 
                            </WrapperStyleColImage>
                        ))}
                    </Row>

                </Col>
                <Col span={14} style={{paddingLeft: '10px'}}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />

                        <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 0} sản phẩm </WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        {productDetails?.discount > 0 ? (
                            <>
                                <WrapperPriceTextProduct >
                                    <span style={{ textDecoration: 'line-through' , fontSize: '20px'}}  className='origin-price'>{productDetails?.price.toLocaleString()} VNĐ  </span>
                                    <span style={{ fontSize:'15px', color: 'red'} }>  -{productDetails?.discount}%</span>
                                    <span className='discount-price'> 
                                        {(productDetails?.price - productDetails?.price*(productDetails?.discount/100)).toLocaleString()} VNĐ
                                    </span>
                                </WrapperPriceTextProduct>
                            </>
                        ) : (
                            <WrapperPriceTextProduct><span className='origin-price'>{productDetails?.price.toLocaleString()} VNĐ </span></WrapperPriceTextProduct>
                        )}
                    </WrapperPriceProduct>


                    <WrapperAddressProduct>
                        <span> Giao đến </span>
                        <span className='address'>{user?.address}</span>  - 
                        <span onClick={handleChangeAddress} className='change-address'> Đổi địa chỉ </span>
                    </WrapperAddressProduct>
                    <LikeButtonComponent
                        dataHref={ process.env.REACT_APP_IS_LOCAL 
                                    ? "https://developers.facebook.com/docs/plugins/" 
                                    : window.location.href
                                } 
                    />
                    <div style={{margin: '10px 0 20px',padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: ' 1px solid #e5e5e5'}}>
                        <WrapperCounInStockProduct>
                            <WrapperStyleTextCounInStock>Thiết bị còn sẵn {productDetails?.countInStock} sản phẩm trong kho hàng</WrapperStyleTextCounInStock>
                        </WrapperCounInStockProduct>
                        <div style={{marginBottom: '10px'}}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',numProduct === 1)}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div>
                            <ButtonComponent
                                bordered={false}
                                size={20} 
                                // variant = "borderless"
                                styleButton={{background: 'rgb(255,57,69)', height: '48px', width: '220px', border: 'none', borderRadius: '4px'}} 
                                onClick={handleAddToCart}
                                textbutton={'Thêm vào giỏ hàng'}
                                styleTextButton={{color: '#fff', fontSize: '15px', fontWeight:' 700'}}
                            > 
                            </ButtonComponent>

                            {errorLimitOrder && <div style={{color: 'red'}}>Sản phẩm đã hết hàng</div>}
                        </div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: '#fff',
                                    height: '48px',
                                    width: '220px',
                                    border: '1px solid rgb(13, 92, 182)',
                                    borderRadius: '4px'
                                }}
                                textbutton={'Thông số kĩ thuật'}
                                styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
                                onClick={toggleSpecsTable}
                            ></ButtonComponent>
                    </div>
                </Col>
                <div style={{ marginTop: "40px" }}>
                   
                    <ReviewsSection productId={idProduct} userId={userId} />
                    
                </div>
            
            </Row>
        </Loading>

        <Modal
            title="Thông số kỹ thuật"
            open={isSpecsVisible}
            onCancel={toggleSpecsTable}
            footer={null}
        >
            <Table
                    dataSource={specsData()}
                    columns={[
                        { title: 'Tên', dataIndex: 'name' },
                        { title: 'Thông số', dataIndex: 'value' },
                    ]}
                    pagination={false}
                    rowKey="key"
            />
        </Modal>

        <ModalComponent title="Cập nhật địa chỉ giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
            <Loading isPending={isPending}>
            <Form
                name="basic"
                // onFinish={onUpdateUser}
                autoComplete="on"
                form={form}
            >
                <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your  address!' }]}
                >
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                </Form.Item>
            </Form>
            </Loading>
        </ModalComponent>
    </div>

  )
}

export default ProductDetailsComponent
