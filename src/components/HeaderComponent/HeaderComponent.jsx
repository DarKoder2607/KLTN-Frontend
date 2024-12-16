import { Badge, Col, Popover, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import * as UserService from '../../services/UserService.js'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './Style.js'
import {
    CaretDownOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    ShoppingOutlined,
    BellOutlined
  } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import imagelogo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, updateUser } from '../../redux/slides/userSlide.js'
import { searchProduct } from '../../redux/slides/productSlide.js';
import { removeAllOrderLogout} from '../../redux/slides/orderSlide.js';
import { clearsCart, setCarts } from '../../redux/slides/cartSlice.js';
import { getCart } from '../../services/CartService.js';
const HeaderComponent = ({isHiddenSearch = false, isHiddenCart =false, isHiddenNotification = false}) => {

    const navigate = useNavigate()
    const user =  useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [unreadCount, setUnreadCount] = useState(0);
    const cart = useSelector((state) => state.cart); 
    const totalCartQuantity = cart?.cartItems?.reduce((total, item) => total + item.amount, 0);
   
    const [search, setSearch] = useState('')
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [loading, setLoading] =useState(false)
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false) 

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds} giây trước`;
        } else if (diffInSeconds < 3600) { 
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        } else {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} tháng trước`;
        }
    };
    

    const handleNavigateLogin = () =>{
        navigate('/sign-in')
    }

    const handleLogout = async() => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        dispatch(removeAllOrderLogout())
        setLoading(false)
        navigate('/')
    }

    useEffect(() => {
        const handleBeforeUnload = () => {
            dispatch(clearsCart());  
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);  
     
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dispatch]);

    useEffect(() => {
        if (user?.id && user?.access_token) {
            handleGetDetailsUser(user?.id, user?.access_token)
        }
    }, [user?.id, user?.access_token]) 

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }


    useEffect(() => {
        if (user?.access_token) {
          const fetchCart = async () => {
            try {
              const response = await getCart(user.access_token); 
              dispatch(setCarts(response.cartItems));  
            } catch (error) {
              console.error('Lỗi khi lấy giỏ hàng:', error);
            }
          };
          fetchCart();
        }
      }, [user?.access_token, dispatch]); 

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await UserService.getNotifications(user.id, user.access_token);
            setNotifications(res.notifications);
          
            const unreadCount = res.notifications.filter(notification => !notification.read).length;
            setUnreadCount(unreadCount); 
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        const interval = setInterval(() => {
            if (user?.id && user.access_token) {
                updateUnreadCount();
            }
        }, 3000);  
        return () => clearInterval(interval);
    }, [user?.id, user?.access_token]);
    
    const updateUnreadCount = async () => {
        try { 
            const res = await UserService.getNotifications(user.id, user.access_token); 
            const unreadCount = res.notifications.filter(notification => !notification.read).length; 
            setUnreadCount(unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
    

    const handleMarkNotificationsAsRead = async () => {
        try {
            await UserService.markNotificationsAsRead(user.id, user.access_token);
            setUnreadCount(0);   
            fetchNotifications(); 
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        if (user?.id && user.access_token) {
            fetchNotifications();
        }
    }, [isNotificationOpen, user?.id, user?.access_token]);

    useEffect(() => {
        if (!user?.access_token) {
            setUnreadCount(0);  
            setNotifications([]);
            dispatch(clearsCart());
        }
    }, [user?.access_token]);

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}> <UserOutlined/> Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}><SettingOutlined/> Quản lí hệ thống</WrapperContentPopup>
            )}
            {!user?.isAdmin&& (
            <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}><ShoppingOutlined/> Đơn hàng của tôi</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => setIsLogoutModalVisible(true)}><LogoutOutlined/> Đăng xuất</WrapperContentPopup> 
        </div>
    )
    

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    const handleClickNavigate = (type) => {
        if(type === 'profile') {
          navigate('/profile-user')
        }else if(type === 'admin') {
          navigate('/system/admin')
        }else if(type === 'my-order') {
          navigate('/my-order',{ state : {
              id: user?.id,
              token : user?.access_token
            }
          })
        }else {
          handleLogout()
        }
        setIsOpenPopup(false)
      }

    const handleConfirmLogout = () => {
        handleLogout()
        setIsLogoutModalVisible(false)
        dispatch(clearsCart())
        message.success("Đăng xuất thành công ! ")
    }

    const handleCancelLogout = () => {
        setIsLogoutModalVisible(false)
    }

    const notificationContent = (
        <div style={{ width: '350px', display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <p>Loading...</p>
            ) : notifications.length > 0 ? (
                <>
                    <button 
                        onClick={handleMarkNotificationsAsRead} 
                        style={{ 
                            cursor: 'pointer', 
                            padding: '5px 10px', 
                            backgroundColor: '#f39c18', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '5px', 
                            marginBottom: '10px', 
                            transition: 'all 0.3s ease', 
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
                        }} 
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                        }} 
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                        }}
                    >
                        Đánh dấu tất cả là đã đọc
                    </button>
                    <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                        {notifications.slice(0, 10).map((notification, index) => (
                            <div 
                                key={index} 
                                style={{ 
                                    padding: '5px', 
                                    borderBottom: '1px solid #ddd', 
                                    backgroundColor: notification.read ? '#fff' : '#ffe0cc', 
                                    borderRadius: '5px', 
                                    marginBottom: '2px' 
                                }}
                            >
                                <strong>{notification.title}</strong>
                                <p>{notification.content}</p>
                                <small style={{ color: '#888', display: 'flex',textAlign: 'right', justifyContent: 'right' }}>{formatTimeAgo(new Date(notification.createdAt))}</small>  
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Không có thông báo nào</p>
            )}
        </div>
    );
    
    

    return (
        <div style={{width: '100%', background: 'rgb(243, 156, 18)', display: 'flex', justifyContent:'center'}}>
            <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset'}}>
                <Col span={5}>
                <WrapperTextHeader onClick={() => navigate('/')}>
                    <img src={imagelogo} alt="Logo" className="logo-image" />
                    <span className="header-text" style={{fontSize: '22px', fontWeight: 'bold'}}>DH PHONESTORE</span>
                </WrapperTextHeader>
                </Col>
                {!isHiddenSearch &&(
                    <Col span={13}>
                    <ButtonInputSearch
                        bordered="false"
                        placeholder="Nhập vào tên thiết bị bạn muốn tìm kiếm..."
                        size="large"
                        onChange={onSearch}
                    />
                    </Col>
                )}
            
                <Col span={6} style={{display: 'flex', gap: '20px', alignItems: "center"}}>
                   
                        <WrapperHeaderAccount style={{ width : 160}}>
                            {userAvatar ? ( 
                                <img src={userAvatar} alt="avatar" style={{
                                    height: '30px',
                                    width: '30px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'}}
                                />
                            ) : (  
                            <UserOutlined style={{fontSize: '30px'}}/>
                             )}
                            {user?.access_token ?(
                                <>                            
                                    <Popover content={content} trigger="click" open={isOpenPopup}>
                                        <div style={{ cursor: 'pointer',maxWidth: 100, overflow: 'hidden', 
                                        textOverflow: 'ellipsis' }} onClick={() => setIsOpenPopup((prev) => 
                                                        !prev)}>{userName?.length ? userName : user?.email}</div>
                                    </Popover>
                                </>
                            ): (
                            <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
                                <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                <div>
                                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                    <CaretDownOutlined />
                                </div>
                            </div>  
                            )}
                        </WrapperHeaderAccount>
                  

                    {!isHiddenNotification &&(
                    <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: "center" }}>
                        <div>
                            <Popover
                                content={notificationContent}
                                trigger="click"
                                placement="bottomLeft" 
                                open={isNotificationOpen}
                                onOpenChange={(open) => setIsNotificationOpen(open)}
                            >
                                <div style={{ cursor: 'pointer' }}>
                                <Badge count={unreadCount} size='small'>
                                    <BellOutlined 
                                        
                                        style={{ fontSize: '30px', color: '#fff', marginLeft: '18px' , transition: 'all 0.3s ease', transform: 'translateY(0)' }} 
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-3px)';  
                                        }} 
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';  
                                        }}  />
                                </Badge>
                                <span style={{ color: '#fff'}}>Thông báo</span>
                                </div>
                            </Popover>
                        </div>
                    </Col>
                    )}
                    
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{cursor : 'pointer'}}>
                            <Badge count={totalCartQuantity} size='small'>
                                <ShoppingCartOutlined 
                                style={{fontSize: '30px', color: '#fff', marginLeft: '5px', transition: 'all 0.3s ease', transform: 'translateY(0)' }} 
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';  
                                }} 
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';  
                                }}  />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                    
                </Col>
            </WrapperHeader>
            <Modal
                title="Xác nhận đăng xuất"
                open={isLogoutModalVisible}
                onOk={handleConfirmLogout}
                onCancel={handleCancelLogout}
                okText="Đăng xuất"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn đăng xuất?</p>
            </Modal>
        </div>
  )
}

export default HeaderComponent
