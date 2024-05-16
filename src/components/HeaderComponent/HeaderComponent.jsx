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
    HomeOutlined
  } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../../redux/slides/userSlide.js'
import Loading from '../LoadingComponent/Loading.jsx';
import { searchProduct } from '../../redux/slides/productSlide.js';
const HeaderComponent = ({isHiddenSearch = false, isHiddenCart =false}) => {

    const navigate = useNavigate()
    const user =  useSelector((state) => state.user)
    const dispatch = useDispatch()
    const order = useSelector((state) => state.order)
    const [search, setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [loading, setLoading] =useState(false)
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false) 

    const handleNavigateLogin = () =>{
        navigate('/sign-in')
    }

    const handleLogout = async() => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
        navigate('/')
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}> <UserOutlined/> Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}><SettingOutlined/> Quản lí hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}><ShoppingOutlined/> Đơn hàng của tôi</WrapperContentPopup>
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
        message.success("Đăng xuất thành công ! ")
    }

    const handleCancelLogout = () => {
        setIsLogoutModalVisible(false)
    }

    return (
        <div style={{width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent:'center'}}>
            <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset'}}>
                <Col span={5}>
                    <WrapperTextHeader style={{cursor: 'pointer'}} onClick={() => navigate('/')}><HomeOutlined/> DH PHONESTORE</WrapperTextHeader>
                </Col>
                {!isHiddenSearch &&(
                    <Col span={13}>
                    <ButtonInputSearch
                        bordered="false"
                        placeholder="Nhập vào tên thiết bị bạn muốn tìm kiếm..."
                        textbutton="Tìm kiếm"
                        size="large"
                         onChange={onSearch}
                    />
                    </Col>
                )}
                
                <Col span={6} style={{display: 'flex', gap: '54px', alignItems: "center"}}>
                    <Loading isPending={loading}>
                        <WrapperHeaderAccount>
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
                    </Loading>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{cursor : 'pointer'}}>
                            <Badge count={order?.orderItems?.length} size='small'>
                                <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                    
                </Col>
            </WrapperHeader>
            <Modal
                title="Xác nhận đăng xuất"
                visible={isLogoutModalVisible}
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
