import { Badge, Col, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import * as UserService from '../../services/UserService.js'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './Style.js'
import {
    CaretDownOutlined,
    ShoppingCartOutlined,
    UserOutlined
  } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser } from '../../redux/slides/userSlide.js'
import Loading from '../LoadingComponent/Loading.jsx';
const HeaderComponent = ({isHiddenSearch = false, isHiddenCart =false}) => {

    const navigate = useNavigate()
    const user =  useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [loading, setLoading] =useState(false)
    const handleNavigateLogin = () =>{
        navigate('/sign-in')
    }

    const handleLogout = async() => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
            <WrapperContentPopup onClick={() => navigate ('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => navigate ('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
            )}
            
        </div>
    )
    // console.log('user', user?.name?.length ? user?.name : user?.email)
    return (
        <div style={{width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent:'center'}}>
            <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset'}}>
                <Col span={5}>
                    <WrapperTextHeader>HDPHONESTORE</WrapperTextHeader>
                </Col>
                {!isHiddenSearch &&(
                    <Col span={13}>
                    <ButtonInputSearch
                        bordered="false"
                        placeholder="input search text"
                        textButton="Tìm kiếm"
                        size="large"
                        //  onSearch={onSearch}
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
                                    <Popover content={content}trigger= "click">
                                        <div style={{cursor: 'pointer'}}>{userName?.length ? userName : user?.email}</div>
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
                        <div>
                            <Badge count={5} size='small'>
                                <ShoppingCartOutlined style={{fontSize: '30px', color: '#fff'}} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </div>
                    )}
                    
                </Col>
            </WrapperHeader>
        </div>
  )
}

export default HeaderComponent
