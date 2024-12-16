import { Col,  Rate, Row, Form, Modal, Table ,  Input,  } from 'antd'
import React, { useEffect, useState } from 'react'
import { BlinkTitle, WrapperAddressProduct,  WrapperCounInStockProduct,  WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperProducts2, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextCounInStock, WrapperStyleTextSell } from './Style'
import { CloseOutlined, LeftOutlined, MinusOutlined, PlusOutlined, RightOutlined, RightSquareOutlined, } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import {  resetOrder } from '../../redux/slides/orderSlide'
import * as message from '../Message/Message' 
import { initFacebookSDK } from '../../utils'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import InputComponent from '../InputComponent/InputComponent'
import * as  UserService from '../../services/UserService'
import { updateUser } from '../../redux/slides/userSlide';
import ReviewsSection from '../ReviewsSection/ReviewsSection'; 
import { addToCart } from '../../services/CartService'
import { addingToCart } from '../../redux/slides/cartSlice'
import CardComponent from '../CardComponent/CardComponent'

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
            const res = await ProductService.getRecommedProduct(id)
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

    const {isPending, data: productDetailsData} = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled : !!idProduct
    }) 
    
    const productDetails = productDetailsData?.product;
    const relatedProducts = productDetailsData?.relatedProducts;


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

    // const handleAllOrderProduct= () =>{
    //     if( !user?.id){
    //         message.warning('Vui lòng đăng nhập để có thế mua hàng')
    //         navigate ('/sign-in', {state: location?.pathname})
    //     } else {
    //         const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
    //         if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || 
    //         (!orderRedux && productDetails?.countInStock > 0)) {
    //             dispatch(addOrderProduct({
    //                 orderItem: {
    //                     name: productDetails?.name,
    //                     amount: numProduct,
    //                     image: productDetails?.image,
    //                     price: productDetails?.price,
    //                     product: productDetails?._id,
    //                     discount: productDetails?.discount,
    //                     countInstock: productDetails?.countInStock
    //                 }
    //             }))
    //         } else {
    //             setErrorLimitOrder(true)
    //         }
    //     }
    // }

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
      
          case 'audio':
            specs = [
              { key: '1', name: 'Bluetooth:', value: productDetails?.audioSpecs.bluetooth },
              { key: '2', name: 'Pin:', value: productDetails?.audioSpecs.battery },
              { key: '3', name: 'Chiều dài:', value: productDetails?.audioSpecs.length },
              { key: '4', name: 'Chống ồn:', value: productDetails?.audioSpecs.noiseCancellation },
              { key: '5', name: 'Cổng kết nối:', value: productDetails?.audioSpecs.ports },
              { key: '6', name: 'Phạm vi:', value: productDetails?.audioSpecs.scope },
              { key: '7', name: 'Chất liệu:', value: productDetails?.audioSpecs.material },
              { key: '8', name: 'Thiết kế:', value: productDetails?.audioSpecs.design },
              { key: '9', name: 'Chức năng:', value: productDetails?.audioSpecs.feature },
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
      
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentStartIndex, setCurrentStartIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);  
    const allImages = [productDetails?.image, ...(productDetails?.relatedImages || [])];
    const imagesToShow = 6;

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleClickThumbnail = (index) => {
        setCurrentImageIndex(index);
    };

    const handleNextThumbnail = () => {
        if (currentStartIndex + imagesToShow < allImages.length) {
            setCurrentStartIndex(currentStartIndex + 1);
        }
    };

    const handlePrevThumbnail = () => {
        if (currentStartIndex > 0) {
            setCurrentStartIndex(currentStartIndex - 1);
        }
    };

    const openImageModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalVisible(true);
    };
 
    const closeImageModal = () => {
        setIsModalVisible(false);
    };

    const thumbnails = allImages.slice(currentStartIndex, currentStartIndex + imagesToShow);

  return (
    <div>
        <Loading isPending={isPending}>
            <Row style={{padding: '16px', background: '#fff', borderRadius: '4px'}}>
            <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                    <img 
                        src={allImages[currentImageIndex]} 
                        alt="Main product image" 
                        style={{ height: '500px',  cursor: 'pointer', width: '510px', borderRadius: '8px', objectFit: 'contain',  objectPosition: 'center' }} 
                        onClick={() => openImageModal(currentImageIndex)}
                    />
 
                    <button 
                        onClick={handlePrevImage} 
                        style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '5px', 
                            transform: 'translateY(-50%)', 
                            background: 'rgba(0,0,0,0.5)', 
                            border: 'none', 
                            color: '#fff', 
                            borderRadius: '50%', 
                            width: '32px', 
                            height: '32px', 
                            cursor: 'pointer',
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}
                    >
                        <LeftOutlined />
                    </button>

                    <button 
                        onClick={handleNextImage} 
                        style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            right: '5px', 
                            transform: 'translateY(-50%)', 
                            background: 'rgba(0,0,0,0.5)', 
                            border: 'none', 
                            color: '#fff', 
                            borderRadius: '50%', 
                            width: '32px', 
                            height: '32px', 
                            cursor: 'pointer',
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}
                    >
                        <RightOutlined />
                    </button>
                </div>
 
                <div style={{ marginTop: '10px', marginBottom: '1px' }}>
                    Các hình ảnh chi tiết hơn về sản phẩm:
                </div>
 
                <div style={{ position: 'relative' }}>
                
                    {currentStartIndex > 0 && (
                        <button 
                            onClick={handlePrevThumbnail} 
                            style={{ 
                                position: 'absolute',   
                                top: '55%', 
                                right: '1px',  
                                transform: 'translateY(-50%)',  
                                background: 'rgba(0,0,0,0.5)', 
                                border: 'none', 
                                color: '#fff', 
                                cursor: 'pointer', 
                                padding: '5px 10px',
                                borderRadius: '50%',
                                zIndex: 2 
                            }}
                        >
                            <LeftOutlined />
                        </button>
                    )}

                    {currentStartIndex + imagesToShow < allImages.length && (
                        <button 
                            onClick={handleNextThumbnail} 
                            style={{ 
                                position: 'absolute',  
                                top: '55%', 
                                right: '1px',  
                                transform: 'translateY(-50%)', 
                                background: 'rgba(0,0,0,0.5)', 
                                border: 'none', 
                                color: '#fff', 
                                cursor: 'pointer', 
                                padding: '5px 10px',
                                borderRadius: '50%',
                                zIndex: 2  
                            }}
                        >
                            <RightOutlined />
                        </button>
                    )}
 
                    <Row style={{ paddingTop: '10px', justifyContent: 'left' }}>
                        {thumbnails.map((image, index) => (
                            <WrapperStyleColImage key={index} span={4}>
                                <WrapperStyleImageSmall 
                                    src={image} 
                                    alt={`Related Image ${index}`} 
                                    preview="false" 
                                    style={{ 
                                        height: '80px', 
                                        width: '85px',  
                                        borderRadius: '8px',  
                                        objectFit: 'contain',  
                                        objectPosition: 'center',  
                                        border: currentImageIndex === (currentStartIndex + index) ? '2px solid #1890ff' : 'none', 
                                        cursor: 'pointer' 
                                      }}
                                    onClick={() => handleClickThumbnail(currentStartIndex + index)} 
                                />
                            </WrapperStyleColImage>
                        ))}
                    </Row>
                </div>
            </Col>

            <Modal 
                   open={isModalVisible} 
                   footer={null} 
                   onCancel={closeImageModal} 
                   centered 
                   closable={false} 
                   bodyStyle={{ 
                       padding: 0, 
                       textAlign: 'center', 
                       height: '90vh', 
                       display: 'flex', 
                       justifyContent: 'center', 
                       alignItems: 'center' 
                   }} 
                   width="80vw" 
            >
                <div style={{ position: 'relative' }}>
                    <img 
                        src={allImages[currentImageIndex]} 
                        alt="Enlarged product image" 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            maxHeight: '90vh', 
                            maxWidth: '90vw', 
                            objectFit: 'contain' 
                        }} 
                    />

                </div>

                <button 
                        onClick={handlePrevImage} 
                        style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '5px', 
                            transform: 'translateY(-50%)', 
                            background: 'rgba(0,0,0,0.5)', 
                            border: 'none', 
                            color: '#fff', 
                            borderRadius: '50%', 
                            width: '40px', 
                            height: '40px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}
                    >
                        <LeftOutlined />
                    </button>

                    <button 
                        onClick={handleNextImage} 
                        style={{ 
                            position: 'absolute', 
                            top: '50%', 
                            right: '5px', 
                            transform: 'translateY(-50%)', 
                            background: 'rgba(0,0,0,0.5)', 
                            border: 'none', 
                            color: '#fff', 
                            borderRadius: '50%', 
                            width: '40px', 
                            height: '40px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}
                    >
                        <RightOutlined />
                    </button>

                    <button 
                        onClick={closeImageModal} 
                        style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            right: '10px', 
                            background: 'rgba(0,0,0,0.7)', 
                            border: 'none', 
                            color: '#fff', 
                            borderRadius: '50%', 
                            width: '32px', 
                            height: '32px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}
                    >
                        <CloseOutlined />
                    </button>

            </Modal>

                <Col span={14} style={{paddingLeft: '10px'}}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />

                        <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 0} sản phẩm </WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        {productDetails?.discount > 0 ? ( 
                            <WrapperPriceTextProduct>
                                <span style={{ textDecoration: 'line-through', fontSize: '20px' }} className='origin-price'>
                                    {productDetails?.price.toLocaleString()} VNĐ
                                </span>
                                <span style={{ fontSize: '15px', color: 'red' }}>
                                    -{productDetails?.discount}%
                                </span>
                                <span className='discount-price'>
                                    {(productDetails?.price - productDetails?.price * (productDetails?.discount / 100)).toLocaleString()} VNĐ
                                </span>
                            </WrapperPriceTextProduct>
                        ) : productDetails?.discount === 0 && productDetails?.price < productDetails?.originPrice ? ( 
                            <WrapperPriceTextProduct>
                                <span style={{ textDecoration: 'line-through', fontSize: '20px' }} className='origin-price'>
                                    {productDetails?.originPrice.toLocaleString()} VNĐ
                                </span>
                                <span style={{ fontSize: '15px', color: 'red' }}>
                                    -{(productDetails?.originPrice - productDetails?.price).toLocaleString()}
                                </span>
                                <span className='discount-price'>
                                    {productDetails?.price.toLocaleString()} VNĐ
                                </span>
                            </WrapperPriceTextProduct>
                        ) : ( 
                            <WrapperPriceTextProduct>
                                <span className='origin-price'>
                                    {productDetails?.price.toLocaleString()} VNĐ
                                </span>
                            </WrapperPriceTextProduct>
                        )}
                    </WrapperPriceProduct>

                    {user?.id &&(
                    <WrapperAddressProduct>
                        <span> Giao đến </span>
                        <span className='address'>{user?.address}</span>  - 
                        <span onClick={handleChangeAddress} className='change-address'> Đổi địa chỉ </span>
                    </WrapperAddressProduct>
                    )}
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

                <Col span={24} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <div style={{
                        backgroundColor: '#ffc04d', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        width: '100%', 
                    }}>
                        <BlinkTitle>SẢN PHẨM BẠN CÓ THỂ QUAN TÂM</BlinkTitle>
                
                        <WrapperProducts2 style={{  display: 'flex', justifyContent: 'center', textAlign:'center',backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                            {relatedProducts?.map((product) => {
                            if (!product.isHidden) {
                            return (
                                <CardComponent
                                    key={product._id}
                                    countInStock={product.countInStock}
                                    decription={product.decription}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                    deviceType={product.deviceType}
                                    selled={product.selled}
                                    discount={product.discount}
                                    id={product._id}
                                />
                                );
                            }
                            return null; 
                        })}
                        </WrapperProducts2>
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
