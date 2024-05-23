import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as UserService from '../../services/UserService';
import { success, error } from '../../components/Message/Message';
import { WrapperContainerLeft, WrapperContainerRight } from '../ForgotPasswordPage/Style';
import InputForm from '../../components/InputForm/InputForm';
import { Image } from 'antd';
import imagelogo from '../../assets/images/Shipper_CPS3.webp'
import { EyeFilled, EyeInvisibleFilled, HomeOutlined } from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate()
    const [isShowPassword, setIsShowPasswword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPasswword] = useState(false)

    const handleOnchangePassword = (value) => {
        setNewPassword(value);
    }

    const handleNavigateSignIn = () =>{
        navigate('/sign-in')
    }

    const handleNavigateHome = () => {
      navigate('/')
    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value);
    }

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            error('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            await UserService.resetPassword({ token, newPassword, confirmPassword });
            success('Mật khẩu đã được đặt lại thành công.');
            // Chuyển hướng đến trang Đăng Nhập sau khi đặt lại mật khẩu thành công
            handleNavigateSignIn()
        } catch (err) {
            error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent : 'center', background: 'rgba(0,0,0,0.53)', height: "100vh"}}>
          <div style={{width: '800px', height:'445px', borderRadius: '6px', background: '#fff', display: 'flex'}}>
            <WrapperContainerLeft>
              <h1 style={{color: 'red'}}>WELCOME TO DH PHONESTORE !</h1>
              <p style={{fontSize: "15px",display: 'flex',justifyContent : 'center', 
                      alignItems: 'center', fontWeight : 'bold'}}>Đặt Lại Mật Khẩu</p>
              <div style={{position:'relative'}}>
                <span
                  onClick={() => setIsShowPasswword(!isShowPassword)}
                  style={{
                    zIndex: 10,
                    position: 'absolute',
                    top: '4px',
                    right: '8px'
                  }}
                >{
                  isShowPassword ? (
                    <EyeFilled/>
                  ) : (
                    <EyeInvisibleFilled/>
                  )
                }
                </span>
                <InputForm placeholder = "Nhập mật khẩu mới" style ={{marginBottom: ' 10px'}} 
                            type={isShowPassword ? "text": "password"} value={newPassword} onChange={handleOnchangePassword}/>
              </div>
              <div style={{position:'relative'}}>
                <span 
                  onClick={() => setIsShowConfirmPasswword(!isShowConfirmPassword)}
                  style={{
                    zIndex: 10,
                    position: 'absolute',
                    top: '4px',
                    right: '8px'
                  }}
                >{
                  isShowConfirmPassword ? (
                    <EyeFilled/>
                  ) : (
                    <EyeInvisibleFilled/>
                  )
                }
                </span>
                <InputForm placeholder = "Nhập xác nhận lại Password..." type = {isShowConfirmPassword ? "text" : "password"} 
                            value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
              </div>
               
                <ButtonComponent
                  disabled = { !newPassword.length || !confirmPassword.length}
                  onClick= {handleResetPassword}
                  size={20} 
                  // variant = "borderless"
                  styleButton={{background: 'rgb(255,57,69)', height: '48px', width: '100%', border: 'none', borderRadius: '4px', margin: '26px 0 10px'}} 
                  textbutton={'Đặt lại mật khẩu mới'}
                  styleTextButton={{color: '#fff', fontSize: '15px', fontWeight:' 700'}}
                        > 
                </ButtonComponent>
              

            </WrapperContainerLeft>
            <WrapperContainerRight>
              <HomeOutlined
                onClick={handleNavigateHome}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'rgb(13, 92, 182)',
                }}> 
            </HomeOutlined>
              <Image  src={imagelogo} preview = {false} alt='image-logo' height="203px" width="203px" />
              <h4>Mua sắm tại HDStore</h4>
            </WrapperContainerRight>
          </div>
        </div>
      )
};

export default ResetPasswordPage;
